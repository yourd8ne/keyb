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
        .stat-row { display: flex; justify-content: space-between; margin-bottom: 10px; padding: 8px 0; border-bottom: 1px solid #eee; position: relative; }
        .stat-value { font-weight: bold; color: #2c3e50; }
        h2 { color: #2c3e50; text-align: center; }
        h3 { color: #3498db; margin-top: 0; }
        .error { color: #e74c3c; padding: 10px; background: #fadbd8; border-radius: 4px; }
        a { color: #3498db; text-decoration: none; display: inline-block; margin-top: 20px; }
        a:hover { text-decoration: underline; }
        .tooltip { 
            position: absolute;
            background: #333;
            color: #fff;
            padding: 5px 10px;
            border-radius: 4px;
            font-size: 14px;
            bottom: 100%;
            left: 50%;
            transform: translateX(-50%);
            white-space: nowrap;
            display: none;
            z-index: 100;
        }
        .stat-label:hover .tooltip {
            display: block;
        }
        .stat-label { 
            position: relative;
            cursor: help;
            border-bottom: 1px dashed #999;
        }
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
                    <span class="stat-label">
                        Всего попыток:
                        <span class="tooltip">Общее количество выполненных упражнений</span>
                    </span>
                    <span class="stat-value"><?= $stats['attempts_count'] ?></span>
                </div>
                <div class="stat-row">
                    <span class="stat-label">
                        Процент в классе:
                        <span class="tooltip">Доля упражнений, выполненных в классе (а не дома)</span>
                    </span>
                    <span class="stat-value"><?= $stats['in_class_ratio'] ?>%</span>
                </div>
            </div>
            
            <div class="stat-card">
                <h3>Скорость печати (знаков/мин)</h3>
                <div class="stat-row">
                    <span class="stat-label">
                        Средняя:
                        <span class="tooltip">Среднее арифметическое всех показателей скорости</span>
                    </span>
                    <span class="stat-value"><?= $stats['speed']['mean'] ?></span>
                </div>
                <div class="stat-row">
                    <span class="stat-label">
                        Медиана:
                        <span class="tooltip">Значение скорости, которое делит все попытки ровно пополам</span>
                    </span>
                    <span class="stat-value"><?= $stats['speed']['median'] ?></span>
                </div>
                <div class="stat-row">
                    <span class="stat-label">
                        Максимальная:
                        <span class="tooltip">Лучший показатель скорости за все попытки</span>
                    </span>
                    <span class="stat-value"><?= $stats['speed']['max'] ?></span>
                </div>
                <div class="stat-row">
                    <span class="stat-label">
                        95-й перцентиль:
                        <span class="tooltip">95% попыток были медленнее этого значения</span>
                    </span>
                    <span class="stat-value"><?= $stats['speed']['percentile_95'] ?></span>
                </div>
                <div class="stat-row">
                    <span class="stat-label">
                        3-й квартиль:
                        <span class="tooltip">75% попыток были медленнее этого значения</span>
                    </span>
                    <span class="stat-value"><?= $stats['speed']['quartile_3'] ?></span>
                </div>
            </div>
            
            <div class="stat-card">
                <h3>Анализ текста</h3>
                <div class="stat-row">
                    <span class="stat-label">
                        Среднее кол-во символов:
                        <span class="tooltip">Сколько в среднем символов набирал пользователь за упражнение</span>
                    </span>
                    <span class="stat-value"><?= $stats['chars_avg'] ?></span>
                </div>
                <div class="stat-row">
                    <span class="stat-label">
                        Среднее кол-во фрагментов:
                        <span class="tooltip">Сколько в среднем отдельных фрагментов кода набирал пользователь</span>
                    </span>
                    <span class="stat-value"><?= $stats['snippets_avg'] ?></span>
                </div>
            </div>
            
            <div class="stat-card">
                <h3>Пояснение терминов</h3>
                <ul style="margin-top: 0; padding-left: 20px;">
                    <li><strong>Медиана</strong> - серединное значение, менее чувствительно к выбросам чем среднее</li>
                    <li><strong>Перцентиль</strong> - значение, ниже которого попадает определённый процент результатов</li>
                    <li><strong>Квартиль</strong> - значения, которые делят данные на 4 равные части</li>
                </ul>
            </div>
        <?php endif; ?>
        
        <a href="attempts.php">← Вернуться к списку попыток</a>
    </div>
</body>
</html>