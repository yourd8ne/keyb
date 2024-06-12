<?php
// Выводим данные в формате JSON
header('Content-Type: application/json');

// Проверяем, что переменная $dataFromModel определена
if (isset($dataFromController)) {
    echo json_encode(['text' => $dataFromController]);
} else {
    echo json_encode(['error' => 'Data not available']);
}
?>

