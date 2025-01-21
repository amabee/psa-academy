<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

require('../../../configs/conn.php');
// include('../helpers/input_validation.php');
// include('../middleware/authmiddleware.php');


use Firebase\JWT\JWT;
use Firebase\JWT\Key;

class AUTH
{
    private $conn;

    public function __construct()
    {
        $this->conn = DatabaseConnection::getInstance()->getConnection();
    }

    public function studentLogin($json)
    {
        $json = json_decode($json, true);

        if (empty($json['user']) || empty($json['password'])) {
            return json_encode(array("success" => false, "data" => [], "message" => 'Username and Password are required!'));
        }

        try {
            $this->conn->beginTransaction();

            $user = $json['user'];
            $password = $json['password'];

            $sql = 'SELECT user.user_id, user.userType_id, user.username, user.password, userinfo.*, offices.office_name
                    FROM user
                    LEFT JOIN userinfo ON userinfo.user_id = user.user_id
                    LEFT JOIN offices ON offices.office_id = userinfo.office_id
                    WHERE (user.username = :user OR userinfo.email = :user)';
            $stmt = $this->conn->prepare($sql);
            $stmt->bindParam(':user', $user, PDO::PARAM_STR);
            $stmt->execute();


            if ($stmt->rowCount() > 0) {
                $user = $stmt->fetch(PDO::FETCH_ASSOC);

                if (!password_verify($password, $user['password'])) {
                    return json_encode(array("success" => false, "data" => [], "message" => 'Invalid Credentials'));
                }

                unset($user['password']);

                $jwt = $this->generateJwt($user);

                $sessionData = $this->createSessionData($user, $jwt);

                $this->insertSession($sessionData);

                setcookie('session_token', $jwt, [
                    'expires' => time() + 7200,
                    'path' => '/',
                    'domain' => '',
                    'secure' => true,
                    'httponly' => true,
                    'samesite' => 'Strict'
                ]);

                setcookie('session_id', $sessionData['session_id'], [
                    'expires' => time() + 7200,
                    'path' => '/',
                    'domain' => '',
                    'secure' => true,
                    'httponly' => true,
                    'samesite' => 'Strict'
                ]);

                $this->conn->commit();

                http_response_code(200);

                return json_encode(array(
                    "success" => true,
                    "data" => [
                        "user" => $user,
                        "token" => $jwt,
                        "session_id" => $sessionData['session_id']
                    ],
                    "message" => "success"
                ));
            } else {

                http_response_code(401);
                $this->conn->rollBack();
                return json_encode(array("success" => false, "data" => [], "message" => 'Invalid Credentials'));
            }
        } catch (PDOException $e) {
            http_response_code(500);
            $this->conn->rollBack();
            error_log("Database error in login: " . $e->getMessage());
            return json_encode(array("success" => false, "data" => [], "message" => $e->getMessage()));
        }
    }



    public function createAccount($json)
    {
        $json = json_decode($json, true);

        $requiredFields = ['username', 'password', 'fullname', 'email', 'province_id', 'user_type_id'];
        foreach ($requiredFields as $field) {
            if (empty($json[$field])) {
                return json_encode(array("error" => "Field '$field' is required."));
            }
        }

        try {
            $username = $json['username'];
            $password = sha1($json['password']);
            $fullname = $json['fullname'];
            $email = $json['email'];
            $province_id = $json['province_id'];
            $user_type_id = $json['user_type_id'];
            $is_active = 1;

            $checkSql = 'SELECT * FROM `users` WHERE `username` = :username OR `email` = :email';
            $checkStmt = $this->conn->prepare($checkSql);
            $checkStmt->bindParam(':username', $username, PDO::PARAM_STR);
            $checkStmt->bindParam(':email', $email, PDO::PARAM_STR);
            $checkStmt->execute();

            if ($checkStmt->rowCount() > 0) {
                return json_encode(array("error" => "Username or Email already exists."));
            }

            $sql = 'INSERT INTO `users` (`username`, `password`, `full_name`, `email`, `province_id`, 
                    `user_type_id`, `is_active`) 
                    VALUES (:username, :password, :fullname, :email, :province_id, :user_type_id, :is_active)';
            $stmt = $this->conn->prepare($sql);
            $stmt->bindParam(':username', $username, PDO::PARAM_STR);
            $stmt->bindParam(':password', $password, PDO::PARAM_STR);
            $stmt->bindParam(':fullname', $fullname, PDO::PARAM_STR);
            $stmt->bindParam(':email', $email, PDO::PARAM_STR);
            $stmt->bindParam(':province_id', $province_id, PDO::PARAM_INT);
            $stmt->bindParam(':user_type_id', $user_type_id, PDO::PARAM_INT);
            $stmt->bindParam(':is_active', $is_active, PDO::PARAM_INT);

            if ($stmt->execute()) {
                return json_encode(array("success" => "User account successfully created."));
            } else {
                return json_encode(array("error" => "Failed to create user account."));
            }
        } catch (PDOException $e) {
            error_log("Database error in createAccount: " . $e->getMessage());
            return json_encode(array('error' => 'An unexpected error occurred. Please try again later.'));
        }
    }

    public function checkSession($json)
    {
        $json = json_decode($json, true);

        if (empty($json['session_token'])) {
            return false;
        }

        $sessionToken = $json['session_token'];

        try {
            $stmt = $this->conn->prepare("SELECT * FROM `sessions` WHERE `session_id` = :session_token AND `expires_at` > NOW()");
            $stmt->bindParam(':session_token', $sessionToken, PDO::PARAM_STR);
            $stmt->execute();

            return $stmt->rowCount() > 0;
        } catch (PDOException $e) {
            error_log("Database error in checkSession: " . $e->getMessage());
            return false;
        }
    }
}

$auth = new AUTH();

$validApiKey = $_ENV['API_KEY'] ?? null;

if ($_SERVER["REQUEST_METHOD"] === "GET" || $_SERVER["REQUEST_METHOD"] === "POST") {
    $headers = getallheaders();

    if (isset($headers['Authorization']) && $headers['Authorization'] === $validApiKey) {

        if (isset($_REQUEST["operation"]) && isset($_REQUEST["json"])) {
            $operation = $_REQUEST["operation"];
            $json = $_REQUEST["json"];

            switch ($operation) {
                case "login":
                    echo $auth->studentLogin($json);
                    break;

                case "createAccount":
                    echo $auth->createAccount($json);
                    break;

                default:
                    echo json_encode(array("error" => "Invalid operation."));
                    break;
            }
        } else {
            echo json_encode(array("error" => "Missing Parameters."));
        }
    } else {
        echo json_encode(array("error" => "Invalid API Key."));
    }
} else {
    echo json_encode(array("error" => "Invalid Request Method."));
}
