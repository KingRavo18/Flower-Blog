<?php
require ("../DB_Connection/db_connection.php");
require ("../Session_Maintanance/global_session_check.php");

class Username_Change extends Db_Connection{
    public function __construct(
        private $user_id,
        private $password, 
        private $new_username
    ){}

    private function char_decode(){
        $this->password = html_entity_decode($this->password, ENT_QUOTES);
        $this->new_username = html_entity_decode($this->new_username, ENT_QUOTES);
    }

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
        $stmt = parent::conn()->prepare("SELECT password FROM users WHERE id = ?");
        $stmt->execute([$this->user_id]);
        $user = $stmt->fetch();
        if(!password_verify($this->password, $user->password)){
            throw new Exception("You have entered an incorrect password.");
        }
    }

    private function check_username_existance(){
        $stmt = parent::conn()->prepare("SELECT username FROM users WHERE username = ?");
        $stmt->execute([$this->new_username]);
        $user_count = $stmt->rowCount();
        if($user_count > 0){
            throw new Exception("This username has already been taken");
        }
    }

    private function execute_query(){
        $stmt = parent::conn()->prepare("UPDATE users SET username = ? WHERE id = ?");
        $stmt->execute([$this->new_username, $this->user_id]);
        $_SESSION["username"] = $this->new_username;
    }

    public function change_username(){
        try{
            $this->char_decode();
            $this->validate_inputs();
            $this->verify_password();
            $this->check_username_existance();
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

$user_id = $_SESSION["id"];
$password = filter_input(INPUT_POST, "password", FILTER_SANITIZE_SPECIAL_CHARS);
$new_username = filter_input(INPUT_POST, "new_username", FILTER_SANITIZE_SPECIAL_CHARS);
$change_username = new Username_Change($user_id, $password, $new_username);
$change_username->change_username();