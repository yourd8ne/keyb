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
        $selectedDict = $data->selectedDict;
        $timeSpent = $data->timeSpent;
        $speed = $data->speed;
        $numberOfCharacters = $data->numberOfCharacters;

        try {
            $this->model->saveSessionData($attemptTime, $username, $selectedDict, $timeSpent, $speed, $numberOfCharacters);
            echo json_encode(['status' => 'success']);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['message' => $e->getMessage()]);
        }
    }

    public function closeModelConnection() {
        $this->model->closeConnection();
    }
}

$data = json_decode(file_get_contents('php://input'));

if (!isset($data->attemptTime) || !isset($data->username) || !isset($data->selectedDict) || !isset($data->timeSpent) || !isset($data->speed) || !isset($data->numberOfCharacters)){
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'Missing required fields']);
    exit();
}

$controller = new SessionController();
$controller->saveSessionData($data);
$controller->closeModelConnection();
?>
