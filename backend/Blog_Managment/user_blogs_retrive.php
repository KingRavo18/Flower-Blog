<?php
require("../DB_Connection/db_connection.php");

class Personal_Blog_Retrieve extends Db_Connection{
    private $user_id;

    public function __construct($user_id){
        $this->user_id = $user_id;
    }

    private function execute_query(){
        $stmt = parent::conn()->prepare("SELECT * FROM blogs WHERE user_id = ?");
        $stmt->execute([$this->user_id]);
        $count = $stmt->rowCount();
        $query_success = "Your blogs were retrieved successfully.";
        if($count > 0){
            $blogs = $stmt->fetchAll();
            echo json_encode([
                "row_count" => $count,
                "blogs" => $blogs,
                "query_success" => $query_success
            ]);
        }
        else{
            echo json_encode([
                "row_count" => $count,
                "query_success" => $query_success
            ]);
        }
        $stmt = null;
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