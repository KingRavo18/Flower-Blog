<?php
require ("../DB_Connection/db_connection.php");

class Account_Deletion extends Db_Connection{
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
        $stmt = parent::conn()->prepare("DELETE from users WHERE username = ?");
        $stmt->execute([$this->username]);
    }

    public function delete_account(){
        try{
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

$username = filter_input(INPUT_POST, "username", FILTER_SANITIZE_SPECIAL_CHARS);
$password = filter_input(INPUT_POST, "password", FILTER_SANITIZE_SPECIAL_CHARS);
$delete_account = new Account_Deletion($username, $password);
$delete_account->delete_account();