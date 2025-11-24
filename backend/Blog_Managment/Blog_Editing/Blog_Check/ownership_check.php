<?php 
require("../../../DB_Connection/db_connection.php");
require ("../../../Session_Maintanance/global_session_check.php");

class Ownership_Check extends Db_Connection{
    public function __construct(
        private $user_id,
        private $blog_id
    ){}

    private function execute_query(): void{
        $stmt = parent::conn()->prepare("SELECT user_id FROM blogs WHERE id = ?");
        $stmt->execute([$this->blog_id]);
        $result = $stmt->fetch();
        if($result->user_id !== $this->user_id){
            throw new Exception("The user does not own this blog.");
        }
    }   

    public function check_ownership(): void{
        try{
            $this->execute_query();
            echo json_encode(["query_success" => "Your blog has been updated."]);
        }
        catch(PDOException $e){
            echo json_encode(["query_fail" => "A problem has occured. Please try again later."]);
        }
        catch(Exception $e){
            echo json_encode(["fatal_fail" => $e->getMessage()]);
        }
    }
}

$user_id = $_SESSION["id"];
$blog_id = $_SESSION["blog_id"];
$ownership_check = new Ownership_Check($user_id, $blog_id);
$ownership_check->check_ownership();