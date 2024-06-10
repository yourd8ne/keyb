<?php
header('Content-Type: appication/json')

require_once '../models/DatabaseModel.php';

class SessionControler {
    private $model;

    public function __construct() {
        $this->model = new DatabaseModel();
    }

    public function SaveSessionData($data) {
        
        //id(попытки), data(время и дата попытки), time(сколько времени заняла попытка), idUser(idUser'a),
        //idDict(idсловаря яп и код), idText(сам текст введенный пользователем с ошибками или без), result(успешна ли попытка), inClass(по умолчанию), speed(скорость попытки)
        $username = $data->username;//?
        $currentData = $data->currentData;
        $selectLang = $data->selectLang;
        $attemptTime = $data->attemptTime;
        $speed = $data->speed;
        $idUser = $data->idUser;
        $idDict = $data->idDict;
        $idText = $data->idText;
        $result = $data->result;
        $this->model->SaveSessionData($username, $selectLang, $attemptTime, $speed);

        echo json_encode(['status' => 'success']);
    }

}

// Получаем и декодируем JSON данные из POST запроса
$data = json_decode(file_get_contents('php://input'));

// Используем контроллер для обработки данных
$controller = new SessionController();
$controller->saveSessionData($data);
$controller->closeModelConnection();
?>