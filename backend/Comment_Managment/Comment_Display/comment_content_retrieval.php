<?php 
require ("../../DB_Connection/db_connection.php");
require ("../../Session_Maintanance/global_session_check.php");

class Comment_Content_Retrieval extends Db_Connection{
    public function __construct(private $comment_id, private $blog_id){}

    private function execute_query(): array{
        $stmt = parent::conn()->prepare("SELECT user_id, comment, creation_date FROM comments WHERE id = ? AND blog_id = ?");
        $stmt->execute([$this->comment_id, $this->blog_id]);
        $result = $stmt->fetch();
        $user_id = $result->user_id;
        $comment = $result->comment;
        $creation_date = $result->creation_date;

        $stmt = parent::conn()->prepare("SELECT username FROM users WHERE id = ?");
        $stmt->execute([$user_id]);
        $username = $stmt->fetch();

        return [
            "comment_content" => $comment,
            "comment_date" => $creation_date,
            "comment_author" => $username,
            "query_success" => "The content of the comment was retrieved successfully"
        ];
    }

    public function retrieve_comment_content(): void{
        try{
            $json_return = $this->execute_query();
            echo json_encode($json_return);
        }
        catch(PDOException $e){
            echo json_encode(["query_fail" => "Failed to retrieve the content of the comments. Please try again later."]);
        }
    }
}


$comment_id = filter_input(INPUT_POST, "comment_id", FILTER_SANITIZE_NUMBER_INT);
$blog_id = $_SESSION["blog_id"];
$comment_retrieval = new Comment_Content_Retrieval($comment_id, $blog_id);
$comment_retrieval->retrieve_comment_content();