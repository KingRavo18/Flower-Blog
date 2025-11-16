<?php 
require ("../../DB_Connection/db_connection.php");
require ("../../Session_Maintanance/global_session_check.php");

class Comment_Retrieval extends Db_Connection{
    public function __construct(private $blog_id){}

    private function execute_query(){
        $stmt = parent::conn()->prepare("SELECT * FROM comments WHERE blog_id = ?");
        $stmt->execute([$this->blog_id]);
        $query_success = "The comments were retrieved successfully.";
        if($stmt->rowCount() === 0){
            echo json_encode([
                "row_count" => $stmt->rowCount(),
                "query_success" => $query_success
            ]);
            exit;
        }
        $comments = $stmt->fetchAll();
        echo json_encode([
            "row_count" => $stmt->rowCount(),
            "comments" => $comments,
            "query_success" => $query_success
        ]);
    }

    public function retrieve_comments(){
        try{
            $this->execute_query();
        }
        catch(PDOException $e){
            echo json_encode(["query_fail" => "Failed to load comments for this blog."]);
        }
    }
}

$blog_id = $_SESSION["blog_id"];
$comment_retrieval = new Comment_Retrieval($blog_id);
$comment_retrieval->retrieve_comments();