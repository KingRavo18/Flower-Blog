<?php
require ("../DB_Connection/db_connection.php");
require ("../Session_Maintanance/global_session_check.php");

class Account_Deletion extends Db_Connection{
    public function __construct(
        private $user_id,
        private $username, 
        private $password
    ){}

    private function char_decode(){
        $this->username = html_entity_decode($this->username, ENT_QUOTES);
        $this->password = html_entity_decode($this->password, ENT_QUOTES);
    }

    private function validate_input(){
        if(empty(trim($this->username))){
            throw new Exception("Please input a username.");
        }
        if(empty(trim($this->password))){
            throw new Exception("Please input a password.");
        }
        if($this->username !== $_SESSION["username"]){
            throw new Exception("You have entered an incorrect username or password.");
        }
    }
    
    private function verify_account(){
        $stmt = parent::conn()->prepare("SELECT password from users WHERE username = ?");
        $stmt->execute([$this->username]);
        $user = $stmt->fetch();
        if(!password_verify($this->password, $user->password)){
            throw new Exception("You have entered an incorrect username or password.");
        }
    }

    private function execute_query(){
        $stmt = parent::conn()->prepare("DELETE from users WHERE username = ? AND id = ?");
        $stmt->execute([$this->username, $this->user_id]);
    }

    public function delete_account(){
        try{
            $this->char_decode();
            $this->validate_input();
            $this->verify_account();
            $this->execute_query();
            echo json_encode(["query_success" => "The account has been deleted"]);
        }
        catch(PDOException $e){
            echo json_encode(["query_fail" => "A problem has occured. Please try again later"]);
        }
        catch(Exception $e){
            echo json_encode(["query_fail" => $e->getMessage()]);
        }
    }
}

$user_id = $_SESSION["id"];
$username = filter_input(INPUT_POST, "username", FILTER_SANITIZE_SPECIAL_CHARS);
$password = filter_input(INPUT_POST, "password", FILTER_SANITIZE_SPECIAL_CHARS);
$delete_account = new Account_Deletion($user_id, $username, $password);
$delete_account->delete_account();