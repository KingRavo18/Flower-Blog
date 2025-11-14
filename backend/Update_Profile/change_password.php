<?php
require ("../DB_Connection/db_connection.php");

class Password_Change extends Db_Connection{
    public function __construct(
        private $id, 
        private $current_password, 
        private $new_password
    ){}

    private function validate_inputs(){
        if(empty(trim($this->current_password))){
            throw new Exception("Please input your current password.");
        }
        if(empty(trim($this->new_password))){
            throw new Exception("Please input your new password.");
        }
        if(strlen($this->new_password) < 8){
            throw new Exception("A password must contain at least 8 characters.");
        }
        if(!preg_match("/[a-z]/", $this->new_password)){
            throw new Exception("A password must contain a non-capital letter.");
        }
        if(!preg_match("/[A-Z]/", $this->new_password)){
            throw new Exception("A password must contain a capital letter.");
        }
        if(!preg_match("/[0-9]/", $this->new_password)){
            throw new Exception("A password must contain a number.");
        }
        if(!preg_match("/[\'^£$%&*()}{@#~?><>,|=_+¬-]/", $this->new_password)){
            throw new Exception("A password must contain a special character.");
        }
        if(trim($this->current_password) === trim($this->new_password)){
            throw new Exception("Both input fields cannot contain the same password.");
        }
    }

    private function verify_password(){
        $stmt = parent::conn()->prepare("SELECT password FROM users WHERE id = ?");
        $stmt->execute([$this->id]);
        $user = $stmt->fetch();
        if(!password_verify($this->current_password, $user->password)){
            throw new Exception("You have entered an incorrect password.");
        }
    }

    private function execute_query(){
        $new_password_hash = password_hash($this->new_password, PASSWORD_DEFAULT);
        $stmt = parent::conn()->prepare("UPDATE users SET password = ? WHERE username = ?");
        $stmt->execute([$new_password_hash, $_SESSION["username"]]);
    }

    public function change_password(){
        try{
            $this->validate_inputs();
            $this->verify_password();
            $this->execute_query();
            echo json_encode(["query_success" => "Your password has been changed."]);
        }
        catch(PDOException $e){
            echo json_encode(["query_fail" => "A problem has occured. Please try again later."]);
        }
        catch(Exception $e){
            echo json_encode(["query_fail" => $e->getMessage()]);
        }
    }
}

$id = $_SESSION["id"];
$current_password = filter_input(INPUT_POST, "current_password", FILTER_SANITIZE_SPECIAL_CHARS);
$new_password = filter_input(INPUT_POST, "new_password", FILTER_SANITIZE_SPECIAL_CHARS);
$change_password = new Password_Change($id, $current_password, $new_password);
$change_password->change_password();