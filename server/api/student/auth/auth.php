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

    public function login($json)
    {
        $json = json_decode($json, true);

        if (empty($json['username']) || empty($json['password'])) {
            return json_encode(array('error' => 'Username and Password are required!'));
        }

        try {
            $username = $json['username'];
            $password = sha1($json['password']);

            // Check user credentials
            $sql = 'SELECT `user_id`, `username`, `full_name`, `email`, `user_type_id`, `is_active` 
                    FROM `users` 
                    WHERE (`username` = :username OR `email` = :username) AND `password` = :password AND `is_active` = 1';
            $stmt = $this->conn->prepare($sql);
            $stmt->bindParam(':username', $username, PDO::PARAM_STR);
            $stmt->bindParam(':password', $password, PDO::PARAM_STR);
            $stmt->execute();

            if ($stmt->rowCount() > 0) {
                $user = $stmt->fetch(PDO::FETCH_ASSOC);

                // Generate JWT
                $key = $_ENV['JWT_SECRET'];
                $issuedAt = time();
                $expirationTime = $issuedAt + 3600;
                $payload = [
                    'iss' => 'crasm-monitoring',
                    'iat' => $issuedAt,
                    'exp' => $expirationTime,
                    'sub' => $user['user_id'],
                    'user' => [
                        'id' => $user['user_id'],
                        'username' => $user['username'],
                        'full_name' => $user['full_name'],
                        'email' => $user['email'],
                        'user_type_id' => $user['user_type_id']
                    ]
                ];

                $jwt = JWT::encode($payload, $key, 'HS256');

                // Insert session into the sessions table
                $sessionId = bin2hex(random_bytes(32));
                $sql = 'INSERT INTO `sessions` (`session_id`, `user_id`, `session_data`, `created_at`, `expires_at`) 
                        VALUES (:session_id, :user_id, :session_data, NOW(), FROM_UNIXTIME(:expires_at))';
                $stmt = $this->conn->prepare($sql);
                $stmt->bindParam(':session_id', $sessionId, PDO::PARAM_STR);
                $stmt->bindParam(':user_id', $user['user_id'], PDO::PARAM_INT);
                $stmt->bindParam(':session_data', $jwt, PDO::PARAM_STR);
                $stmt->bindParam(':expires_at', $expirationTime, PDO::PARAM_INT);

                if ($stmt->execute()) {
                    // Session was successfully created
                    return json_encode(array(
                        "success" => array(
                            "user" => $user,
                            "token" => $jwt,
                            "session_id" => $sessionId
                        )
                    ));
                } else {
                    return json_encode(array("error" => "Failed to create session"));
                }
            } else {
                return json_encode(array("error" => 'Invalid Credentials'));
            }
        } catch (PDOException $e) {
            error_log("Database error in login: " . $e->getMessage());
            return json_encode(array('error' => 'An unexpected error occurred. Please try again later.'));
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
                    echo $auth->login($json);
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
