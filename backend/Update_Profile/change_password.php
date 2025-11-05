<?php
require ("../DB_Connection/db_connection.php");

class Password_Change extends Db_Connection{
    private $current_password;
    private $new_password;

    public function __construct($current_password, $new_password){
        $this->current_password = $current_password;
        $this->new_password = $new_password;
    }

    private function validate_inputs(){

    }

    private function verify_account(){

    }

    private function execute_query(){

    }

    public function change_password(){
        try{
            $this->validate_inputs();
            $this->verify_account();
            $this->execute_query();
            echo json_encode(["query_success" => "Your password has been updated"]);
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