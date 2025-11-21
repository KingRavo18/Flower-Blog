<?php
require ("../DB_Connection/db_connection.php");
require ("../Session_Maintanance/global_session_check.php");

class Personal_Blog_Retrieve extends Db_Connection{
    public function __construct(private $user_id){}

    private function execute_query(){
        $stmt = parent::conn()->prepare("SELECT id, title, description, contents FROM blogs WHERE user_id = ?");
        $stmt->execute([$this->user_id]);
        $query_success = "Your blogs were retrieved successfully.";
        if($stmt->rowCount() === 0){
            echo json_encode([
                "row_count" => $stmt->rowCount(),
                "query_success" => $query_success
            ]);
            exit;
        }
        $blogs = $stmt->fetchAll();
        echo json_encode([
            "row_count" => $stmt->rowCount(),
            "blogs" => $blogs,
            "query_success" => $query_success
        ]);
    }
    
    public function retrieve_blogs(){
        try{
            $this->execute_query();
        }
        catch(PDOException $e){
            echo json_encode(["query_fail" => "A problem has occured, could not retrieve your blogs."]);
        }
    }
}

$user_id = $_SESSION["id"];
$retrieve_blogs = new Personal_Blog_Retrieve($user_id);
$retrieve_blogs->retrieve_blogs();