<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

require('../../../configs/conn.php');
include_once('../../../middleware/helpers.php');


use Firebase\JWT\JWT;

class AUTH
{
    private $conn;

    public function __construct()
    {
        $this->conn = DatabaseConnection::getInstance()->getConnection();
    }

    public function speakerLogin($json)
    {
        $json = json_decode($json, true);

        if (empty($json['user']) || empty($json['password'])) {
            return json_encode(array("success" => false,  "data" => [], "message" => 'Username and Password are required!'));
        }

        try {
            $this->conn->beginTransaction();

            $user = $json['user'];
            $password = $json['password'];

            // Check user credentials
            $sql = 'SELECT user.user_id, user.userType_id, user.username, user.password, userinfo.*, offices.office_name
                    FROM user
                    LEFT JOIN userinfo ON userinfo.user_id = user.user_id
                    LEFT JOIN offices ON offices.office_id = userinfo.office_id
                    WHERE (user.username = :user OR userinfo.email = :user)';
            $stmt = $this->conn->prepare($sql);
            $stmt->bindParam(':user', $user, PDO::PARAM_STR);
            //$stmt->bindParam(':password', $password, PDO::PARAM_STR);
            $stmt->execute();


            if ($stmt->rowCount() > 0) {
                $user = $stmt->fetch(PDO::FETCH_ASSOC);

                if (!password_verify($password, $user['password'])) {
                    return json_encode(array("success" => false, "data" => [], "message" => 'Invalid Credentials'));
                }

                unset($user['password']);

                // Generate JWT
                $jwt = $this->generateJwt($user);

                // Session data
                $sessionData = $this->createSessionData($user, $jwt);

                // Insert session into the sessions table
                $this->insertSession($sessionData);

                // Commit the transaction
                $this->conn->commit();

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
                $this->conn->rollBack();
                return json_encode(array("success" => false, "data" => [], "message" => 'Invalid Credentials'));
            }
        } catch (PDOException $e) {
            $this->conn->rollBack();
            error_log("Database error in login: " . $e->getMessage());
            return json_encode(array("success" => false, "data" => [], "message" => 'An unexpected error occurred. Please try again later.'));
        }
    }

    private function generateJwt($user)
    {
        $key = $_ENV['JWT_SECRET'];
        $issuedAt = time();
        $expirationTime = $issuedAt + 7200;
        $payload = [
            'iss' => 'psa-academy',
            'iat' => $issuedAt,
            'exp' => $expirationTime,
            'sub' => $user['user_id'],
            'user' => [
                'id' => $user['user_id'],
                'username' => $user['username'],
                'full_name' => $user['first_name'] . $user['middle_name'] . $user['last_name'],
                'email' => $user['email'],
                'user_type_id' => $user['userType_id']
            ]
        ];
        return JWT::encode($payload, $key, 'HS256');
    }

    private function createSessionData($user, $jwt)
    {
        $sessionId = bin2hex(random_bytes(32));
        $ipAddress = $_SERVER['REMOTE_ADDR'];
        $userAgent = $_SERVER['HTTP_USER_AGENT'];
        $loginTime = time();
        $lastActiveTime = $loginTime;
        $expiresAt = $loginTime + 7200;
        $isActive = 1;

        return [
            'session_id' => $sessionId,
            'user_id' => $user['user_id'],
            'session_token' => $jwt,
            'ip_address' => $ipAddress,
            'user_agent' => $userAgent,
            'login_time' => $loginTime,
            'last_active_time' => $lastActiveTime,
            'expires_at' => $expiresAt,
            'is_active' => $isActive
        ];
    }

    private function insertSession($sessionData)
    {
        $sql = 'INSERT INTO `sessions`(`session_id`, `user_id`, `session_token`, `ip_address`, `user_agent`, `login_time`, `last_active_time`, `expires_at`, `is_active`) 
                VALUES (:session_id, :user_id, :session_token, :ip_address, :user_agent, FROM_UNIXTIME(:login_time), FROM_UNIXTIME(:last_active_time), FROM_UNIXTIME(:expires_at), :is_active)';
        $stmt = $this->conn->prepare($sql);
        $stmt->bindParam(':session_id', $sessionData['session_id'], PDO::PARAM_STR);
        $stmt->bindParam(':user_id', $sessionData['user_id'], PDO::PARAM_INT);
        $stmt->bindParam(':session_token', $sessionData['session_token'], PDO::PARAM_STR);
        $stmt->bindParam(':ip_address', $sessionData['ip_address'], PDO::PARAM_STR);
        $stmt->bindParam(':user_agent', $sessionData['user_agent'], PDO::PARAM_STR);
        $stmt->bindParam(':login_time', $sessionData['login_time'], PDO::PARAM_INT);
        $stmt->bindParam(':last_active_time', $sessionData['last_active_time'], PDO::PARAM_INT);
        $stmt->bindParam(':expires_at', $sessionData['expires_at'], PDO::PARAM_INT);
        $stmt->bindParam(':is_active', $sessionData['is_active'], PDO::PARAM_INT);
        $stmt->execute();
    }
}

$auth = new AUTH();

$validApiKey = $_ENV['API_KEY'] ?? null;

if ($_SERVER["REQUEST_METHOD"] === "GET") {

    $headers = getallheaders();

    if (isset($headers['Authorization']) && $headers['Authorization'] === $validApiKey) {

        if ($_SERVER["REQUEST_METHOD"] === "GET") {
            $operation = isset($_GET["operation"]) ? $_GET["operation"] : null;
            $json = isset($_GET["json"]) ? $_GET["json"] : null;
        } elseif ($_SERVER["REQUEST_METHOD"] === "POST") {
            $operation = isset($_POST["operation"]) ? $_POST["operation"] : null;
            $json = isset($_POST["json"]) ? $_POST["json"] : null;
        }

        if (isset($operation) && isset($json)) {
            switch ($operation) {
                case "login":
                    if ($_SERVER["REQUEST_METHOD"] === "GET") {
                        echo $auth->speakerLogin($json);
                    } else {
                        echo json_encode(array("success" => false, "data" => [], "message" => "Invalid request method for login. Use GET."));
                    }
                    break;

                default:
                    echo json_encode(array("success" => false, "data" => [], "message" => "Invalid operation."));
                    break;
            }
        } else {
            echo json_encode(array("success" => false, "data" => [], "message" => "Missing Parameters."));
        }
    } else {
        echo json_encode(array("success" => false, "data" => [], "message" => "Invalid API Key."));
    }
} else {
    echo json_encode(array("success" => false, "data" => [], "message" => "Invalid Request Method."));
}
