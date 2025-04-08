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
        body { font-family: Arial, sans-serif; }
        table { border-collapse: collapse; width: 100%; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f2f2f2; }
        a { color: #0066cc; text-decoration: none; }
        a:hover { text-decoration: underline; }
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
                        <td><?= htmlspecialchars($attempt['Speed'] ?? '') ?></td>
                        <td><?= htmlspecialchars($attempt['UserNumberOfCharacters'] ?? '') ?></td>
                        <td><?= htmlspecialchars($attempt['UserNumberOfSnippets'] ?? '') ?></td>
                    </tr>
                <?php endforeach; ?>
            <?php else: ?>
                <tr>
                    <td colspan="8">Попытки не найдены</td>
                </tr>
            <?php endif; ?>
        </tbody>
    </table>
    <p><a href="keyb.php">← Назад в меню</a></p>
</body>
</html>