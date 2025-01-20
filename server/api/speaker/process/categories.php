<?php

use Ramsey\Uuid\Uuid;

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

require('../../../configs/conn.php');
include('../../../middleware/helpers.php');


class Categories
{
    private $conn;

    public function __construct()
    {
        $this->conn = DatabaseConnection::getInstance()->getConnection();
    }

    public function getCategories()
    {
        try {
            $sql = "SELECT * from categories";

            $stmt = $this->conn->prepare($sql);
            $stmt->execute();

            $result = $stmt->fetchAll(PDO::FETCH_ASSOC);

            http_response_code(200);

            return json_encode([
                "status" => 200,
                "success" => true,
                "data" => $result,
                "message" => ""
            ]);
        } catch (PDOException $ex) {

            http_response_code(500);

            return json_encode([
                "status" => 500,
                "success" => false,
                "data" => [],
                "message" => $ex->getMessage()
            ]);
        }
    }
}

$categories = new Categories();

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

            case "getCategories":
                if ($requestMethod === "GET") {
                    echo $categories->getCategories();
                } else {
                    http_response_code(405);
                    echo json_encode([
                        "status" => 405,
                        "success" => false,
                        "data" => [],
                        "message" => "Invalid request method for login. Use GET."
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
