<?php
require ("../../DB_Connection/db_connection.php");
require ("../../Session_Maintanance/global_session_check.php");

class Comment_Deletion extends Db_Connection{
    public function __construct(
        private $comment_id,
        private $user_id
    ){}

    private function execute_query(): void{
        $stmt = parent::conn()->prepare("DELETE FROM comments WHERE id = ? AND user_id = ?");
        $stmt->execute([$this->comment_id, $this->user_id]);
        $blog_count = $stmt->rowCount();
        if($blog_count === 0){
            throw new Exception("Unauthorised deletion attempt.");
        }
    }

    public function delete_comment(): void{
        try{
            $this->execute_query();
            echo json_encode(["query_success" => "The comment was succesfully deleted."]);
        }
        catch(PDOException $e){
            echo json_encode(["query_fail" => "A problem has occured, please try again later."]);
        }
        catch(Exception $e){
            echo json_encode(["fatal_fail" => $e->getMessage()]);
        }
    }
}

$comment_id = filter_input(INPUT_POST, "comment_id", FILTER_SANITIZE_NUMBER_INT);
$user_id = $_SESSION["id"];
$delete_comment = new Comment_Deletion($comment_id, $user_id);
$delete_comment->delete_comment();