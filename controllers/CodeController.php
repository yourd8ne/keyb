<?php
header('Content-Type: application/json');

require_once '../models/DatabaseModel.php';

class CodeController {
    private $model;

    public function __construct() {
        $this->model = new DatabaseModel();
    }

    public function getCode($language) {
        try {
            $dataFromModel = $this->model->getCode($language);

            if ($dataFromModel !== null) {
                echo json_encode(['code' => $dataFromModel]);
            } else {
                throw new Exception('Data not found');
            }
        } catch (Exception $e) {
            echo json_encode(['error' => $e->getMessage()]);
        }
    }

    public function closeModelConnection() {
        $this->model->closeConnection();
    }
}

$data = json_decode(file_get_contents('php://input'), true);

if (isset($data['language'])) {
    $controller = new CodeController();
    $controller->getCode($data['language']);
    $controller->closeModelConnection();
} else {
    echo json_encode(['error' => 'Language parameter missing']);
}
