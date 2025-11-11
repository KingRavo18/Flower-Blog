<?php
require ("../DB_Connection/db_connection.php");

class Signin_User extends Db_Connection{
    private $username;
    private $password;

    public function __construct($username, $password){
        $this->username = $username;
        $this->password = $password;
    }

    private function validate_input(){
        if(empty(trim($this->username))){
            throw new Exception("Please input a username.");
        }
        if(empty(trim($this->password))){
            throw new Exception("Please input a password.");
        }
    }

    private function execute_query(){
        $stmt = parent::conn()->prepare("SELECT id, password FROM users WHERE username = :username");
        $stmt->execute(["username" => $this->username]);
        $user = $stmt->fetch();
        if(!$user || !password_verify($this->password, $user->password)){
            throw new Exception("You have entered and incorrect username or password.");
        }
        $_SESSION["id"] = $user->id;
        $_SESSION["username"] = $this->username;
        $stmt = null;
    }

    public function sign_in_user(){
        try{
            $this->validate_input();
            $this->execute_query();
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
$signin = new Signin_User($username, $password);
$signin->sign_in_user();