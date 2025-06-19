<?php

use Ramsey\Uuid\Uuid;

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

require('../../../configs/conn.php');
include('../../../middleware/helpers.php');


class Profile
{
    private $conn;

    public function __construct()
    {
        $this->conn = DatabaseConnection::getInstance()->getConnection();
    }

    public function updateProfile($json)
    {
        try {
            $data = json_decode($json, true);

            $isDataSet = InputHelper::requiredFields($data, [
                'email',
                'bio',
                'address',
                'isPregnant',
                'isPwd',
                'isSoloParent'
            ]);

            if ($isDataSet !== true) {
                http_response_code(422);
                return json_encode([
                    "status" => 422,
                    "success" => false,
                    "data" => [],
                    "message" => $isDataSet
                ]);
            }

            if (!InputHelper::validateEmail($data['email'])) {
                http_response_code(422);
                return json_encode([
                    "status" => 422,
                    "success" => false,
                    "data" => [],
                    "message" => "Not a valid email"
                ]);
            }

            $email = $data['email'];
            $bio = InputHelper::sanitizeString($data['bio']);
            $address = InputHelper::sanitizeString($data['address']);
            $isPregnant = (int) $data['isPregnant'];
            $isPwd = (int) $data['isPwd'];
            $isSoloParent = (int) $data['isSoloParent'];

            $this->conn->beginTransaction();

            $sql = "UPDATE `userinfo` 
                    SET `email` = :email, 
                        `user_about` = :bio, 
                        `address` = :address, 
                        `is_Pregnant` = :isPregnant, 
                        `is_Pwd` = :isPwd, 
                        `is_SoloParent` = :isSoloParent,
                         date_updated = NOW() WHERE `user_id` = :user_id";

            $stmt = $this->conn->prepare($sql);

            $stmt->bindParam(':email', $email);
            $stmt->bindParam(':bio', $bio);
            $stmt->bindParam(':address', $address);
            $stmt->bindParam(':isPregnant', $isPregnant, PDO::PARAM_INT);
            $stmt->bindParam(':isPwd', $isPwd, PDO::PARAM_INT);
            $stmt->bindParam(':isSoloParent', $isSoloParent, PDO::PARAM_INT);
            $stmt->bindParam(':user_id', $data['user_id'], PDO::PARAM_INT);


            if ($stmt->execute()) {
                $this->conn->commit();
                http_response_code(200);
                return json_encode([
                    "status" => 200,
                    "success" => true,
                    "data" => [],
                    "message" => "Profile updated successfully"
                ]);
            } else {
                $this->conn->rollBack();
                http_response_code(500);
                return json_encode([
                    "status" => 500,
                    "success" => false,
                    "data" => [],
                    "message" => "Failed to update profile"
                ]);
            }

        } catch (PDOException $ex) {
            $this->conn->rollBack();
            http_response_code(500);
            return json_encode([
                "status" => 500,
                "success" => false,
                "data" => [],
                "message" => "Database error: " . $ex->getMessage()
            ]);
        }
    }

