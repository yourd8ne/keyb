<?php
require_once __DIR__ . '/../models/DatabaseModel.php';

class AttemptsController {
    private $model;

    public function __construct() {
        $this->model = new DatabaseModel();
    }

    public function getUserStats($userId) {
        try {
            $stats = $this->model->getUserStats($userId);
            
            if (isset($stats['error'])) {
                return $stats;
            }
            
            // Форматируем данные для удобного отображения
            return [
                'attempts_count' => $stats['attempts_count'],
                'in_class_count' => $stats['in_class_count'], // Добавляем ключ in_class_count
                'speed' => [
                    'mean' => round($stats['mean_speed'], 2),
                    'max' => $stats['max_speed'],
                    'median' => round($stats['median_speed'], 2),
                    'percentile_95' => round($stats['percentile_95'], 2),
                    'quartile_3' => round($stats['quartile_3'], 2)
                ],
                'chars_avg' => round($stats['avg_chars']),
                'snippets_avg' => round($stats['avg_snippets']),
            ];
        } catch (Exception $e) {
            error_log('Error in getUserStats: ' . $e->getMessage());
            return ['error' => $e->getMessage()];
        }
    }

    public function getAttempts() {
        try {
            $result = $this->model->getAttempts();
            $data = [];
            
            if ($result) {
                while ($row = $result->fetch_assoc()) {
                    // Проверяем наличие обязательных полей
                    if (!isset($row['idUser'])) {
                        throw new Exception("Отсутствует idUser в данных попытки");
                    }
                    $data[] = $row;
                }
            }
            
            return $data;
        } catch (Exception $e) {
            error_log('Error in getAttempts: ' . $e->getMessage());
            return ['error' => $e->getMessage()];
        }
    }
    
    public function closeModelConnection() {
        if ($this->model) {
            $this->model->closeConnection();
        }
    }  
}
?>