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
        //error_log("Attempting login with username: $username");

        // Debugging
        // if (empty($username) || empty($password)) {
        //     error_log("Username or password is empty");
        // }

        $result = $this->model->login($username, $password);
        //error_log("Login result: " . $result);

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
        //error_log("Signup result: " . $result);
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
        //error_log("Handling request");

        // Debugging
        // error_log("Request method: " . $_SERVER["REQUEST_METHOD"]);
        // error_log("POST data: " . print_r($_POST, true));

        if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_POST['action'])) {
            $action = $_POST['action'];
            //error_log("Action: $action");

            if ($action === 'login') {
                //error_log("Login action detected");
                $this->login($_POST['username'], $_POST['password']);
            } elseif ($action === 'signup') {
                //error_log("Signup action detected");
                $this->signup($_POST['username'], $_POST['password']);
            } else {
                error_log("Unknown action: $action");
            }
        } else {
            // Проверка сессии и перенаправление
            if (!isset($_SESSION['username'])) {
                //error_log("Session not found. Redirecting to login page.");
                header('Location: ../views/login.php');
                exit();
            }
        }
    }
}

$controller = new UserController();
$controller->handleRequest();
?>
