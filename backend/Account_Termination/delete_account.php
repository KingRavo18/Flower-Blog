<?php
require ("../DB_Connection/db_connection.php");
require ("../Session_Maintanance/global_session_check.php");

class Account_Deletion extends Db_Connection{
    private $conn;

    public function __construct(
        private $user_id,
        private $username, 
        private $password
    ){
        $this->conn = parent::conn();
    }

    private function char_decode(): void{
        $this->username = html_entity_decode($this->username, ENT_QUOTES);
        $this->password = html_entity_decode($this->password, ENT_QUOTES);
    }

    private function validate_input(): void{
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
    
    private function verify_account(): void{
        $stmt = $this->conn->prepare("SELECT password from users WHERE username = ?");
        $stmt->execute([$this->username]);
        $user = $stmt->fetch();
        if(!password_verify($this->password, $user->password)){
            throw new Exception("You have entered an incorrect username or password.");
        }
    }

    private function delete_all_data(): void{
        $stmt = $this->conn->prepare("DELETE FROM blog_likes WHERE user_id = ?");
        $stmt->execute([$this->user_id]);

        $stmt = $this->conn->prepare("DELETE FROM comments WHERE user_id = ?");
        $stmt->execute([$this->user_id]);

        $stmt = $this->conn->prepare("DELETE FROM blog_tags WHERE blog_id IN (SELECT id FROM blogs WHERE user_id = ?)");
        $stmt->execute([$this->user_id]);

        $stmt = $this->conn->prepare("DELETE FROM blogs WHERE user_id = ?");
        $stmt->execute([$this->user_id]);
    }

    private function execute_query(): void{
        $stmt = $this->conn->prepare("DELETE from users WHERE username = ? AND id = ?");
        $stmt->execute([$this->username, $this->user_id]);
    }

    public function delete_account(): void{
        try{
            $this->conn->beginTransaction();
            $this->char_decode();
            $this->validate_input();
            $this->verify_account();
            $this->delete_all_data();
            $this->execute_query();
            $this->conn->commit();
            echo json_encode(["query_success" => "The account has been deleted"]);
        }
        catch(PDOException $e){
            $this->conn->rollBack();
            echo json_encode(["query_fail" => "A problem has occured. Please try again later"]);
        }
        catch(Exception $e){
            $this->conn->rollBack();
            echo json_encode(["query_fail" => $e->getMessage()]);
        }
    }
}

$user_id = $_SESSION["id"];
$username = filter_input(INPUT_POST, "username", FILTER_SANITIZE_SPECIAL_CHARS);
$password = filter_input(INPUT_POST, "password", FILTER_SANITIZE_SPECIAL_CHARS);

$delete_account = new Account_Deletion($user_id, $username, $password);
$delete_account->delete_account();