    public function updateProfileImage($json)
    {
        try {
            $data = json_decode($json, true);

            // Check if required fields are present
            if (!isset($data['user_id'])) {
                http_response_code(422);
                return json_encode([
                    "status" => 422,
                    "success" => false,
                    "data" => [],
                    "message" => "Missing user_id"
                ]);
            }

            $userId = $data['user_id'];

            if (!isset($_FILES['profile_image']) || $_FILES['profile_image']['error'] !== UPLOAD_ERR_OK) {
                http_response_code(400);
                return json_encode([
                    "status" => 400,
                    "success" => false,
                    "data" => [],
                    "message" => "No file uploaded or upload error. Error code: " .
                        (isset($_FILES['profile_image']) ? $_FILES['profile_image']['error'] : 'No file sent')
                ]);
            }

            $file = $_FILES['profile_image'];
            $allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];

            // Validate file type
            if (!in_array($file['type'], $allowedTypes)) {
                http_response_code(415);
                return json_encode([
                    "status" => 415,
                    "success" => false,
                    "data" => [],
                    "message" => "Invalid file type. Only JPG, PNG, and GIF are allowed."
                ]);
            }

            // Generate a unique filename using UUID
            $extension = pathinfo($file['name'], PATHINFO_EXTENSION);
            $newFileName = Uuid::uuid4()->toString() . "." . $extension;

            // Define the upload path
            $uploadDir = "../../../MEDIA/user_images/";
            $uploadPath = $uploadDir . $newFileName;

            // Create directory if not exists
            if (!is_dir($uploadDir)) {
                mkdir($uploadDir, 0777, true);
            }

            // Move uploaded file
            if (!move_uploaded_file($file['tmp_name'], $uploadPath)) {
                error_log("Resolved path: " . realpath($uploadDir));

                http_response_code(500);
                return json_encode([
                    "status" => 500,
                    "success" => false,
                    "data" => [],
                    "message" => "Failed to save uploaded file."
                ]);
            }

            // Update database with the new profile image path
            $this->conn->beginTransaction();
            $sql = "UPDATE `userinfo` SET `profile_image` = :profile_image, `date_updated` = NOW() WHERE `user_id` = :user_id";
            $stmt = $this->conn->prepare($sql);
            $stmt->bindParam(':profile_image', $newFileName);
            $stmt->bindParam(':user_id', $userId, PDO::PARAM_INT);

            if ($stmt->execute()) {
                $this->conn->commit();
                http_response_code(200);
                return json_encode([
                    "status" => 200,
                    "success" => true,
                    "data" => $newFileName,
                    "message" => "Profile image updated successfully"
                ]);
            } else {
                $this->conn->rollBack();
                http_response_code(500);
                return json_encode([
                    "status" => 500,
                    "success" => false,
                    "data" => [],
                    "message" => "Failed to update profile image in database."
                ]);
            }
        } catch (PDOException $ex) {
            $this->conn->rollBack();
            http_response_code(500);
            return json_encode([
                "status" => 500,
                "success" => false,
                "data" => [],
                "message" => "Database error: " . $ex->getMessage()
            ]);
        }
    }


}

$profile = new Profile();

$validApiKey = $_ENV['API_KEY'] ?? null;

$requestMethod = $_SERVER["REQUEST_METHOD"];

$headers = array_change_key_case(getallheaders(), CASE_LOWER);

if (isset($headers['authorization']) && $headers['authorization'] === $validApiKey) {

    $operation = null;
    $json = null;

    switch ($requestMethod) {
        case 'GET':
            $operation = isset($_GET["operation"]) ? $_GET["operation"] : null;
            $json = isset($_GET["json"]) ? $_GET["json"] : null;
            break;

        case 'POST':
            $operation = isset($_POST["operation"]) ? $_POST["operation"] : null;
            $json = isset($_POST["json"]) ? $_POST["json"] : null;
            break;

        default:
            http_response_code(405);
            echo json_encode([
                "success" => false,
                "data" => [],
                "message" => "Invalid Request Method."
            ]);
            exit();
    }

    if (isset($operation) && isset($json)) {
        switch ($operation) {

            case "updateProfileDetail":
                if ($requestMethod === "POST") {
                    echo $profile->updateProfile($json);
                } else {
                    http_response_code(405);
                    echo json_encode([
                        "status" => 405,
                        "success" => false,
                        "data" => [],
                        "message" => "Invalid request method for login. Use POST."
                    ]);
                }
                break;

            case "updateProfileIamge":
                if ($requestMethod === "POST") {
                    echo $profile->updateProfileImage($json);
                } else {
                    http_response_code(405);
                    echo json_encode([
                        "status" => 405,
                        "success" => false,
                        "data" => [],
                        "message" => "Invalid request method for login. Use POST."
                    ]);
                }
                break;


            default:
                http_response_code(400);
                echo json_encode([
                    "status" => 400,
                    "success" => false,
                    "data" => [],
                    "message" => "Invalid operation."
                ]);
                break;
        }
    } else {
        http_response_code(422);
        echo json_encode([
            "status" => 422,
            "success" => false,
            "data" => [],
            "message" => "Missing Parameters."
        ]);
    }
} else {
    http_response_code(401);
    error_log("Headers: " . json_encode(getallheaders()));
    echo json_encode([
        "status" => 401,
        "success" => false,
        "data" => [],
        "message" => "Invalid API Key."
    ]);
}
// sht
