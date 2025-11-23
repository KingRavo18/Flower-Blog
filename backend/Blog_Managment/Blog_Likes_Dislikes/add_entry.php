<?php
require ("../../DB_Connection/db_connection.php");
require ("../../Session_Maintanance/global_session_check.php");

class Add_Like_Entry extends Db_Connection{
    public function __construct(
        private $user_id,
        private $blog_id,
        private $is_liked
    ){}

    private function change_count($type){
        $specific_param = $this->is_liked ? "like_count" : "dislike_count";
        $stmt = parent::conn()->prepare("SELECT {$specific_param} FROM blogs WHERE id = ?");
        $stmt->execute([$this->blog_id]);
        $result = $stmt->fetch();
        $like_dislike = $this->is_liked ? $result->like_count : $result->dislike_count;
        if($type === "add"){
            $like_dislike++;
        }
        else if($like_dislike > 0){
            $like_dislike--;
        }
        $stmt = parent::conn()->prepare("UPDATE blogs SET {$specific_param} = ? WHERE id = ?");
        $stmt->execute([$like_dislike, $this->blog_id]);
    }

    private function new_entry_query(){
        $stmt = parent::conn()->prepare("INSERT INTO blog_likes (user_id, blog_id, is_liked) VALUES (?, ?, ?)");
        $stmt->execute([$this->user_id, $this->blog_id, $this->is_liked]);
        $this->change_count("add");
    }

    private function remove_entry_query(){
        $stmt = parent::conn()->prepare("DELETE FROM blog_likes WHERE user_id = ? AND blog_id = ?");
        $stmt->execute([$this->user_id, $this->blog_id]);
        $this->change_count("subtract");
    }

    private function verify_like_history(){
        $stmt = parent::conn()->prepare("SELECT * FROM blog_likes WHERE user_id = ? AND blog_id = ?");
        $stmt->execute([$this->user_id, $this->blog_id]);
        $result = $stmt->fetch();
        if(empty($result)){
            $this->new_entry_query();
        }
        else if(!empty($result) && $result->is_liked === (int)$this->is_liked){
            $this->remove_entry_query();
        }
        else{
            $this->remove_entry_query();
            $this->new_entry_query();
        }
    }

    public function add_like_entry(){
        try{
            $this->verify_like_history();
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