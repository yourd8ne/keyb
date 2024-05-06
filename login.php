<?php
session_start();

$servername = "localhost";
$username = "root";
$password = "root";
$dbname = "keyb";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Ошибка подключения: " . $conn->connect_error);
}

$message = "";

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $username = htmlspecialchars($_POST["username"]);
    $password = htmlspecialchars($_POST["password"]);

    $username = $conn->real_escape_string($username);
    
    $sql = "SELECT id, password FROM users WHERE login = '$username'";
    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
        $row = $result->fetch_assoc();
        $hashedPassword = $row["password"];
    
        if (password_verify($password, $hashedPassword)) {
            $_SESSION['username'] = $username;
            header("Location: index.php");
            exit();
        }
        else {
            $message = "Неправильный пароль";
        }
    } else {
        $message = "Неправильное имя пользователя";
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
    <title>Вход</title>
    
</head>
<body>
    
    <div class="container">
        <h2>Вход</h2>
        <form method="post" action="<?php echo $_SERVER['PHP_SELF']; ?>">
            <div class="form-group">
                <label for="username">Имя пользователя:</label>
                <input type="text" id="username" name="username" required>
            </div>
            <div class="form-group">
                <label for="password">Пароль:</label>
                <input type="password" id="password" name="password" required>
            </div>
            <p><?php echo $message; ?></p>
            <button class="button-login" type="submit">Войти</button>
        </form>

        <div class="switch-form">
            <p>Нет аккаунта? <a href="registration.php">Зарегистрироваться</a></p>
        </div>
    </div>
</body>
</html>
