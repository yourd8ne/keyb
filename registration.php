<?php

$servername = "localhost";
$username = "root";
$password = "root";
$dbname = "keyb";

$conn = new mysqli($servername, $username, $password, $dbname);
$message = "";

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

error_reporting(E_ALL);
ini_set('display_errors', '1');

if ($_SERVER["REQUEST_METHOD"] == "POST") {
 
    $username = $conn->real_escape_string($_POST["username"]);
    $password = $_POST["password"];

    if (strlen($username) < 4) {
        $message = "Имя пользователя должно быть не менее 4 символов.";
    } else {
        // Проверка длины пароля
        if (strlen($password) < 8) {
            $message = "Пароль должен быть не менее 8 символов.";
        } else {
            $check_user_query = "SELECT * FROM users WHERE login = '$username'";
            $check_user_result = $conn->query($check_user_query);

            if ($check_user_result->num_rows > 0) {
                $message = "Пользователь с таким именем уже существует.";
            } else {
                $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
                $insert_user_query = "INSERT INTO users (login, password) VALUES ('$username', '$hashedPassword')";

                if ($conn->query($insert_user_query) === TRUE) {
                    $message = "Пользователь успешно зарегистрирован.";
                    header("Location: login.php");
                    exit();
                } else {
                    $message = "Ошибка при регистрации пользователя: " . $conn->error;
                }
            }
        }
    }
}

$conn->close();
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="public/css/style.css" />
    <title>Регистрация</title>
</head>
<body>
    <div class="container"> 
        <h2>Регистрация</h2>
    <form action="" method="post">
        <div class="form-group">
            <label for="username">Имя пользователя:</label>
            <input type="text" id="username" name="username" required>
        </div>
        
        <div class="form-group">
            <label for="password">Пароль:</label>
            <input type="password" id="password" name="password" required>
        </div>
        <p><?php echo $message; ?></p>
        <button class="button-register" type="submit">Зарегистрироваться</button>
    </form>
    </div>
</body>
</html>