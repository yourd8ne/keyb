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

    public function getUserStats($userId) {
        try {
            $stmt = $this->conn->prepare("CALL GetUserStats(?)");
            $stmt->bind_param("i", $userId);
            $stmt->execute();
            
            $result = $stmt->get_result();
            
            if ($result && $result->num_rows > 0) {
                return $result->fetch_assoc();
            } else {
                return ['error' => 'No data available for this user'];
            }
        } catch (Exception $e) {
            error_log('Error getting user stats: ' . $e->getMessage());
            return ['error' => $e->getMessage()];
        }
    }

    public function getDictionariesInfo() {
        $sql = "CALL getDictionariesInfo()";

        $res = $this->conn->query($sql);

        if ($res && $res->num_rows > 0) {
            $array = [];
            while ($row = $res->fetch_assoc()) {
                $array[] = [
                    'Name' => $row['Name']
                ];
            }
            return $array;
        } else {
            return [];
        }
    }

    public function getDictionaryIdByName($selectedDict) {
        $stmt = $this->conn->prepare("CALL GetDictionaryIdByName(?)");
        $stmt->bind_param("s", $selectedDict);
        $stmt->execute();

        $result = $stmt->get_result();
        $row = $result->fetch_assoc();
        return $row ? $row['idDictionary'] : null;
    }

    public function getCodes($dictionaryName) {
        $stmt = $this->conn->prepare("CALL getCodes(?)");
        $stmt->bind_param("s", $dictionaryName);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result && $result->num_rows > 0) {
            $array = [];
            while ($row = $result->fetch_assoc()) {
                $array[] = [
                    'HighlightName' => $row['HighlightName'],
                    'Code' => $row['Code'],
                    'idCode' => $row['idCode']
                ];
            }
            return $array;
        } else {
            return [];
        }
    }    

    public function getAttempts() {
        $query = "CALL GetAttempts()";
        $result = $this->conn->query($query);

        if (!$result) {
            throw new Exception("Ошибка выполнения запроса: " . $this->conn->error);
        }

        return $result;
    }

    public function saveSessionData($attemptTime, $username, $selectedDict, $timeSpent, $speed, $userNumberOfCharacters, $userNumberOfSnippets, $dirtinessIndex, $backspaceCount) {
    
        $stmt = $this->conn->prepare("CALL saveSessionData(?, ?, ?, ?, ?, ?, ?, ?, ?)");
        
        if (!$stmt) {
            throw new Exception("Не удалось подготовить запрос: " . $this->conn->error);
        }
        
        $stmt->bind_param(
            "sssddiidd", 
            $attemptTime, 
            $username, 
            $selectedDict, 
            $timeSpent, 
            $speed, 
            $userNumberOfCharacters, 
            $userNumberOfSnippets,
            $dirtinessIndex,
            $backspaceCount
        );
        
        if (!$stmt->execute()) {
            throw new Exception("Ошибка выполнения запроса: " . $stmt->error);
        }
        
        $stmt = $this->conn->prepare("SELECT LAST_INSERT_ID()");
        $stmt->execute();
        $stmt->bind_result($idAttempts);
        $stmt->fetch();
        $stmt->close();
        
        return $idAttempts;
    }
    
    public function saveCodeForSession($idAttempts, $dictId, $idCodes) {
        $stmt = $this->conn->prepare("CALL saveCodeForSession(?, ?, ?)");
        
        if (!$stmt) {
            throw new Exception("Не удалось подготовить запрос: " . $this->conn->error);
        }
        
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