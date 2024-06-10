<?php
require_once '../models/DatabaseModel.php';
session_start();

class UserController {
    private $model;

    public function __construct() {
        $this->model = new DatabaseModel();
    }

    public function login($login, $password) {
        $result = $this->model->login($login, $password);
        if ($result === "Успешный вход.") {
            $_SESSION['username'] = $login;
        }
        return $result;
    }

    public function signup($login, $password) {
        return $this->model->signup($login, $password);
    }

    public function __destruct() {
        $this->model->closeConnection();
    }
}

// Обработка действий
if (isset($_GET['action'])) {
    $action = $_GET['action'];
    $controller = new UserController();

    if ($action === 'login' && $_SERVER["REQUEST_METHOD"] === "POST") {
        $result = $controller->login($_POST['username'], $_POST['password']);
        error_log("Login result: " . $result);  // Логирование результата
        if ($result === "Успешный вход.") {
            error_log("Redirecting to index.php");  // Логирование перед перенаправлением
            header("Location: ../index.php");
            exit();
        } else {
            $error = urlencode($result);
            header("Location: ../views/login.php?error=" . $error);
            exit();
        }
    } elseif ($action === 'signup' && $_SERVER["REQUEST_METHOD"] === "POST") {
        $result = $controller->signup($_POST['username'], $_POST['password']);
        error_log("Signup result: " . $result);  // Логирование результата
        if ($result === "The user has been successfully registered.") {
            header("Location: ../index.php");
            exit();
        } else {
            $error = urlencode($result);
            header("Location: ../views/signup.php?error=" . $error);
            exit();
        }
    }
}
?>
