<?php
require_once '../controllers/UserController.php';
session_start();

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $controller = new UserController();
    $result = $controller->login($_POST['username'], $_POST['password']);
    error_log("Process login result: " . $result);  // Логирование результата

    if ($result === "Успешный вход.") {
        error_log("Redirecting to index.php from process_login.php");  // Логирование перед перенаправлением
        $_SESSION['username'] = $_POST['username'];
        header("Location: ../index.php");
        exit();
    } else {
        $error = urlencode($result);
        header("Location: ../views/login.php?error=" . $error);
        exit();
    }
}
?>
