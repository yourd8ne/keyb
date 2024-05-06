<?php

$servername = "localhost";
$username = "root";
$password = "root";
$dbname = "keyb";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die(json_encode(array('error' => 'Connection failed: ' . $conn->connect_error)));
}

try {
    $language = $conn->real_escape_string($_POST['language']);
    $sql = "SELECT text FROM Dictionary WHERE name = '$language'";
    
    $result = $conn->query($sql);
    
    if ($result->num_rows > 0) {
        $row = $result->fetch_assoc();
        $responseData = array('text' => nl2br(htmlspecialchars($row['text'])));
        //echo html_entity_decode($responseData);
        echo json_encode($responseData);
    } else { 
        echo json_encode(array('error' => 'Language not found'));
    }
    
    $conn->close();
    flush();
} catch (Exception $e) {
    die(json_encode(array('error' => $e->getMessage())));
}
?>
