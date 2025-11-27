<?php 
require ("../../DB_Connection/db_connection.php");
require ("../../Session_Maintanance/global_session_check.php");

class Comment_Retrieval extends Db_Connection{
    public function __construct(
        private $user_id,
        private $blog_id
    ){}

    private function execute_query(): array{
        $stmt = parent::conn()->prepare("SELECT id, user_id, comment, creation_date FROM comments WHERE blog_id = ?");
        $stmt->execute([$this->blog_id]);
        $comments = $stmt->fetchAll();

        foreach($comments as $comment){
            $stmt = parent::conn()->prepare("SELECT username FROM users WHERE id = ?");
            $stmt->execute([$comment->user_id]);
            $username = $stmt->fetch();
            $comment->username = $username->username;

            $stmt = parent::conn()->prepare("SELECT comment FROM comments WHERE id = ? AND user_id = ? AND blog_id = ?");
            $stmt->execute([$comment->id, $this->user_id, $this->blog_id]);
            $username = $stmt->fetch();
            $is_users = false;
            if(!empty($username->comment)){
                $is_users = true;
            }
            $comment->is_users = $is_users;
        }

        return [
            "row_count" => $stmt->rowCount(),
            "comments" => $comments,
            "query_success" => "The comments were retrieved successfully."
        ];
    }

    public function retrieve_comment_ids(): void{
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
$blog_id = $_SESSION["blog_id"];
$comment_retrieval = new Comment_Retrieval($user_id, $blog_id);
$comment_retrieval->retrieve_comment_ids();