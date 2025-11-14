<?php
require ("../DB_Connection/db_connection.php");

class Username_Change extends Db_Connection{
    public function __construct(
        private $password, 
        private $new_username
    ){}

    private function validate_inputs(){
        if(empty(trim($this->password))){
            throw new Exception("Please input your current password.");
        }
        if(empty(trim($this->new_username))){
            throw new Exception("Please input your new username.");
        }
        if(trim($this->new_username) === $_SESSION["username"]){
            throw new Exception("The new username cannot be the same as the current one.");
        }
    }

    private function verify_password(){
        $username = $_SESSION["username"];
        $stmt = parent::conn()->prepare("SELECT password FROM users WHERE username = ?");
        $stmt->execute([$username]);
        $user = $stmt->fetch();
        if(!password_verify($this->password, $user->password)){
            throw new Exception("You have entered an incorrect password.");
        }
    }

    private function execute_query(){
        $stmt = parent::conn()->prepare("UPDATE users SET username = ? WHERE username = ?");
        $stmt->execute([$this->new_username, $_SESSION["username"]]);
        $_SESSION["username"] = $this->new_username;
    }

    public function change_username(){
        try{
            $this->validate_inputs();
            $this->verify_password();
            $this->execute_query();
            echo json_encode(["query_success" => "Your username has been changed."]);
        }
        catch(PDOException $e){
            echo json_encode(["query_fail" => "A problem has occured. Please try again later."]);
        }
        catch(Exception $e){
            echo json_encode(["query_fail" => $e->getMessage()]);
        }
    }
} 

$password = filter_input(INPUT_POST, "password", FILTER_SANITIZE_SPECIAL_CHARS);
$new_username = filter_input(INPUT_POST, "new_username", FILTER_SANITIZE_SPECIAL_CHARS);
$change_username = new Username_Change($password, $new_username);
$change_username->change_username();