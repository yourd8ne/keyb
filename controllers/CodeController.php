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
            
            if (!is_array($dataFromModel)) {
                throw new Exception('Data returned from model is not an array');
            }
    
            $response = [];
            foreach ($dataFromModel as $item) {
                if (!is_array($item) || !isset($item['HighlightName'], $item['Code'])) {
                    throw new Exception('Invalid data format in model response');
                }
                $response[] = [
                    'HighlightName' => $item['HighlightName'],
                    'Code' => $item['Code']
                ];
            }
            echo json_encode($response);
        } catch (Exception $e) {
            //error_log('Error in getCode: ' . $e->getMessage());
            http_response_code(500);
            echo json_encode([
                'error' => 'An error occurred while fetching code data'
            ]);
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

    public function closeModelConnection() {
        if ($this->model) {
            $this->model->closeConnection();
        }
    }    
}

$controller = new CodeController();

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

$controller->closeModelConnection();