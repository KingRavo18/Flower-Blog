<?php
require ("../DB_Connection/db_connection.php");
require ("../Session_Maintanance/global_session_check.php");

class Blog_Tag_Retrieval extends Db_Connection{
    public function __construct(private $blog_id){}

    private function execute_query(){
        $stmt = parent::conn()->prepare("SELECT tag FROM blog_tags WHERE blog_id = ?");
        $stmt->execute([$this->blog_id]);
        $query_success = "The tags were retrieved successfully.";
        if($stmt->rowCount() === 0){
            echo json_encode([
                "row_count" => $stmt->rowCount(),
                "query_success" => $query_success
            ]);
            exit;
        }
        $tags = $stmt->fetchAll();
        echo json_encode([
            "row_count" => $stmt->rowCount(),
            "tags" => $tags,
            "query_success" => $query_success
        ]);
    }

    public function retrieve_tags(){
        try{
            $this->execute_query();
        }
        catch(PDOException $e){
            echo json_encode(["query_fail" => "Failed to load tags for this blog."]);
        }
    }
}

$blog_id = $_SESSION["blog_id"];
$tag_retrieval = new Blog_Tag_Retrieval($blog_id);
$tag_retrieval->retrieve_tags();