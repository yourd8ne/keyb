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

    public function getLanguage() {
        $sql = "CALL getLang()";

        $res = $this->conn->query($sql);

        if ($res && $res->num_rows > 0) {
            $languages = [];
            while ($row = $res->fetch_assoc()) {
                $languages[] = $row['Name'];
            }
            return $languages;
        } else {
            return [];
        }
    }

    public function getCode($dictionaryName) {
        $dictionaryName = $this->conn->real_escape_string($dictionaryName);
        $sql = "CALL getCode('$dictionaryName')";
        
        $result = $this->conn->query($sql);
        
        if ($result && $result->num_rows > 0) {
            $row = $result->fetch_assoc();
            if (isset($row['Code']) && isset($row['HighliteName'])) {
                return ['HighliteName' => $row['HighliteName'], 'Code' => $row['Code']];
            } else {
                return null; // Возвращаем null, если данные не найдены
            }
        } else {
            return null;     
        }
    }
    // public function getAttempts() {
    //     $sql = 'CALL getAttempts();';
    //     $result = $this->conn->query($sql);
    //     if ($result && $result->num_rows > 0) {
    //         $row = $result->fetch_assoc();
            
    //     }
    // }

    public function saveSessionData($attemptTime, $username, $selectLang, $timeSpent, $speed) {
        $stmt = $this->conn->prepare("CALL saveSessionData(?, ?, ?, ?, ?)");
    
        if (!$stmt) {
            throw new Exception("Не удалось подготовить запрос: " . $this->conn->error);
        }
    
        $stmt->bind_param("ssssd", $attemptTime, $username, $selectLang, $timeSpent, $speed);
    
        if (!$stmt->execute()) {
            throw new Exception("Ошибка выполнения запроса: " . $stmt->error);
        }
    
        $stmt->close();
    }    

    public function login($login, $password) {
        // to-do: user not exist
        $login = $this->conn->real_escape_string($login);
        $password = $this->conn->real_escape_string($password);
    
        $login_query = "CALL login('$login', @userPassword)";
        $result = $this->conn->query($login_query);
    
        if (!$result) {
            error_log("Error during login: " . $this->conn->error);
            return "Error during login: " . $this->conn->error;
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
    
        $insert_user_query = "CALL sign_up('$login', '$hashedPassword')";
        $result = $this->conn->query($insert_user_query);
    
        if (!$result) {
            error_log("Error when executing sign_up request: " . $this->conn->error);
            return "Error when executing sign_up request: " . $this->conn->error;
        }
    
        error_log("The user has been successfully registered.");
        return "The user has been successfully registered.";
    }    

    public function closeConnection() {
        $this->conn->close();
    }
}
?>
