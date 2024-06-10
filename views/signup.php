<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="../public/css/style.css" />
    <title>Регистрация</title>
</head>
<body>
    <div class="container">
        <h2>Регистрация</h2>
        <form id="signup-form">
            <div class="form-group">
                <label for="username">Имя пользователя:</label>
                <input type="text" id="username" name="username" required>
            </div>
            <div class="form-group">
                <label for="password">Пароль:</label>
                <input type="password" id="password" name="password" required>
            </div>
            <div id="error-message"></div>
            <button class="button-register" type="submit">Зарегистрироваться</button>
        </form>
    </div>
    <script>
        document.getElementById('signup-form').addEventListener('submit', function(event) {
            event.preventDefault();
            
            const formData = new FormData(this);
            fetch('../public/process_signup.php', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    window.location.href = '../index.php';
                } else {
                    document.getElementById('error-message').innerHTML = `<p class="error">${data.message}</p>`;
                    console.error("Error during registration: " + data.message);
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
        });
    </script>
</body>
</html>
