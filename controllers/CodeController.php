<?php
require_once '../models/DatabaseModel.php';

class CodeController {
    private $model;

    public function __construct() {
        $this->model = new DatabaseModel();
    }

    public function getCode($language) {
        try {
            $dataFromModel = $this->model->getCode($language);

            // Проверяем, что данные были успешно получены
            if ($dataFromModel !== null) {
                // Передаем данные в представление
                $dataFromController = $dataFromModel;
                include '../public/getCode.php';
            } else {
                throw new Exception('Data not found');
            }
        } catch (Exception $e) {
            header('Content-Type: application/json');
            echo json_encode(['error' => $e->getMessage()]);
        }
    }

    public function closeModelConnection() {
        $this->model->closeConnection();
    }
}


// Получаем и декодируем JSON данные из POST запроса
$data = json_decode(file_get_contents('php://input'), true);

// Проверяем, что JSON-параметр language установлен
if (isset($data['language'])) {
    $controller = new CodeController();
    $controller->getCode($data['language']);
    $controller->closeModelConnection();
} else {
    // Если JSON-параметр language не установлен, возвращаем ошибку
    header('Content-Type: application/json');
    echo json_encode(['error' => 'Language parameter missing']);
}
