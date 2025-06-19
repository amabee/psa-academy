<?php

header('Content-Type: application/json');

$allowed_origins = [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'http://192.168.1.2:3000',
    'http://192.168.1.2',
    'http://psa-academy.vercel.app'
];

$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if (in_array($origin, $allowed_origins)) {
    header("Access-Control-Allow-Origin: $origin");
    header("Access-Control-Allow-Credentials: true");
}
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

class ChunkUploadHandler
{
    private $uploadDir;
    private $chunkDir;
    private $maxFileSize = 1073741824;

    public function __construct()
    {

        error_log("Upload max filesize: " . ini_get('upload_max_filesize'));
        error_log("Post max size: " . ini_get('post_max_size'));
        error_log("Memory limit: " . ini_get('memory_limit'));
        error_log("Max execution time: " . ini_get('max_execution_time'));

        $baseDir = realpath(__DIR__ . '/../MEDIA/');
        error_log("Base directory: " . $baseDir);
        error_log("Base directory permissions: " . substr(sprintf('%o', fileperms($baseDir)), -4));
        error_log("PHP process user: " . get_current_user());

        $this->uploadDir = $baseDir . DIRECTORY_SEPARATOR . 'course_files' . DIRECTORY_SEPARATOR;
        $this->chunkDir = $baseDir . DIRECTORY_SEPARATOR . 'temp_chunks' . DIRECTORY_SEPARATOR;

        $this->initializeDirectories();
    }

    private function initializeDirectories()
    {
        foreach ([$this->uploadDir, $this->chunkDir] as $dir) {
            if (!file_exists($dir)) {
                error_log("Attempting to create directory: " . $dir);
                if (!@mkdir($dir, 0777, true)) {
                    error_log("Failed to create directory: " . $dir);
                    error_log("PHP error: " . error_get_last()['message']);
                } else {
                    chmod($dir, 0777);
                    error_log("Successfully created directory: " . $dir);
                }
            }

            // Verify directory permissions after creation
            error_log("Directory $dir permissions: " . substr(sprintf('%o', fileperms($dir)), -4));
            error_log("Directory $dir writable: " . (is_writable($dir) ? 'yes' : 'no'));
        }
    }

    public function handleUpload()
    {
        try {
            // Log request details
            error_log("Upload started. Request method: " . $_SERVER['REQUEST_METHOD']);
            error_log("Files received: " . print_r($_FILES, true));
            error_log("POST data: " . print_r($_POST, true));

            // Check content length
            $contentLength = $_SERVER['CONTENT_LENGTH'] ?? 0;
            error_log("Content length of request: " . $contentLength);

            if ($contentLength > 0 && empty($_POST) && empty($_FILES)) {
                error_log("Upload failed - content length exceeds PHP limits");
                return $this->sendResponse(413, false, 'Upload size exceeds server limits');
            }

            // Validate required parameters
            if (
                !isset($_FILES['chunk']) || !isset($_POST['chunkIndex']) ||
                !isset($_POST['totalChunks']) || !isset($_POST['fileId'])
            ) {
                error_log("Missing parameters. Required fields check failed.");
                return $this->sendResponse(400, false, 'Missing parameters');
            }

            $chunk = $_FILES['chunk'];
            $chunkIndex = (int) $_POST['chunkIndex'];
            $totalChunks = (int) $_POST['totalChunks'];
            $fileId = $_POST['fileId'];
            $originalFileName = $_POST['fileName'] ?? '';
            $originalFileType = $_POST['fileType'] ?? '';

            // Validate file type on first chunk
            if ($chunkIndex === 0) {
                if (!$this->validateFileType($originalFileType)) {
                    return $this->sendResponse(400, false, 'Invalid file type: ' . $originalFileType);
                }
            }

            // Save the chunk
            $chunkPath = $this->chunkDir . $fileId . '_' . $chunkIndex;
            error_log("Attempting to save chunk to: " . $chunkPath);

            if (!$this->saveChunk($chunk, $chunkPath)) {
                return $this->sendResponse(500, false, 'Failed to save chunk');
            }

            // Check if all chunks are uploaded and assemble if complete
            if ($this->areAllChunksUploaded($fileId, $totalChunks)) {
                $finalFileName = $this->assembleChunks($fileId, $totalChunks, $originalFileName);
                if ($finalFileName) {
                    return $this->sendResponse(
                        200,
                        true,
                        'File assembled successfully',
                        ['fileName' => $finalFileName]
                    );
                }
            }

            return $this->sendResponse(200, true, 'Chunk uploaded successfully');
        } catch (Exception $e) {
            error_log("Exception in handleUpload: " . $e->getMessage());
            error_log("Stack trace: " . $e->getTraceAsString());
            return $this->sendResponse(500, false, 'Upload error: ' . $e->getMessage());
        }
    }

