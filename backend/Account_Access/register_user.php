<?php
require("../DB_Connection/db_connection.php");

class RegisterUser extends Db_Connection{
    private $username;
    private $password;

    public function __construct($username, $password){
        $this->username = $username;
        $this->password = $password;
    }

    private function validateInput(){
        if(empty(trim($this->username))){
            throw new Exception("Please input a username.");
        }
        if(empty(trim($this->password))){
            throw new Exception("Please input a password.");
        }
        if(strlen($this->password) < 8){
            throw new Exception("A password must contain at least 8 characters.");
        }
        if(!preg_match("/[a-z]/", $this->password)){
            throw new Exception("A password must contain a non-capital letter.");
        }
        if(!preg_match("/[A-Z]/", $this->password)){
            throw new Exception("A password must contain a capital letter.");
        }
        if(!preg_match("/[0-9]/", $this->password)){
            throw new Exception("A password must contain a number.");
        }
        if(!preg_match("/[\'^£$%&*()}{@#~?><>,|=_+¬-]/", $this->password)){
            throw new Exception("A password must contain a special character.");
        }
    }

    private function checkUsernameExistance(){
        $stmt = parent::conn()->prepare("SELECT username FROM users WHERE username = ?");
        $stmt->execute([$this->username]);
        $user_count = $stmt->rowCount();
        if($user_count > 0){
            throw new Exception("This username has already been taken");
        }
        $stmt = null;
    }

    private function executeQuery(){
        $password_hash = password_hash($this->password, PASSWORD_DEFAULT);
        $stmt = parent::conn()->prepare("INSERT INTO users (username, password) VALUES (:username, :password)");
        $stmt->execute(["username" => $this->username, "password" => $password_hash]);
        $stmt = null;
    }

    public function registerUser(){
        try{
            $this->validateInput();
            $this->checkUsernameExistance();
            $this->executeQuery();
            echo json_encode(["query_success" => "Registration was successful"]);
            session_destroy();
        }
        catch(PDOException $e){
            echo json_encode(["query_fail" => "A problem has occured. Please try again later"]);
            session_destroy();
        }
        catch(Exception $e){
            echo json_encode(["query_fail" => $e->getMessage()]);
            session_destroy();
        }
    }
}

$username = filter_input(INPUT_POST, "username", FILTER_SANITIZE_SPECIAL_CHARS);
$password = filter_input(INPUT_POST, "password", FILTER_SANITIZE_SPECIAL_CHARS);
$register_user = new RegisterUser($username, $password);
$register_user->registerUser();