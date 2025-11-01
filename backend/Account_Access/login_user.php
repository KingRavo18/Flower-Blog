<?php
require ("../DB_Connection/db_connection.php");

class SigninUser extends DbConnection{
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
    }

    private function executeQuery(){
        $stmt = parent::conn()->prepare("SELECT id, password FROM users WHERE username = :username");
        $stmt->execute(["username" => $this->username]);
        $user = $stmt->fetch();
        if(!$user || !password_verify($this->password, $user->password)){
            throw new Exception("You have entered and incorrect username or password.");
        }
        $_SESSION["id"] = $user->id;
        $_SESSION["username"] = $this->username;
        $_SESSION["password"] = $user->password;
        $stmt = null;
    }

    public function signinUser(){
        try{
            $this->validateInput();
            $this->executeQuery();
            echo json_encode(["query_success" => "You have successfully signed in."]);
        }
        catch(PDOException $e){
            echo json_encode(["query_fail" => "A problem has occured. Please try again later."]);
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
$signin = new SigninUser($username, $password);
$signin->signinUser();