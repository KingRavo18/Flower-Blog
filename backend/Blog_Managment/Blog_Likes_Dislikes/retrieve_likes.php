<?php
require ("../../DB_Connection/db_connection.php");
require ("../../Session_Maintanance/global_session_check.php");

class Like_Dislike_Retrieval extends Db_Connection{
    public function __construct(private $blog_id){}

    private function execute_query(){
        $stmt = parent::conn()->prepare("SELECT like_count, dislike_count FROM blogs WHERE id = ?");
        $stmt->execute([$this->blog_id]);
        $count = $stmt->fetch();
        echo json_encode([
            "likes" => $count->like_count,
            "dislikes" => $count->dislike_count,
            "query_success" => "The like entry was successfully added."
        ]);
    }

    public function retrieve_likes(){
        try{
            $this->execute_query();
        }
        catch(PDOException $e){
            echo json_encode(["query_fail" => $e->getMessage()]);
        }
    }
}

$blog_id = $_SESSION["blog_id"];
$retrieve_blogs = new Like_Dislike_Retrieval($blog_id);
$retrieve_blogs->retrieve_likes();