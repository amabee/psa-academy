<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, session_id, session_token');


require('../../configs/conn.php');
include_once('../../middleware/helpers.php');


use Firebase\JWT\JWT;

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
                    WHERE (user.username = :user OR userinfo.email = :user) AND is_Active = 1';
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
      return json_encode(array("success" => false, "data" => [], "message" => 'An unexpected error occurred. Please try again later.'));
    }
  }

  public function signup($json)
  {
    $json = json_decode($json, true);

    $isDataSet = InputHelper::requiredFields($json, [
      'firstname',
      'lastname',
      'email',
      'username',
      'phoneNumber',
      'bday',
      'gender',
      'password'
    ]);

    if ($isDataSet !== true) {
      return $isDataSet;
    }

    // Validate email
    if (!InputHelper::validateEmail($json['email'])) {
      http_response_code(422);
      return json_encode([
        "success" => false,
        "data" => [],
        "message" => "Invalid email"
      ]);
    }

    // Calculate age based on birthday
    $bday = new DateTime($json['bday']);
    $today = new DateTime();
    $age = $today->diff($bday)->y;

    // Set Variables
    $firstname = InputHelper::sanitizeString($json['firstname']);
    $middlename = isset($json['middlename']) ? InputHelper::sanitizeString($json['middlename']) : "";
    $lastname = InputHelper::sanitizeString($json['lastname']);
    $email = $json['email'];
    $username = InputHelper::sanitizeString($json['username']);
    $phoneNumber = InputHelper::sanitizeString($json['phoneNumber']);
    $bdayFormatted = $bday->format('Y-m-d'); // Ensure the date is properly formatted
    $gender = $json['gender'];
    $password = password_hash($json['password'], PASSWORD_BCRYPT);
    $userTypeID = 4;
    $isActive = 1;

    // Check if email already exists
    $stmt = $this->conn->prepare("SELECT user_id FROM userinfo WHERE email = :email");
    $stmt->bindParam(':email', $email);
    $stmt->execute();

    if ($stmt->rowCount() > 0) {
      http_response_code(409);
      return json_encode([
        "success" => false,
        "data" => [],
        "message" => "Email is already in use"
      ]);
    }

    // Check if username already exists
    $stmt = $this->conn->prepare("SELECT user_id FROM user WHERE username = :username");
    $stmt->bindParam(':username', $username);
    $stmt->execute();

    if ($stmt->rowCount() > 0) {
      http_response_code(409);
      return json_encode([
        "success" => false,
        "data" => [],
        "message" => "Username is already taken"
      ]);
    }

    try {
      // Begin Transaction
      $this->conn->beginTransaction();

      // Insert into `user` table
      $stmt = $this->conn->prepare("INSERT INTO user (userType_id, username, password, is_Active) 
                                          VALUES (:typeID, :username, :password, :isActive)");
      $stmt->bindParam(':typeID', $userTypeID);
      $stmt->bindParam(':username', $username);
      $stmt->bindParam(':password', $password);
      $stmt->bindParam(':isActive', $isActive);
      $stmt->execute();

      // Get last inserted user_id
      $userID = $this->conn->lastInsertId();

      // Insert into `userinfo` table
      $stmt = $this->conn->prepare("INSERT INTO userinfo (user_id, first_name, middle_name, last_name, age, email, phone, date_of_birth, gender) 
                                          VALUES (:userID, :firstname, :middlename, :lastname, :age, :email, :phone, :bday, :gender)");
      $stmt->bindParam(':userID', $userID);
      $stmt->bindParam(':firstname', $firstname);
      $stmt->bindParam(':middlename', $middlename);
      $stmt->bindParam(':lastname', $lastname);
      $stmt->bindParam(':age', $age);
      $stmt->bindParam(':email', $email);
      $stmt->bindParam(':phone', $phoneNumber);
      $stmt->bindParam(':bday', $bdayFormatted);
      $stmt->bindParam(':gender', $gender);
      $stmt->execute();

      // Commit transaction
      $this->conn->commit();

      http_response_code(201);
      return json_encode([
        "success" => true,
        "data" => ["user_id" => $userID],
        "message" => "User registered successfully"
      ]);
    } catch (Exception $e) {
      $this->conn->rollBack();
      http_response_code(500);
      return json_encode([
        "success" => false,
        "data" => [],
        "message" => "Registration failed: " . $e->getMessage()
      ]);
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

  public function getSession()
  {

    $headers = getallheaders();

    $validateData = InputHelper::requiredFields($headers, ['x-session-id', 'x-session-token']);

    if ($validateData !== true) {
      return $validateData;
    }

    $sql = "select session_token, session_id, user.userType_id from sessions
        inner join user on sessions.user_id = user.user_id where session_id = :session_id AND session_token = :session_token AND sessions.is_active = 1";
    $stmt = $this->conn->prepare($sql);
    $stmt->bindParam(":session_id", $headers['x-session-id'], PDO::PARAM_STR);
    $stmt->bindParam(":session_token", $headers['x-session-token'], PDO::PARAM_STR);

    $stmt->execute();

    if ($stmt->rowCount() <= 0) {
      http_response_code(404);
      return json_encode(array(
        "status" => 404,
        "success" => false,
        "data" => [],
        "message" => "Session not found"
      ));
    }

    http_response_code(200);
    return json_encode(array(
      "status" => 200,
      "success" => true,
      "data" => $stmt->fetch(PDO::FETCH_ASSOC),
      "message" => "success"
    ));
  }
}

$auth = new AUTH();

$validApiKey = $_ENV['API_KEY'] ?? null;

$requestMethod = $_SERVER["REQUEST_METHOD"];

$headers = array_change_key_case(getallheaders(), CASE_LOWER);

if (isset($headers['authorization']) && $headers['authorization'] === $validApiKey) {

  if ($_SERVER["REQUEST_METHOD"] === "GET") {
    $operation = isset($_GET["operation"]) ? $_GET["operation"] : null;
    $json = isset($_GET["json"]) ? $_GET["json"] : null;
  }

  if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $operation = isset($_POST["operation"]) ? $_POST["operation"] : null;
    $json = isset($_POST["json"]) ? $_POST["json"] : null;
  }

  if (isset($operation) && isset($json)) {
    switch ($operation) {
      case "login":
        if ($_SERVER["REQUEST_METHOD"] === "POST") {
          echo $auth->login($json);
        } else {
          http_response_code(400);
          echo json_encode(array("success" => false, "data" => [], "message" => "Invalid request method for login. Use POST."));
        }
        break;

      case "signup":
        if ($_SERVER["REQUEST_METHOD"] === "POST") {
          echo $auth->signup($json);
        } else {
          http_response_code(400);
          echo json_encode(array("success" => false, "data" => [], "message" => "Invalid request method for login. Use POST."));
        }
        break;

      case "getSession":
        if ($_SERVER["REQUEST_METHOD"] === "GET") {
          echo $auth->getSession();
        } else {
          http_response_code(400);
          echo json_encode(array("success" => false, "data" => [], "message" => "Invalid request method for login. Use GET."));
        }
        break;

      default:
        http_response_code(400);
        echo json_encode(array("success" => false, "data" => [], "message" => "Invalid operation."));
        break;
    }
  } else {
    http_response_code(422);
    echo json_encode(array("success" => false, "data" => [], "message" => "Missing Parameters."));
  }
} else {
  http_response_code(401);


  echo json_encode(array("success" => false, "data" => [], "message" => "Invalid API Key."));
}
