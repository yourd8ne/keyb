<?php
require_once __DIR__ . '/../models/DatabaseModel.php';

class AttemptsController {
    private $model;

    public function __construct() {
        $this->model = new DatabaseModel();
    }

    public function getAttempts() {
        $data = [];
        try {
            $result = $this->model->getAttempts(); // Получение данных
            
            // Проверяем, есть ли результаты
            if ($result) {
                while ($row = $result->fetch_assoc()) {
                    $data[] = $row;
                }
            }
            error_log(print_r($data, true)); // Логируем данные в виде строки
            return $data; // Возвращаем данные
        } catch (Exception $e) {
            error_log('Error fetching attempts: ' . $e->getMessage()); // Логируем ошибку
            return ['error' => $e->getMessage()]; // Возврат ошибки
        }
    }
    
    public function closeModelConnection() {
        if ($this->model) {
            $this->model->closeConnection();
        }
    }  
}
?>