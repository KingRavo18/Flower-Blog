<?php
require ("../DB_Connection/db_connection.php");

class Account_Deletion extends DbConnection{
    private $username;
    private $password;

    public function __construct($username, $password){
        $this->username = $username;
        $this->password = $password;
    }

    private function validate_input(){

    }

    private function verify_account(){

    }

    private function execute_query(){

    }

    public function delete_account(){
        try{
            
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
$delete_account = new Account_Deletion($username, $password);
$delete_account->delete_account();