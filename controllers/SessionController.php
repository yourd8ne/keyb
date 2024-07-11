<?php
header('Content-Type: application/json');

require_once '../models/DatabaseModel.php';

class SessionController {
    private $model;

    public function __construct() {
        $this->model = new DatabaseModel();
    }

    public function saveSessionData($data) {
        $attemptTime = $data->attemptTime;
        $username = $data->username;
        $selectLang = $data->selectLang;
        $timeSpent = $data->timeSpent;
        $speed = $data->speed;

        try {
            $this->model->saveSessionData($attemptTime, $username, $selectLang, $timeSpent, $speed);
            echo json_encode(['status' => 'success']);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
        }
    }

    public function closeModelConnection() {
        $this->model->closeConnection();
    }
}

$data = json_decode(file_get_contents('php://input'));

if ($data === null) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'Invalid JSON']);
    exit();
}

$controller = new SessionController();
$controller->saveSessionData($data);
$controller->closeModelConnection();
?>
