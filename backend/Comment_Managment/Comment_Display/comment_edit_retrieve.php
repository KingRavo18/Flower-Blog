<?php 
require ("../../DB_Connection/db_connection.php");
require ("../../Session_Maintanance/global_session_check.php");

class Comment_Edit_Retrieval extends Db_Connection{
    public function __construct(
        private $user_id,
        private $comment_id
    ){}

    private function execute_query(){
        $stmt = parent::conn()->prepare("SELECT comment FROM comments WHERE user_id = ? AND id = ?");
        $stmt->execute([$this->user_id, $this->comment_id]);
        $comment = $stmt->fetch();
        if(empty($comment)){
            throw new Exception("Unauthorised edit attempt.");
        }
        return [
            "comment" => $comment->comment,
            "query_success" => "The comment was retrieved successfully."
        ];
    }

    public function retrieve_comment_editable_content(): void{
        try{
            $json_return = $this->execute_query();
            echo json_encode($json_return);
        }
        catch(PDOException $e){
            echo json_encode(["query_fail" => "Failed to load comments for this blog."]);
        }
    }
}

$user_id = $_SESSION["id"];
$comment_id = filter_input(INPUT_POST, "comment_id", FILTER_SANITIZE_NUMBER_INT);
$comment_retrieval = new Comment_Edit_Retrieval($user_id, $comment_id);
$comment_retrieval->retrieve_comment_editable_content();