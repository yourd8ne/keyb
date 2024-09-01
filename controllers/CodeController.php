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

    public function getLanguages() {
        try {
            $data = $this->model->getLanguage();
            echo json_encode($data);
        } catch (Exception $e) {
            echo json_encode(['error' => $e->getMessage()]);
        }
    }
    
    // public function getAttempts() {
    //     try {
    //         data = $this->model->getAttempts();
    //         echo json_encode($data);
    //     } catch (Exception $e) {
    //         echo json_encode(['error' => $e->getMessage()]);
    //     }
    // }

    public function closeModelConnection() {
        $this->model->closeConnection();
    }
}

$controller = new CodeController();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    if (isset($data['language'])) {
        $controller->getCode($data['language']);
    } else {
        echo json_encode(['error' => 'Language parameter missing']);
    }
} elseif ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (isset($_GET['action'])) {
        switch ($_GET['action']) {
            case 'getLanguages': 
                $controller->getLanguages();
                break;
            case 'getAttempts':
                $controller->getAttempts();
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
