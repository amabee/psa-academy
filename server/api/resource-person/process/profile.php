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
                'isSoloParent',
                'first_name',
                'middle_name',
                'last_name',
                'suffix',
                'age',
                'date_of_birth',
                'sex',
                'gender',
                'barangay',
                'municipality',
                'province',
                'region',
                'employment_type',
                'civil_service_eligibility',
                'salary_grade',
                'present_position',
                'office',
                'service',
                'division_province',
                'emergency_contact_name',
                'emergency_contact_relationship',
                'emergency_contact_address',
                'emergency_contact_number',
                'emergency_contact_email',
                'phone',
                'blood_type',
                'civil_status',
                'type_of_disability',
                'religion',
                'educational_attainment',
                'allergies',
                'ip',
                'office_id',
                'position'
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

            $this->conn->beginTransaction();

            $sql = "UPDATE `userinfo` 
                    SET `first_name` = :first_name,
                        `middle_name` = :middle_name,
                        `last_name` = :last_name,
                        `suffix` = :suffix,
                        `age` = :age,
                        `date_of_birth` = :date_of_birth,
                        `sex` = :sex,
                        `gender` = :gender,
                        `email` = :email,
                        `phone` = :phone,
                        `address` = :address,
                        `barangay` = :barangay,
                        `municipality` = :municipality,
                        `province` = :province,
                        `region` = :region,
                        `employment_type` = :employment_type,
                        `civil_service_eligibility` = :civil_service_eligibility,
                        `salary_grade` = :salary_grade,
                        `present_position` = :present_position,
                        `office` = :office,
                        `service` = :service,
                        `division_province` = :division_province,
                        `emergency_contact_name` = :emergency_contact_name,
                        `emergency_contact_relationship` = :emergency_contact_relationship,
                        `emergency_contact_address` = :emergency_contact_address,
                        `emergency_contact_number` = :emergency_contact_number,
                        `emergency_contact_email` = :emergency_contact_email,
                        `blood_type` = :blood_type,
                        `civil_status` = :civil_status,
                        `type_of_disability` = :type_of_disability,
                        `religion` = :religion,
                        `educational_attainment` = :educational_attainment,
                        `allergies` = :allergies,
                        `ip` = :ip,
                        `office_id` = :office_id,
                        `position` = :position,
                        `user_about` = :bio,
                        `is_Pregnant` = :isPregnant,
                        `is_Pwd` = :isPwd,
                        `is_SoloParent` = :isSoloParent,
                        `date_updated` = NOW() 
                    WHERE `user_id` = :user_id";

            $stmt = $this->conn->prepare($sql);

            $stmt->bindParam(':first_name', InputHelper::sanitizeString($data['first_name']));
            $stmt->bindParam(':middle_name', InputHelper::sanitizeString($data['middle_name']));
            $stmt->bindParam(':last_name', InputHelper::sanitizeString($data['last_name']));
            $stmt->bindParam(':suffix', InputHelper::sanitizeString($data['suffix']));
            $stmt->bindParam(':age', (int) $data['age']);
            $stmt->bindParam(':date_of_birth', $data['date_of_birth']);
            $stmt->bindParam(':sex', InputHelper::sanitizeString($data['sex']));
            $stmt->bindParam(':gender', InputHelper::sanitizeString($data['gender']));
            $stmt->bindParam(':email', $data['email']);
            $stmt->bindParam(':phone', InputHelper::sanitizeString($data['phone']));
            $stmt->bindParam(':address', InputHelper::sanitizeString($data['address']));
            $stmt->bindParam(':barangay', InputHelper::sanitizeString($data['barangay']));
            $stmt->bindParam(':municipality', InputHelper::sanitizeString($data['municipality']));
            $stmt->bindParam(':province', InputHelper::sanitizeString($data['province']));
            $stmt->bindParam(':region', InputHelper::sanitizeString($data['region']));
            $stmt->bindParam(':employment_type', InputHelper::sanitizeString($data['employment_type']));
            $stmt->bindParam(':civil_service_eligibility', InputHelper::sanitizeString($data['civil_service_eligibility']));
            $stmt->bindParam(':salary_grade', InputHelper::sanitizeString($data['salary_grade']));
            $stmt->bindParam(':present_position', InputHelper::sanitizeString($data['present_position']));
            $stmt->bindParam(':office', InputHelper::sanitizeString($data['office']));
            $stmt->bindParam(':service', InputHelper::sanitizeString($data['service']));
            $stmt->bindParam(':division_province', InputHelper::sanitizeString($data['division_province']));
            $stmt->bindParam(':emergency_contact_name', InputHelper::sanitizeString($data['emergency_contact_name']));
            $stmt->bindParam(':emergency_contact_relationship', InputHelper::sanitizeString($data['emergency_contact_relationship']));
            $stmt->bindParam(':emergency_contact_address', InputHelper::sanitizeString($data['emergency_contact_address']));
            $stmt->bindParam(':emergency_contact_number', InputHelper::sanitizeString($data['emergency_contact_number']));
            $stmt->bindParam(':emergency_contact_email', InputHelper::sanitizeString($data['emergency_contact_email']));
            $stmt->bindParam(':blood_type', InputHelper::sanitizeString($data['blood_type']));
            $stmt->bindParam(':civil_status', InputHelper::sanitizeString($data['civil_status']));
            $stmt->bindParam(':type_of_disability', InputHelper::sanitizeString($data['type_of_disability']));
            $stmt->bindParam(':religion', InputHelper::sanitizeString($data['religion']));
            $stmt->bindParam(':educational_attainment', InputHelper::sanitizeString($data['educational_attainment']));
            $stmt->bindParam(':allergies', InputHelper::sanitizeString($data['allergies']));
            $stmt->bindParam(':ip', InputHelper::sanitizeString($data['ip']));
            $stmt->bindParam(':office_id', InputHelper::sanitizeString($data['office_id']));
            $stmt->bindParam(':position', InputHelper::sanitizeString($data['position']));
            $stmt->bindParam(':bio', InputHelper::sanitizeString($data['bio']));
            $stmt->bindParam(':isPregnant', (int) $data['isPregnant'], PDO::PARAM_INT);
            $stmt->bindParam(':isPwd', (int) $data['isPwd'], PDO::PARAM_INT);
            $stmt->bindParam(':isSoloParent', (int) $data['isSoloParent'], PDO::PARAM_INT);
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

    public function updatePassword($json)
    {
        try {
            $data = json_decode($json, true);

            $isDataSet = InputHelper::requiredFields($data, [
                'user_id',
                'current_password',
                'new_password'
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

            $user_id = (int) $data['user_id'];
            $current_password = $data['current_password'];
            $new_password = $data['new_password'];

            // Validate new password
            if (strlen($new_password) < 8) {
                http_response_code(422);
                return json_encode([
                    "status" => 422,
                    "success" => false,
                    "data" => [],
                    "message" => "New password must be at least 8 characters long"
                ]);
            }

            $this->conn->beginTransaction();

            // Get current password from database
            $sql = "SELECT password FROM user WHERE user_id = :user_id";
            $stmt = $this->conn->prepare($sql);
            $stmt->bindParam(':user_id', $user_id, PDO::PARAM_INT);
            $stmt->execute();

            if ($stmt->rowCount() === 0) {
                $this->conn->rollBack();
                http_response_code(404);
                return json_encode([
                    "status" => 404,
                    "success" => false,
                    "data" => [],
                    "message" => "User not found"
                ]);
            }

            $user = $stmt->fetch(PDO::FETCH_ASSOC);

            // Verify current password
            if (!password_verify($current_password, $user['password'])) {
                $this->conn->rollBack();
                http_response_code(401);
                return json_encode([
                    "status" => 401,
                    "success" => false,
                    "data" => [],
                    "message" => "Current password is incorrect"
                ]);
            }

            // Hash new password
            $hashed_password = password_hash($new_password, PASSWORD_BCRYPT);

            // Update password
            $sql = "UPDATE user SET password = :password WHERE user_id = :user_id";
            $stmt = $this->conn->prepare($sql);
            $stmt->bindParam(':password', $hashed_password);
            $stmt->bindParam(':user_id', $user_id, PDO::PARAM_INT);

            if ($stmt->execute()) {
                $this->conn->commit();
                http_response_code(200);
                return json_encode([
                    "status" => 200,
                    "success" => true,
                    "data" => [],
                    "message" => "Password updated successfully"
                ]);
            } else {
                $this->conn->rollBack();
                http_response_code(500);
                return json_encode([
                    "status" => 500,
                    "success" => false,
                    "data" => [],
                    "message" => "Failed to update password"
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
                        "message" => "Invalid request method for updateProfileDetail. Use POST."
                    ]);
                }
                break;

            case "updatePassword":
                if ($requestMethod === "POST") {
                    echo $profile->updatePassword($json);
                } else {
                    http_response_code(405);
                    echo json_encode([
                        "status" => 405,
                        "success" => false,
                        "data" => [],
                        "message" => "Invalid request method for updatePassword. Use POST."
                    ]);
                }
                break;

            case "updateProfileImage":
                if ($requestMethod === "POST") {
                    echo $profile->updateProfileImage($json);
                } else {
                    http_response_code(405);
                    echo json_encode([
                        "status" => 405,
                        "success" => false,
                        "data" => [],
                        "message" => "Invalid request method for updateProfileImage. Use POST."
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
