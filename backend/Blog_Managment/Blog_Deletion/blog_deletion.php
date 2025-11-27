<?php
require ("../../DB_Connection/db_connection.php");
require ("../../Session_Maintanance/global_session_check.php");

class Blog_Deletion extends Db_Connection{
    private $conn;

    public function __construct(
        private $blog_id, 
        private $user_id
    ){
        $this->conn = parent::conn();
    }

    private function execute_like_deletion(): void{
        $stmt = $this->conn->prepare("DELETE FROM blog_likes WHERE blog_id = ?");
        $stmt->execute([$this->blog_id]);
    }

    private function execute_comment_deletion(): void{
        $stmt = $this->conn->prepare("DELETE FROM comments WHERE blog_id = ?");
        $stmt->execute([$this->blog_id]);
    }

    private function execute_tag_deletion(): void{
        $stmt = $this->conn->prepare("DELETE FROM blog_tags WHERE blog_id = ?");
        $stmt->execute([$this->blog_id]);
    }

    private function execute_blog_deletion(): void{
        $stmt = $this->conn->prepare("DELETE FROM blogs WHERE id = ? AND user_id = ?");
        $stmt->execute([$this->blog_id, $this->user_id]);
        $blog_count = $stmt->rowCount();
        if($blog_count === 0){
            throw new Exception("Unauthorised deletion attempt.");
        }
    }

    public function delete_blog(): void{
        try{
            $this->conn->beginTransaction();
            $this->execute_like_deletion();
            $this->execute_comment_deletion();
            $this->execute_tag_deletion();
            $this->execute_blog_deletion();
            $this->conn->commit();
            echo json_encode(["query_success" => "The blog was succesfully deleted."]);
        }
        catch(PDOException $e){
            $this->conn->rollBack();
            echo json_encode(["query_fail" => "A problem has occured, please try again later."]);
        }
        catch(Exception $e){
            $this->conn->rollBack();
            echo json_encode(["fatal_fail" => $e->getMessage()]);
        }
    } 
}

$user_id = $_SESSION["id"];
$blog_id = filter_input(INPUT_POST, "blog_id", FILTER_SANITIZE_NUMBER_INT);
$blog_deletion = new Blog_Deletion($blog_id, $user_id);
$blog_deletion->delete_blog();