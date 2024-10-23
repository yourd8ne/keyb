<?php
header('Content-Type: application/json');

require_once '../models/DatabaseModel.php';

class CodeController {
    private $model;

    public function __construct() {
        $this->model = new DatabaseModel();
    }

    public function getCode($DictionaryName) {
        try {
            // Получаем результат из модели
            $dataFromModel = $this->model->getCode($DictionaryName);
            
            if (is_array($dataFromModel)) { // Проверяем, что это массив
                // Возвращаем как 'Name', так и 'Code'
                echo json_encode([
                    'HighliteName' => $dataFromModel['HighliteName'],
                    'Code' => $dataFromModel['Code']
                ]);
            } else {
                throw new Exception('Invalid data returned from model'); // Бросаем исключение для строк или null
            }
        } catch (Exception $e) {
            error_log('Error in getCode: ' . $e->getMessage()); // Логируем ошибку
            http_response_code(500); // Устанавливаем код ошибки 500
            echo json_encode(['error' => $e->getMessage()]);
        }
    }     

    public function getLanguages() {
        try {
            $data = $this->model->getLanguage();
            echo json_encode($data);
        } catch (Exception $e) {
            echo json_encode(['error' => $e->getMessage()]);
        }
    }

    // Ensure the connection is properly closed
    public function closeModelConnection() {
        if ($this->model) {
            $this->model->closeConnection();
        }
    }    
}

// Instantiate the controller
$controller = new CodeController();

// Handle POST and GET requests
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    if (isset($data['dictionaryName'])) {
        $controller->getCode($data['dictionaryName']);
    } else {
        echo json_encode(['error' => 'DictionaryName parameter missing']);
    }
} elseif ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (isset($_GET['action'])) {
        switch ($_GET['action']) {
            case 'getLanguages': 
                $controller->getLanguages();
                break;
            default:
                echo json_encode(['error' => 'Invalid action']);
                break;
        } 
    } else {
        echo json_encode(['error' => 'Action parameter missing']);
    }
}

// Close the database connection after the request is handled
$controller->closeModelConnection();