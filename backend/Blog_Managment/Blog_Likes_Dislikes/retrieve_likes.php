<?php
require ("../../DB_Connection/db_connection.php");
require ("../../Session_Maintanance/global_session_check.php");

class Like_Dislike_Retrieval extends Db_Connection{
    public function __construct(
        private $user_id,
        private $blog_id
    ){}

    private function execute_query(){
        $stmt = parent::conn()->prepare("SELECT like_count, dislike_count FROM blogs WHERE id = ?");
        $stmt->execute([$this->blog_id]);
        $count = $stmt->fetch();

        $returnable_json = [
            "likes" => $count->like_count,
            "dislikes" => $count->dislike_count,
            "query_success" => "The like entry was successfully added."
        ];

        $stmt = parent::conn()->prepare("SELECT is_liked FROM blog_likes WHERE user_id = ? AND blog_id = ?");
        $stmt->execute([$this->user_id, $this->blog_id]);
        $like_response = $stmt->fetch();

        if(!empty($like_response)){
            $returnable_json["is_liked"] = $like_response->is_liked ? "like" : "dislike";
        }

        echo json_encode($returnable_json);
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

$user_id = $_SESSION["id"];
$blog_id = $_SESSION["blog_id"];
$retrieve_blogs = new Like_Dislike_Retrieval($user_id, $blog_id);
$retrieve_blogs->retrieve_likes();