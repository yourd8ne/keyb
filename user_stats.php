<?php
require_once __DIR__ . '/controllers/AttemptController.php';

$userId = $_GET['user_id'] ?? null;
if (!$userId) {
    die('Ошибка: Не указан ID пользователя');
}

$controller = new AttemptsController();
$stats = $controller->getUserStats($userId);
$controller->closeModelConnection();
?>

<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <title>Статистика пользователя</title>
    <style>
        .stats-container { max-width: 800px; margin: 20px auto; font-family: Arial, sans-serif; }
        .stat-card { background: #f8f9fa; padding: 20px; margin-bottom: 20px; border-radius: 5px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .stat-row { display: flex; justify-content: space-between; margin-bottom: 10px; padding: 8px 0; border-bottom: 1px solid #eee; }
        .stat-value { font-weight: bold; color: #2c3e50; }
        h2 { color: #2c3e50; text-align: center; }
        h3 { color: #3498db; margin-top: 0; }
        .error { color: #e74c3c; padding: 10px; background: #fadbd8; border-radius: 4px; }
        a { color: #3498db; text-decoration: none; display: inline-block; margin-top: 20px; }
        a:hover { text-decoration: underline; }
    </style>
</head>
<body>
    <div class="stats-container">
        <h2>Статистика пользователя</h2>
        
        <?php if (isset($stats['error'])): ?>
            <div class="error"><?= htmlspecialchars($stats['error']) ?></div>
        <?php else: ?>
            <div class="stat-card">
                <h3>Общая информация</h3>
                <div class="stat-row">
                    <span>Всего попыток:</span>
                    <span class="stat-value"><?= $stats['attempts_count'] ?></span>
                </div>
                <div class="stat-row">
                    <span>Процент в классе:</span>
                    <span class="stat-value"><?= $stats['in_class_ratio'] ?>%</span>
                </div>
            </div>
            
            <div class="stat-card">
                <h3>Скорость печати (знаков/мин)</h3>
                <div class="stat-row">
                    <span>Средняя:</span>
                    <span class="stat-value"><?= $stats['speed']['mean'] ?></span>
                </div>
                <div class="stat-row">
                    <span>Медиана:</span>
                    <span class="stat-value"><?= $stats['speed']['median'] ?></span>
                </div>
                <div class="stat-row">
                    <span>Максимальная:</span>
                    <span class="stat-value"><?= $stats['speed']['max'] ?></span>
                </div>
                <div class="stat-row">
                    <span>95-й перцентиль:</span>
                    <span class="stat-value"><?= $stats['speed']['percentile_95'] ?></span>
                </div>
                <div class="stat-row">
                    <span>3-й квартиль:</span>
                    <span class="stat-value"><?= $stats['speed']['quartile_3'] ?></span>
                </div>
            </div>
            
            <div class="stat-card">
                <h3>Анализ текста</h3>
                <div class="stat-row">
                    <span>Среднее кол-во символов:</span>
                    <span class="stat-value"><?= $stats['chars_avg'] ?></span>
                </div>
                <div class="stat-row">
                    <span>Среднее кол-во фрагментов:</span>
                    <span class="stat-value"><?= $stats['snippets_avg'] ?></span>
                </div>
            </div>
        <?php endif; ?>
        
        <a href="attempts.php">← Вернуться к списку попыток</a>
    </div>
</body>
</html>