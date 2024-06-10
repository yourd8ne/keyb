<?php
header('Content-Type: application/json; charset=utf-8');
require_once '../controllers/UserController.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $controller = new UserController();
    $username = $_POST['username'];
    $password = $_POST['password'];

    $result = $controller->signup($username, $password);

    if ($result === "The user has been successfully registered.") {
        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['success' => false, 'message' => $result]);
    }
    exit();
}
?>
