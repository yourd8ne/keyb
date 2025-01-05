<?php
header('Content-Type: text/html; charset=utf-8');

class DatabaseModel {
    private $conn;

    public function __construct() {
        $servername = "localhost";
        $username = "root";
        $password = "root";
        $dbname = "KeyB";

        $this->conn = new mysqli($servername, $username, $password, $dbname);

        if ($this->conn->connect_error) {
            die("Ошибка подключения: " . $this->conn->connect_error);
        }
    }

    public function getNumberOfCodes() {
        $sql = "CALL getNumberOfCodes;";

        $res = $this->conn->query($sql);
        
        if ($res && $row = $res->fetch_assoc()) {
            return (int)$row['Value'];
        } else {
            return 0;
        }
    }

    public function getDictionariesInfo() {
        $sql = "CALL getDictionariesInfo()";

        $res = $this->conn->query($sql);

        if ($res && $res->num_rows > 0) {
            $array = [];
            while ($row = $res->fetch_assoc()) {
                $array[] = [
                    'Name' => $row['Name'],
                    'NumberOfCodes' => $row['NumberOfCodes']
                ];
            }
            return $array;
        } else {
            return [];
        }
    }

    public function getDictionaryIdByName($selectedDict) {
        // Вызов хранимой процедуры для получения идентификатора словаря по названию
        $stmt = $this->conn->prepare("CALL GetDictionaryIdByName(?)");
        $stmt->bind_param("s", $selectedDict);
        $stmt->execute();

        // Получение результата
        $result = $stmt->get_result();
        $row = $result->fetch_assoc();
        return $row ? $row['idDictionary'] : null;
    }

    public function getCodes($dictionaryName, $numberOfCodes) {
        $dictionaryName = $this->conn->real_escape_string($dictionaryName);
        $numberOfCodes = intval($numberOfCodes); // Ensure it's an integer
    
        // Выполнение процедуры
        $sql = "CALL getCodes('$dictionaryName', $numberOfCodes)";
        $result = $this->conn->query($sql);
    
        $response = [];
        if ($result) {
            // Добавляем idCode в ответ
            while ($row = $result->fetch_assoc()) {
                $response[] = [
                    'HighlightName' => $row['HighlightName'],
                    'Code' => $row['Code'],
                    'idCode' => $row['idCode']  // Добавляем idCode
                ];
            }
        }
    
        return !empty($response) ? $response : null;
    }    

    public function getAttempts() {
        $query = "CALL GetAttempts()";
        $result = $this->conn->query($query);

        if (!$result) {
            throw new Exception("Ошибка выполнения запроса: " . $this->conn->error);
        }

        return $result;
    }

    public function saveSessionData($attemptTime, $username, $selectedDict, $timeSpent, $speed, $userNumberOfCharacters, $userNumberOfSnippets) {
    
        // Подготовка запроса
        $stmt = $this->conn->prepare("CALL saveSessionData(?, ?, ?, ?, ?, ?, ?)");
        
        if (!$stmt) {
            throw new Exception("Не удалось подготовить запрос: " . $this->conn->error);
        }
        
        // Передаем параметры в bind_param
        $stmt->bind_param("sssddii", $attemptTime, $username, $selectedDict, $timeSpent, $speed, $userNumberOfCharacters, $userNumberOfSnippets);
        
        if (!$stmt->execute()) {
            throw new Exception("Ошибка выполнения запроса: " . $stmt->error);
        }
        
        // Получаем idAttempts (последняя вставленная попытка)
        $stmt = $this->conn->prepare("SELECT LAST_INSERT_ID()");
        $stmt->execute();
        $stmt->bind_result($idAttempts);
        $stmt->fetch();
        $stmt->close();
        
        return $idAttempts;
    }
    
    public function saveCodeForSession($idAttempts, $dictId, $idCodes) {
        // Подготовка запроса для сохранения кодов
        $stmt = $this->conn->prepare("CALL saveCodeForSession(?, ?, ?)");
        
        if (!$stmt) {
            throw new Exception("Не удалось подготовить запрос: " . $this->conn->error);
        }
        
        // Убедитесь, что idCodes — это строка
        $stmt->bind_param("iis", $idAttempts, $dictId, $idCodes);
        
        if (!$stmt->execute()) {
            throw new Exception("Ошибка выполнения запроса: " . $stmt->error);
        }
        
        $stmt->close();
    }

    public function login($login, $password) {
        $login = $this->conn->real_escape_string($login);
        $password = $this->conn->real_escape_string($password);

        $login_query = "CALL login(?, @userPassword)";
        $stmt = $this->conn->prepare($login_query);
        $stmt->bind_param("s", $login);

        if (!$stmt->execute()) {
            error_log("Error during login: " . $stmt->error);
            return "Error during login: " . $stmt->error;
        }

        $password_query = "SELECT @userPassword AS password";
        $result = $this->conn->query($password_query);

        if (!$result) {
            error_log("Error during login: " . $this->conn->error);
            return "Error during login: " . $this->conn->error;
        }

        if ($result->num_rows > 0) {
            $row = $result->fetch_assoc();
            $userPassword = $row['password'];
            error_log("Retrieved hashed password from database: " . $userPassword);
            error_log("User provided password: " . $password);

            if (password_verify($password, $userPassword)) {
                return "Login successful.";
            } else {
                error_log("Incorrect password.");
                return "Incorrect password.";
            }
        } else {
            error_log("Error during login: User not found.");
            return "Error during login: User not found.";
        }
    }

    public function signup($login, $password) {
        $login = $this->conn->real_escape_string($login);
        $password = $this->conn->real_escape_string($password);

        if (strlen($login) < 4) {
            error_log("Error: Username is too short.");
            return "The username must contain at least 4 characters.";
        }

        if (strlen($password) < 8) {
            error_log("Error: Password is too short.");
            return "The password must be at least 8 characters.";
        }

        $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

        $insert_user_query = "CALL sign_up(?, ?)";
        $stmt = $this->conn->prepare($insert_user_query);
        $stmt->bind_param("ss", $login, $hashedPassword);

        if (!$stmt->execute()) {
            error_log("Error when executing sign_up request: " . $stmt->error);
            return "Error when executing sign_up request: " . $stmt->error;
        }

        error_log("The user has been successfully registered.");
        return "The user has been successfully registered.";
    }

    public function closeConnection() {
        $this->conn->close();
    }
}
?>