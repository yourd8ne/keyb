<?php
header('Content-Type: application/json');

require_once '../models/DatabaseModel.php';

class CodeController {
    private $model;

    public function __construct() {
        $this->model = new DatabaseModel();
    }

    public function getDictionariesInfo() {
        try {
            $dataFromModel = $this->model->getDictionariesInfo();
    
            if (!is_array($dataFromModel)) {
                throw new Exception('Data returned from model is not an array');
            }
    
            $response = [];
            foreach ($dataFromModel as $item) {
                if (!is_array($item) || !isset($item['Name'], $item['NumberOfCodes'])) {
                    throw new Exception('Invalid data format in model response');
                }
                $response[] = [
                    'Name' => $item['Name'],
                    'NumberOfCodes' => $item['NumberOfCodes']
                ];
            }
            echo json_encode($response);
        } catch (Exception $e) {
            error_log('Error in getDictionariesInfo: ' . $e->getMessage());
            http_response_code(500);
            echo json_encode([
                'error' => 'An error occurred while fetching dictionaries info'
            ]);
        }
    }

    public function getCodes($dictionaryName, $numberOfCodes) {
        try {
            // Получаем результат из модели
            $dataFromModel = $this->model->getCodes($dictionaryName, $numberOfCodes);
    
            if (!is_array($dataFromModel)) {
                throw new Exception('Data returned from model is not an array');
            }
    
            $response = [];
            foreach ($dataFromModel as $item) {
                if (!is_array($item) || !isset($item['HighlightName'], $item['Code'], $item['idCode'])) {
                    throw new Exception('Invalid data format in model response');
                }
                $response[] = [
                    'HighlightName' => $item['HighlightName'],
                    'Code' => $item['Code'],
                    'idCode' => $item['idCode']  // Добавляем idCode в ответ
                ];
            }
    
            // Отправляем ответ в формате JSON
            echo json_encode($response);
        } catch (Exception $e) {
            error_log('Error in getCodes: ' . $e->getMessage());
            http_response_code(500);
            echo json_encode([
                'error' => 'An error occurred while fetching code data'
            ]);
        }
    }    

    public function closeModelConnection() {
        if ($this->model) {
            $this->model->closeConnection();
        }
    }
}

$controller = new CodeController();

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (isset($_GET['action'])) {
        switch ($_GET['action']) {
            case 'getDictionariesInfo':
                $controller->getDictionariesInfo();
                break;
            case 'getCodes':
                if (!isset($_GET['dictionaryName'], $_GET['numberOfCodes'])) {
                    echo json_encode(['error' => 'Missing parameters']);
                    break;
                }
            
                $dictionaryName = $_GET['dictionaryName'];
                $numberOfCodes = intval($_GET['numberOfCodes']);
            
                $controller->getCodes($dictionaryName, $numberOfCodes);
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
?>