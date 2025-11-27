<?php 
require ("../../DB_Connection/db_connection.php");
require ("../../Session_Maintanance/global_session_check.php");

class Comment_Creation extends Db_Connection{
    public function __construct(
        private $user_id,
        private $blog_id,
        private $comment
    ){}

    private function char_decode(): void{
        $this->comment = html_entity_decode($this->comment, ENT_QUOTES);
    }

    private function validate_input(): void{
        if(empty(trim($this->comment))){
            throw new Exception("Please input your comment.");
        }
    }

    private function execute_query(): array{
        $conn = parent::conn();
        $stmt = $conn->prepare("INSERT into comments (user_id, blog_id, comment) VALUES (?, ?, ?)");
        $stmt->execute([$this->user_id, $this->blog_id, $this->comment]);
        $comment_id = $conn->lastInsertId();

        $stmt = $conn->prepare("SELECT user_id, creation_date FROM comments WHERE id = ?");
        $stmt->execute([$comment_id]);
        $comment = $stmt->fetch();

        $stmt = $conn->prepare("SELECT username FROM users WHERE id = ?");
        $stmt->execute([$comment->user_id]);
        $username = $stmt->fetch();
        $comment->username = $username->username;

        return [
            "comment_id" => $comment_id,
            "comment" => $comment,
            "query_success" => "Your comment was added successfully."
        ];
    }

    public function submit_comment(): void{
        try{
            $this->char_decode();
            $this->validate_input();
            $json_return = $this->execute_query();
            echo json_encode($json_return);
        }
        catch(PDOException $e){
            echo json_encode(["query_fail" => "A problem has occured. Please try again later"]);
        }
        catch(Exception $e){
            echo json_encode(["query_fail" => $e->getMessage()]);
        }
    }
}

$user_id = $_SESSION["id"];
$blog_id = $_SESSION["blog_id"];
$comment = filter_input(INPUT_POST, "comment", FILTER_SANITIZE_SPECIAL_CHARS);
$comment_creation = new Comment_Creation($user_id, $blog_id, $comment);
$comment_creation->submit_comment();