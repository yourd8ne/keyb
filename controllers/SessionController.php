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
        $dictNumberOfCharacters = $data->dictNumberOfCharacters;
        $userNumberOfCharacters = $data->userNumberOfCharacters;

        try {
            $this->model->saveSessionData($attemptTime, $username, $selectedDict, $timeSpent, $speed, $dictNumberOfCharacters, $userNumberOfCharacters);
            echo json_encode(['status' => 'success']);
        } catch (Exception $e) {
            http_response_code(500);
            error_log("Error saving session data: " . $e->getMessage());
            echo json_encode(['message' => 'Internal Server Error']);
        }
    }

    public function closeModelConnection() {
        $this->model->closeConnection();
    }
}

$data = json_decode(file_get_contents('php://input'));

$requiredFields = ['attemptTime', 'username', 'selectedDict', 'timeSpent', 'speed', 'dictNumberOfCharacters', 'userNumberOfCharacters'];
foreach ($requiredFields as $field) {
    if (!isset($data->$field)) {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => "Missing required field: $field"]);
        exit();
    }
}

$controller = new SessionController();
$controller->saveSessionData($data);
$controller->closeModelConnection();
?>
