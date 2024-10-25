<?php
require_once __DIR__ . '/controllers/AttemptController.php';

$controller = new AttemptsController();
$attempts = $controller->getAttempts();
$controller->closeModelConnection(); // Закрываем соединение

// Проверяем, есть ли данные
if (isset($attempts['error'])) {
    echo 'Error: ' . htmlspecialchars($attempts['error']);
    exit; // Остановить выполнение, если произошла ошибка
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Attempts Table</title>
    <link rel="stylesheet" href="public/css/attempt_style.css" />
</head>
<body>
    <h2>Attempts Table</h2>
    <table border="1">
        <thead>
            <tr>
                <th>Date</th>
                <th>Time</th>
                <th>UserName</th>
                <th>DictionaryName</th>
                <th>inClass</th>
                <th>Speed</th>
            </tr>
        </thead>
        <tbody>
            <?php if ($attempts && count($attempts) > 0): ?>
                <?php foreach ($attempts as $attempt): ?>
                    <tr>
                        <td><?php echo htmlspecialchars($attempt['Date']); ?></td>
                        <td><?php echo htmlspecialchars($attempt['Time']); ?></td>
                        <td><?php echo htmlspecialchars($attempt['UserName']); ?></td>
                        <td><?php echo htmlspecialchars($attempt['DictionaryName']); ?></td>
                        <td><?php echo htmlspecialchars($attempt['inClass']); ?></td>
                        <td><?php echo htmlspecialchars($attempt['Speed']); ?></td>
                    </tr>
                <?php endforeach; ?>
            <?php else: ?>
                <tr>
                    <td colspan="6">No attempts found</td>
                </tr>
            <?php endif; ?>
        </tbody>
    </table>
    <a href="keyb.php">Back to Menu</a>
</body>
</html>