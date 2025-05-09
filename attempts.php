<?php
require_once __DIR__ . '/controllers/AttemptController.php';

$controller = new AttemptsController();
$attempts = $controller->getAttempts();
$controller->closeModelConnection();
?>

<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>История попыток</title>
    <style>
        body { font-family: Arial, sans-serif; padding: 40px;}
        table { border-collapse: collapse; width: 100%; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f2f2f2; position: relative; }
        a { color: #0066cc; text-decoration: none; }
        a:hover { text-decoration: underline; }
        .numeric { text-align: right; }
        .tooltip {
            position: relative;
            display: inline-block;
            border-bottom: 1px dotted #666;
            cursor: help;
        }
        .tooltip .tooltiptext {
            visibility: hidden;
            width: 200px;
            background-color: #555;
            color: #fff;
            text-align: center;
            border-radius: 6px;
            padding: 5px;
            position: absolute;
            z-index: 1;
            bottom: 125%;
            left: 50%;
            margin-left: -100px;
            opacity: 0;
            transition: opacity 0.3s;
        }
        .tooltip:hover .tooltiptext {
            visibility: visible;
            opacity: 1;
        }
    </style>
</head>
<body>
    <h2>История попыток</h2>
    <table>
        <thead>
            <tr>
                <th>Дата</th>
                <th>Время</th>
                <th>Пользователь</th>
                <th>Словарь</th>
                <th>В классе</th>
                <th>Скорость (зн./мин)</th>
                <th>Символов</th>
                <th>Фрагментов</th>
                <th>
                    <div class="tooltip">Индекс ошибок
                        <span class="tooltiptext">Показывает соотношение ошибочных нажатий к общему числу нажатий (чем выше, тем больше ошибок)</span>
                    </div>
                </th>
                <th>
                    <div class="tooltip">Backspace
                        <span class="tooltiptext">Количество исправлений с помощью Backspace</span>
                    </div>
                </th>
            </tr>
        </thead>
        <tbody>
            <?php if ($attempts && count($attempts) > 0): ?>
                <?php foreach ($attempts as $attempt): ?>
                    <tr>
                        <td><?= htmlspecialchars($attempt['Date'] ?? '') ?></td>
                        <td><?= htmlspecialchars($attempt['Time'] ?? '') ?></td>
                        <td>
                            <a href="user_stats.php?user_id=<?= $attempt['idUser'] ?? '' ?>">
                                <?= htmlspecialchars($attempt['UserName'] ?? '') ?>
                            </a>
                        </td>
                        <td><?= htmlspecialchars($attempt['DictionaryName'] ?? '') ?></td>
                        <td><?= $attempt['inClass'] ? 'Да' : 'Нет' ?></td>
                        <td class="numeric"><?= htmlspecialchars($attempt['Speed'] ?? '') ?></td>
                        <td class="numeric"><?= htmlspecialchars($attempt['UserNumberOfCharacters'] ?? '') ?></td>
                        <td class="numeric"><?= htmlspecialchars($attempt['UserNumberOfSnippets'] ?? '') ?></td>
                        <td class="numeric">
                            <div class="tooltip"><?= htmlspecialchars($attempt['DirtinessIndex'] ?? '0') ?>
                                <span class="tooltiptext">
                                    <?= $attempt['DirtinessIndex'] >= 0.3 ? 'Много ошибок' : 
                                       ($attempt['DirtinessIndex'] >= 0.15 ? 'Среднее качество' : 'Хорошее качество') ?>
                                </span>
                            </div>
                        </td>
                        <td class="numeric"><?= htmlspecialchars($attempt['BackspaceCount'] ?? '0') ?></td>
                    </tr>
                <?php endforeach; ?>
            <?php else: ?>
                <tr>
                    <td colspan="10">Попытки не найдены</td>
                </tr>
            <?php endif; ?>
        </tbody>
    </table>
    <p><a href="keyb.php">← Назад в меню</a></p>
</body>
</html>