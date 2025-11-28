<?php 
require ("../../DB_Connection/db_connection.php");
require ("../../Session_Maintanance/global_session_check.php");

class Comment_Update extends Db_Connection{
    public function __construct(
        private $user_id,
        private $comment_id,
        private $comment
    ){}

    private function char_decode(): void{
        $this->comment = html_entity_decode($this->comment, ENT_QUOTES);
    }

    private function validate_inputs(): void{
        if(empty(trim($this->comment))){
            throw new Exception("A comment cannot be empty.");
        }
    }

    private function execute_query(): bool{
        $stmt = parent::conn()->prepare("UPDATE comments SET comment = ? WHERE id = ? AND user_id = ?");
        $stmt->execute([$this->comment, $this->comment_id, $this->user_id]);
        return $stmt->rowCount() > 0;
    }

    public function update_comment(): void{
        try{
            $this->char_decode();
            $this->validate_inputs();
            $updated = $this->execute_query();
            if(!$updated){  
                echo json_encode(["fatal_fail" => "The comment could not be found."]);
            }
            else{
                echo json_encode(["query_success" => "The comment was succesfully updated."]);
            }
        }
        catch(PDOException $e){
            echo json_encode(["query_fail" => "Failed to update this comment."]);
        }
        catch(Exception $e){
            echo json_encode(["query_fail" => $e->getMessage()]);
        }
    }
}

$user_id = $_SESSION["id"];
$comment_id = filter_input(INPUT_POST, "comment_id", FILTER_SANITIZE_NUMBER_INT);
$comment = filter_input(INPUT_POST, "comment", FILTER_SANITIZE_SPECIAL_CHARS);
$comment_retrieval = new Comment_Update($user_id, $comment_id, $comment);
$comment_retrieval->update_comment();