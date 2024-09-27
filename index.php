<?php
require_once __DIR__ . '/controllers/UserController.php';

$controller = new UserController();
$controller->handleRequest();
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>keyb</title>
    <link rel="stylesheet" href="public/css/style.css" />
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.5.0/styles/monokai-sublime.min.css">
</head>
<body>
    <div class="container">
        <h2>Практика набора кода</h2>
        <div class="preparation">
            <form class="choose">
                <div class="form-group">
                    <label for="prog-lang">Выберите язык программирования</label>
                    <select id="prog-lang">
                    </select>
                </div>
            </form>
        </div>
        <button id="ready">Готов</button>
        <div class="processing">
            <div class="sample">
            </div>
            <input type="text" id="input" />
            <div class="output">
                <div id="time"></div>
                <div id="speed"></div>
                <button id="again">Повторить</button>
                <button id="back-to-menu">Вернуться в меню</button>
            </div>
        </div>
    </div>
    <?php if (isset($_SESSION['username'])): ?>
    <script>
        // Передаем username в JavaScript
        const username = <?php echo json_encode($_SESSION['username']); ?>;
    </script>
    <?php endif; ?>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.5.0/highlight.min.js"></script>
    <script src="public/js/script.js"></script>
</body>
</html>
