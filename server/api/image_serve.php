<?php

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: http://localhost:3000');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

$imagePath = $_GET['image'];
$fullPath = __DIR__ . '/../MEDIA/course_images/' . $imagePath;

if (file_exists($fullPath)) {
    $imageInfo = getimagesize($fullPath);
    header('Content-Type: ' . $imageInfo['mime']);
    readfile($fullPath);
} else {
    http_response_code(404);
    echo "Image not found";
}
