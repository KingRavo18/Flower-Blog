<?php
require ("../../DB_Connection/db_connection.php");
require ("../../Session_Maintanance/global_session_check.php");

class Add_Like_Entry extends Db_Connection{
    public function __construct(
        private $user_id,
        private $blog_id,
        private $is_liked
    ){}

    private function execute_query(){
        $stmt = parent::conn()->prepare("INSERT INTO blog_likes (user_id, blog_id, is_liked) VALUES (?, ?, ?)");
        $stmt->execute([$this->user_id, $this->blog_id, $this->is_liked]);

        $specific_param = $this->is_liked ? "like_count" : "dislike_count";
        $stmt = parent::conn()->prepare("SELECT {$specific_param} FROM blogs WHERE id = ?");
        $stmt->execute([$this->blog_id]);
        $result = $stmt->fetch();
        $like_dislike = $this->is_liked ? $result->like_count : $result->dislike_count;
        $like_dislike++;

        $stmt = parent::conn()->prepare("UPDATE blogs SET {$specific_param} = ? WHERE id = ?");
        $stmt->execute([$like_dislike, $this->blog_id]);
    }

    public function add_like_entry(){
        try{
            $this->execute_query();
            echo json_encode(["query_success" => "The like entry was successfully added."]);
        }
        catch(PDOException $e){
            echo json_encode(["query_fail" => $e->getMessage()]);
        }
    }
}

$user_id = $_SESSION["id"];
$blog_id = $_SESSION["blog_id"];
$is_liked = (boolean)filter_input(INPUT_POST, "is_liked", FILTER_VALIDATE_BOOLEAN);
$add_entry = new Add_Like_Entry($user_id, $blog_id, $is_liked);
$add_entry->add_like_entry();