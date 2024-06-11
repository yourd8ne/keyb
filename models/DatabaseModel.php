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

    public function getCode($language) {
        $language = $this->conn->real_escape_string($language);
        $sql = "CALL getCode('$language')";

        $result = $this->conn->query($sql);
        //error_log($result-);
        if ($result && $result->num_rows > 0) {
            $row = $result->fetch_assoc();
            if (isset($row['json_result'])) {
                return $row['json_result'];
            } else {
                //error_log($language);
                return 'Text not found';
            }
        } else {
            return 'Language not found';
        }
    }

    public function SaveSessionData($attemptTime, $username, $selectLang, $timeSpent, $speed) {
        $attemptTime = $this->conn->real_escape_string($attemptTime);
        $username = $this->conn->real_escape_string($username);
        $selectLang = $this->conn->real_escape_string($selectLang);
        $timeSpent = $this->conn->real_escape_string($timeSpent);
        $speed = $this->conn->real_escape_string($speed);

        $sql = "CALL saveSessionData('$attemptTime', '$username', '$selectLang', '$timeSpent', '$speed')";
        
        $this->conn->query($sql);
    }

    public function login($login, $password) {
        // Экранирование входных данных
        $login = $this->conn->real_escape_string($login);
        $password = $this->conn->real_escape_string($password);
    
        // Выполнение хранимой процедуры login
        $login_query = "CALL login('$login', @userPassword)";
        $result = $this->conn->query($login_query);
    
        if (!$result) {
            error_log("Ошибка при входе: " . $this->conn->error);
            return "Ошибка при входе: " . $this->conn->error;
        }
    
        // Закрываем результат запроса и переходим к следующему результату
        if ($result instanceof mysqli_result) {
            $result->close();
        }
        while ($this->conn->more_results() && $this->conn->next_result()) {
            if ($l_result = $this->conn->store_result()) {
                $l_result->free();
            }
        }
    
        // Получаем значение OUT параметра
        $password_query = "SELECT @userPassword AS password";
        $result = $this->conn->query($password_query);
    
        if (!$result) {
            error_log("Ошибка при входе: " . $this->conn->error);
            return "Ошибка при входе: " . $this->conn->error;
        }
    
        if ($result->num_rows > 0) {
            $row = $result->fetch_assoc();
            $userPassword = $row['password'];
            if (password_verify($password, $userPassword)) {
                error_log("Успешный вход.");
                return "Успешный вход.";
            } else {
                error_log("Неверный пароль.");
                return "Неверный пароль.";
            }
        } else {
            error_log("Ошибка при входе: пользователь не найден.");
            return "Ошибка при входе: пользователь не найден.";
        }
    }    

    public function signup($login, $password) {
        $login = $this->conn->real_escape_string($login);
        $password = $this->conn->real_escape_string($password);
    
        if (strlen($login) < 4) {
            error_log("Error: name too short.");
            return "The username must contain at least 4 characters.";
        }

        if (strlen($password) < 8) {
            error_log("Error: Password is too short.");
            return "The password must be at least 8 characters.";
        }

        // Проверяем наличие пользователя с таким логином
        $check_user_query = "CALL check_user('$login')";
        $check_user_result = $this->conn->query($check_user_query);

        if (!$check_user_result) {
            error_log("User verification error: " . $this->conn->error);
            return "User verification error: " . $this->conn->error;
        }

        // Добавляем логирование количества строк, возвращенных запросом
        error_log("Number of rows returned by check_user: " . $check_user_result->num_rows);

        if ($check_user_result->num_rows > 0) {
            error_log("User verification error: A user with the same name already exists.");
            $check_user_result->close(); // Закрытие результата запроса
            $this->conn->next_result();  // Переход к следующему результату
            return "A user with the same name already exists.";
        }

        $check_user_result->close(); // Закрытие результата запроса
        $this->conn->next_result();  // Переход к следующему результату

        // Если пользователя с таким логином нет, регистрируем нового пользователя
        $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
        $insert_user_query = "CALL sign_up('$login', '$hashedPassword')";

        $result = $this->conn->query($insert_user_query);

        if (!$result) {
            error_log("Error when executing sign_up request: " . $this->conn->error);
            return "Error when executing sign_up request: " . $this->conn->error;
        } else {
            error_log("The user has been successfully registered.");
            return "The user has been successfully registered.";
        }
    }
      

    public function closeConnection() {
        $this->conn->close();
    }
}
?>
