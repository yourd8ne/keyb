<?php
header('Content-Type: application/json');

require_once '../models/DatabaseModel.php';

class CodeController {
    private $model;

    public function __construct() {
        $this->model = new DatabaseModel();
    }

    // public function getNumberOfCodes() {
    //     try {
    //         $dataFromModel = $this->model->getNumberOfCodes();

    //         if ($dataFromModel === 0) {
    //             throw new Exception('Data returned from model is 0');
    //         }
            
    //         echo json_encode([
    //             'NumberOfCodes' => $dataFromModel
    //         ]);
    //     } catch (Exception $e) {
    //         error_log('Error in getNumberOfCodes: ' . $e->getMessage());
    //         http_response_code(500);
    //         echo json_encode([
    //             'error' => 'An error occurred while fetching numberOfCodes info'
    //         ]);
    //     }
    // }

    public function getDictionariesInfo() {
        try {
            $dataFromModel = $this->model->getDictionariesInfo();
    
            if (!is_array($dataFromModel)) {
                throw new Exception('Data returned from model is not an array');
            }
    
            $response = [];
            foreach ($dataFromModel as $item) {
                if (!is_array($item) || !isset($item['Name'])) {
                    throw new Exception('Invalid data format in model response');
                }
                $response[] = [
                    'Name' => $item['Name']
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

    public function getCodes($dictionaryName) {
        try {
            if (empty($dictionaryName)) {
                throw new Exception('Dictionary name is required');
            }
            
            $dataFromModel = $this->model->getCodes($dictionaryName);
    
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
                    'idCode' => $item['idCode']
                ];
            }
            
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
                if (!isset($_GET['dictionaryName']) || empty($_GET['dictionaryName'])) {
                    http_response_code(400);
                    echo json_encode(['error' => 'Missing or empty dictionaryName parameter']);
                    break;
                }

                $dictionaryName = $_GET['dictionaryName'];
                $controller->getCodes($dictionaryName);
                break;
            default:
                http_response_code(400);
                echo json_encode(['error' => 'Invalid action']);
                break;
        }
    } else {
        http_response_code(400);
        echo json_encode(['error' => 'Action parameter missing']);
    }
}

$controller->closeModelConnection();
?>