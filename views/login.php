<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="../public/css/style.css" />
    <title>Вход</title>
</head>
<body>
    <div class="container">
        <h2>Вход</h2>
        <form method="post" action="../controllers/UserController.php">
            <input type="hidden" name="action" value="login">
            <div class="form-group">
                <label for="username">Имя пользователя:</label>
                <input type="text" id="username" name="username" required>
            </div>
            <div class="form-group">
                <label for="password">Пароль:</label>
                <input type="password" id="password" name="password" required>
            </div>
            <?php if (isset($_GET['error'])): ?>
                <p class="error"><?php echo htmlspecialchars($_GET['error']); ?></p>
            <?php endif; ?>
            <button class="button-login" type="submit">Войти</button>
        </form>
        <div class="switch-form">
            <p>Нет аккаунта? <a href="signup.php">Зарегистрироваться</a></p>
        </div>
    </div>
</body>
</html>