    private function validateFileType($fileType)
    {
        $allowedTypes = ['video/mp4', 'application/pdf'];
        if (!in_array($fileType, $allowedTypes)) {
            error_log("Invalid file type: {$fileType}");
            return false;
        }
        return true;
    }

    private function saveChunk($chunk, $chunkPath)
    {
        if (!move_uploaded_file($chunk['tmp_name'], $chunkPath)) {
            error_log("move_uploaded_file failed. PHP error: " . error_get_last()['message']);
            error_log("Target path exists: " . (file_exists(dirname($chunkPath)) ? 'yes' : 'no'));
            error_log("Target path writable: " . (is_writable(dirname($chunkPath)) ? 'yes' : 'no'));
            return false;
        }
        error_log("Successfully saved chunk to: " . $chunkPath);
        return true;
    }

    private function areAllChunksUploaded($fileId, $totalChunks)
    {
        for ($i = 0; $i < $totalChunks; $i++) {
            $chunkPath = $this->chunkDir . $fileId . '_' . $i;
            if (!file_exists($chunkPath)) {
                error_log("Missing chunk at: " . $chunkPath);
                return false;
            }
        }
        error_log("All chunks present for fileId: " . $fileId);
        return true;
    }

    private function assembleChunks($fileId, $totalChunks, $originalFileName)
    {
        try {
            $fileExtension = pathinfo($originalFileName, PATHINFO_EXTENSION);
            $finalFileName = uniqid('topic_') . '.' . $fileExtension;
            $finalPath = $this->uploadDir . $finalFileName;

            error_log("Starting file assembly at: " . $finalPath);
            $finalFile = fopen($finalPath, 'wb');

            if (!$finalFile) {
                error_log("Failed to open final file for writing: " . $finalPath);
                return false;
            }

            $totalSize = 0;
            for ($i = 0; $i < $totalChunks; $i++) {
                $chunkPath = $this->chunkDir . $fileId . '_' . $i;
                $chunkSize = filesize($chunkPath);
                $totalSize += $chunkSize;

                if ($totalSize > $this->maxFileSize) {
                    error_log("File size limit exceeded");
                    fclose($finalFile);
                    unlink($finalPath);
                    return false;
                }

                $chunk = file_get_contents($chunkPath);
                if ($chunk === false) {
                    error_log("Failed to read chunk: " . $chunkPath);
                    continue;
                }

                if (fwrite($finalFile, $chunk) === false) {
                    error_log("Failed to write chunk to final file");
                    continue;
                }

                // Clean up chunk
                if (!unlink($chunkPath)) {
                    error_log("Failed to delete chunk: " . $chunkPath);
                    error_log("PHP error: " . error_get_last()['message']);
                } else {
                    error_log("Successfully deleted chunk: " . $chunkPath);
                }
            }

            fclose($finalFile);
            error_log("Successfully assembled file: " . $finalPath);
            return $finalFileName;
        } catch (Exception $e) {
            error_log("Error in assembleChunks: " . $e->getMessage());
            if (isset($finalFile)) {
                fclose($finalFile);
            }
            return false;
        }
    }

    private function sendResponse($status, $success, $message, $data = [])
    {
        $response = [
            'status' => $status,
            'success' => $success,
            'message' => $message,
            'data' => $data
        ];
        error_log("Sending response: " . json_encode($response));
        http_response_code($status);
        return json_encode($response);
    }
}

// Initialize and handle upload
$handler = new ChunkUploadHandler();
echo $handler->handleUpload();
