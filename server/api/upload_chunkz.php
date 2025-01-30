<?php

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

class ChunkUploadHandler
{
    private $uploadDir;
    private $chunkDir;

    public function __construct()
    {
        $baseDir = realpath(__DIR__ . '/../MEDIA/');
        $this->uploadDir = $baseDir . '\course_files\\';
        $this->chunkDir = $baseDir . '\temp_chunks\\';

        if (!file_exists($this->uploadDir)) {
            $create_dir = @mkdir($this->uploadDir, 0777, true);
            error_log("Upload Directory creation. "($create_dir ? "successful" : "failed") . ": " . $this->uploadDir);
        }

        if (!file_exists($this->chunkDir)) {
            $created = @mkdir($this->chunkDir, 0777, true);
            error_log("Chunk directory creation " . ($created ? "successful" : "failed") . ": " . $this->chunkDir);
        }
    }

    public function handleUpload()
    {
        try {


            if (!isset($_FILES['chunk']) || !isset($_POST['chunkIndex']) || !isset($_POST['totalChunks']) || !isset($_POST['fileId'])) {
                error_log("Missing parameters. Required fields check failed.");
                return $this->sendResponse(400, false, 'Missing parameters');
            }

            $chunk = $_FILES['chunk'];
            $chunkIndex = (int) $_POST['chunkIndex'];
            $totalChunks = (int) $_POST['totalChunks'];
            $fileId = $_POST['fileId'];
            $originalFileName = $_POST['fileName'] ?? '';
            $originalFileType = $_POST['fileType'] ?? '';


            if ($chunkIndex === 0) {
                $allowedTypes = ['video/mp4', 'application/pdf'];
                if (!in_array($originalFileType, $allowedTypes)) {
                    error_log("Invalid file type: {$originalFileType}");
                    return $this->sendResponse(400, false, 'Invalid file type: ' . $originalFileType);
                }
            }

            $chunkPath = "{$this->chunkDir}{$fileId}_{$chunkIndex}";
            error_log("Attempting to move file to: {$chunkPath}");

            if (!move_uploaded_file($chunk['tmp_name'], $chunkPath)) {
                error_log("move_uploaded_file failed. PHP error: " . error_get_last()['message']);
                error_log("Target path exists: " . (file_exists(dirname($chunkPath)) ? 'yes' : 'no'));
                error_log("Target path writable: " . (is_writable(dirname($chunkPath)) ? 'yes' : 'no'));
                return $this->sendResponse(500, false, 'Failed to save chunk');
            }

            error_log("Successfully saved chunk to: {$chunkPath}");

            if ($this->areAllChunksUploaded($fileId, $totalChunks)) {
                $finalFileName = $this->assembleChunks($fileId, $totalChunks, $originalFileName);
                if ($finalFileName) {
                    return $this->sendResponse(200, true, 'File assembled successfully', ['fileName' => $finalFileName]);
                }
            }

            return $this->sendResponse(200, true, 'Chunk uploaded successfully');
        } catch (Exception $e) {
            error_log("Exception in handleUpload: " . $e->getMessage());
            error_log("Stack trace: " . $e->getTraceAsString());
            return $this->sendResponse(500, false, 'Upload error: ' . $e->getMessage());
        }
    }
    private function areAllChunksUploaded($fileId, $totalChunks)
    {
        for ($i = 0; $i < $totalChunks; $i++) {
            if (!file_exists("{$this->chunkDir}{$fileId}_{$i}")) {
                return false;
            }
        }
        return true;
    }

    private function assembleChunks($fileId, $totalChunks, $originalFileName)
    {
        $fileExtension = pathinfo($originalFileName, PATHINFO_EXTENSION);
        $finalFileName = uniqid('topic_') . '.' . $fileExtension;
        $finalPath = $this->uploadDir . $finalFileName;

        $finalFile = fopen($finalPath, 'wb');

        for ($i = 0; $i < $totalChunks; $i++) {
            $chunkPath = "{$this->chunkDir}{$fileId}_{$i}";
            $chunk = file_get_contents($chunkPath);
            fwrite($finalFile, $chunk);

            // Add error logging for unlink operation
            error_log("Attempting to delete chunk: " . $chunkPath);
            if (!unlink($chunkPath)) {
                error_log("Failed to delete chunk: " . $chunkPath);
                error_log("PHP error: " . error_get_last()['message']);
                error_log("File exists: " . (file_exists($chunkPath) ? 'yes' : 'no'));
                error_log("File permissions: " . substr(sprintf('%o', fileperms($chunkPath)), -4));
            } else {
                error_log("Successfully deleted chunk: " . $chunkPath);
            }
        }

        fclose($finalFile);
        return $finalFileName;
    }

    private function sendResponse($status, $success, $message, $data = [])
    {
        http_response_code($status);
        return json_encode([
            'status' => $status,
            'success' => $success,
            'message' => $message,
            'data' => $data
        ]);
    }
}

$handler = new ChunkUploadHandler();
echo $handler->handleUpload();
