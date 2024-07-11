<?php
require_once __DIR__ . '/../models/DatabaseModel.php';

if (session_status() == PHP_SESSION_NONE) {
    session_start();
}

class UserController {
    private $model;

    public function __construct() {
        $this->model = new DatabaseModel();
    }
    
    public function login($username, $password) {
        $result = $this->model->login($username, $password);
        error_log("Login result: " . $result);
        if ($result === "Login successful.") {
            $_SESSION['username'] = $username;
            header("Location: ../index.php");
            exit();
        } else {
            $error = urlencode($result);
            header("Location: ../views/login.php?error=" . $error);
            exit();
        }
    }
    
    public function signup($username, $password) {
        $result = $this->model->signup($username, $password);
        error_log("Signup result: " . $result);
        if ($result === "The user has been successfully registered.") {
            header("Location: ../views/login.php?success=1");
            exit();
        } else {
            $error = urlencode($result);
            header("Location: ../views/signup.php?error=" . $error);
            exit();
        }
    }

    public function handleRequest() {
        if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_POST['action'])) {
            $action = $_POST['action'];
            if ($action === 'login') {
                $this->login($_POST['username'], $_POST['password']);
            } elseif ($action === 'signup') {
                $this->signup($_POST['username'], $_POST['password']);
            }
        }
    }
}

$controller = new UserController();
$controller->handleRequest();
?>
