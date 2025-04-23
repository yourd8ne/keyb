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
    <link rel="stylesheet" href="highlight/styles/github.min.css">
    <!-- <script src="highlight/highlight.min.js"></script> -->
    <script type="module">
        import { EditorState } from "./node_modules/@codemirror/state/dist/index.js";
        import { EditorView, basicSetup } from "./node_modules/@codemirror/view/dist/index.js";
        import { keymap } from "./node_modules/@codemirror/view/dist/index.js";
        import { defaultKeymap } from "./node_modules/@codemirror/commands/dist/index.js";
        import { python } from "./node_modules/@codemirror/lang-python/dist/index.js";
        import { cpp } from "./node_modules/@codemirror/lang-cpp/dist/index.js";
        // Экспортируем модули для использования в script.js
        window.CodeMirrorModules = {
            EditorView,
            EditorState,
            basicSetup,
            keymap,
            defaultKeymap,
            python,
            cpp,
        };
    </script>
</head>
<body>
    <div class="container">
        <h2>Практика набора кода</h2>
        <div class="preparation">
            <a href="attempts.php" id="attempts_button">View Attempts</a>
            <form class="choose">
                <div class="form-group">
                    <label for="prog-lang">Выберите словарь</label>
                    <select id="prog-lang">
                    </select>
                </div>
            </form>
        </div>
        <button id="ready">Готов</button>
        <div class="processing">
            <div class="sample" inert><!--  inert -->
            </div>
            <div id="input-container">
            </div>
        </div>
        <div class="output">
                <div id="time"></div>
                <div id="speed"></div>
                <div id="numberOfCodes"></div>
                <div id="numberOfChars"></div>
                <button id="again">Повторить</button>
                <button id="back-to-menu">Вернуться в меню</button>
            </div>
        <!-- <?php if (isset($_SESSION['username'])): ?>
            <button id="logout" onclick="window.location.href='?action=logout'">Выйти</button>
        <?php endif; ?> -->

    </div>
    <?php if (isset($_SESSION['username'])): ?>
    <script>
        const username = <?php echo json_encode($_SESSION['username']); ?>;
    </script>
    <?php endif; ?>
    <script src="public/js/script.js"></script>
</body>
</html>