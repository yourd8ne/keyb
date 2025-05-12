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
    <link rel="stylesheet" href="public/css/style.css">
    <!-- Подключаем CodeMirror -->
    <link rel="stylesheet" href="public/lib/codemirror/lib/codemirror.css">
    <link rel="stylesheet" href="public/lib/codemirror/theme/eclipse.css">
</head>
<body>
    <div class="container">
        <h2 id='main-header'>Практика набора кода</h2>
        <div class="preparation">
            <form class="choose">
                <div class="form-group">
                    <label for="prog-lang">Выберите словарь</label>
                    <select id="prog-lang">
                    </select>
                </div>
            </form>
            <button id="ready">Готов</button>
            <a href="attempts.php" id="attempts_button">View Attempts</a>
        </div>
        <div class="processing">
            <div class="sample"><!--  inert -->
            </div>
            <div id="input-container">
            </div>
        </div>
        <div class="output">
                <div id="time"></div>
                <div id="speed"></div>
                <div id="numberOfCodes"></div>
                <div id="numberOfChars"></div>

                <!-- <div class="metric-tooltip">
                    <div id="error-rate"></div>
                    <span class="tooltip">Процент строк с ошибками (неверные попытки / все попытки)</span>
                </div> -->

                <div class="metric-tooltip">
                    <div id="cleanliness"></div>
                    <span class="tooltip">Доля верных символов от общего объёма кода</span>
                </div>

                <div class="metric-tooltip">
                    <div id="dirtiness"></div>
                    <span class="tooltip">Ошибки на 1000 символов (чем меньше, тем лучше)</span>
                </div>

                <div class="metric-tooltip">
                    <div id="backspaces"></div>
                    <span class="tooltip">Количество исправлений до проверки</span>
                </div>

                <div class="metric-tooltip">
                    <div id="error-coefficient"></div>
                    <span class="tooltip">Процент ошибок, допущенных при наборе текста. Чем ниже значение, тем лучше.</span>
                </div>

                <div class="metric-tooltip">
                    <div id="correction-coefficient"></div>
                    <span class="tooltip">Процент исправлений, сделанных при наборе текста. Чем ниже значение, тем лучше.</span>
                </div>

                
                <button id="again">Повторить</button>
                <button id="back-to-menu">Вернуться в меню</button>
            </div>
        <!-- <?php if (isset($_SESSION['username'])): ?>
            <button id="logout" onclick="window.location.href='?action=logout'">Выйти</button>
        <?php endif; ?> -->

    </div>

    <script src="public/lib/codemirror/lib/codemirror.js"></script>
    <script src="public/lib/codemirror/mode/python/python.js"></script>
    <script src="public/lib/codemirror/mode/clike/clike.js"></script>
    <script src="public/lib/codemirror/mode/javascript/javascript.js"></script>
    <script src="public/js/script.js"></script>

    <?php if (isset($_SESSION['username'])): ?>
    <script>
        const username = <?php echo json_encode($_SESSION['username']); ?>;
    </script>
    <?php endif; ?>
</body>
</html>