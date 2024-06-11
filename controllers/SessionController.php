<?php
header('Content-Type: appication/json')

require_once '../models/DatabaseModel.php';

class SessionControler {
    private $model;

    public function __construct() {
        $this->model = new DatabaseModel();
    }

    public function SaveSessionData($data) {
        $attemptTime = $data->attemptTime;
        $username = $data->username;
        $selectLang = $data->selectLang;
        $timeSpent = $data->timeSpent;
        $speed = $data->speed;


        $this->model->SaveSessionData($attemptTime, $username, $selectLang, $timeSpent, $speed);

        echo json_encode(['status' => 'success']);
    }

    public function closeModelConnection() {
        $this->model->closeConnection();
    }
}

// Получаем и декодируем JSON данные из POST запроса
$data = json_decode(file_get_contents('php://input'));

// Используем контроллер для обработки данных
$controller = new SessionController();
$controller->SaveSessionData($data);
$controller->closeModelConnection();
?>