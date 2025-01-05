<?php
require_once '../models/DatabaseModel.php';

class SessionController {
    private $model;

    public function __construct() {
        $this->model = new DatabaseModel();
    }

    public function saveSessionData() {
        $input = json_decode(file_get_contents('php://input'), true);
    
        // Проверка данных на наличие всех необходимых полей
        if (!$input || !isset($input['attemptTime'], $input['username'], $input['selectedDict'], $input['timeSpent'], $input['speed'], $input['userNumberOfCharacters'], $input['userNumberOfSnippets'], $input['idCodes'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Invalid input']);
            return;
        }
    
        // Убедимся, что idCodes это массив строк
        $idCodes = is_array($input['idCodes']) ? array_map('strval', $input['idCodes']) : [];
    
        try {
            // Сохранение данных сессии
            $idAttempts = $this->model->saveSessionData(
                $input['attemptTime'],
                $input['username'],
                $input['selectedDict'],
                $input['timeSpent'],
                $input['speed'],
                $input['userNumberOfCharacters'],
                $input['userNumberOfSnippets']
            );

            // Получение идентификатора словаря по названию
            $idDictionary = $this->model->getDictionaryIdByName($input['selectedDict']);

            // Сохранение кодов для сессии
            $this->model->saveCodeForSession(
                $idAttempts,
                $idDictionary,
                implode(',', $idCodes) // Преобразуем массив ID кодов в строку
            );
    
            echo json_encode(['success' => true]);
        } catch (Exception $e) {
            error_log('Error in saveSessionData: ' . $e->getMessage());
            http_response_code(500);
            echo json_encode(['error' => $e->getMessage()]);
        }
    }
}

$controller = new SessionController();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $controller->saveSessionData();
}
?>
