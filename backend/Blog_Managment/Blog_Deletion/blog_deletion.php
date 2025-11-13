<?php
require("../../DB_Connection/db_connection.php");

class Blog_Deletion extends Db_Connection{
    private $blog_id;
    private $user_id;

    public function __construct($blog_id, $user_id){
        $this->blog_id = $blog_id;
        $this->user_id = $user_id;
    }

    private function execute_tag_deletion(){
        $stmt = parent::conn()->prepare("DELETE FROM blog_tags WHERE blog_id = ?");
        $stmt->execute([$this->blog_id]);
        $stmt = null;
    }

    private function execute_blog_deletion(){
        $stmt = parent::conn()->prepare("DELETE FROM blogs WHERE id = ? AND user_id = ?");
        $stmt->execute([$this->blog_id, $this->user_id]);
        $stmt = null;
    }

    public function delete_blog(){
        try{
            $this->execute_tag_deletion();
            $this->execute_blog_deletion();
            echo json_encode(["query_success" => "The blog was succesfully deleted."]);
        }
        catch(PDOException $e){
            echo json_encode(["query_fail" => $e->getMessage()]);
        }
    } 
}

$user_id = $_SESSION["id"];
$blog_id = filter_input(INPUT_POST, "blog_id", FILTER_SANITIZE_SPECIAL_CHARS);
$blog_deletion = new Blog_Deletion($blog_id, $user_id);
$blog_deletion->delete_blog();