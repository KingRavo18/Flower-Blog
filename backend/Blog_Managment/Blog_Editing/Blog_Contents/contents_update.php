<?php 
require("../../../DB_Connection/db_connection.php");

class Blog_Contents_Update extends Db_Connection{
    public function __construct(
        private $title,
        private $description,
        private $contents,
        private $blog_id, 
        private $user_id
    ){}

    private function validate_inputs(){
        if(empty(trim($this->title))){
            throw new Exception("A blog must have a title.");
        }
        if(empty(trim($this->description))){
            throw new Exception("A blog must have a description.");
        }
        if(empty(trim($this->contents))){
            throw new Exception("A blog must have at least some sort of contents.");
        }
    }

    private function execute_query(){
        $stmt = parent::conn()->prepare("UPDATE blogs SET title = ?, description = ?, contents = ? WHERE id = ? AND user_id = ?");
        $stmt->execute([$this->title, $this->description, $this->contents, $this->blog_id, $this->user_id]);
    }

    public function update_blog_contents(){
        try{
            $this->validate_inputs();
            $this->execute_query();
            echo json_encode(["query_success" => "Your blog has been updated."]);
        }
        catch(PDOException $e){
            echo json_encode(["query_fail" => "A problem has occured. Please try again later."]);
        }
        catch(Exception $e){
            echo json_encode(["query_fail" => $e->getMessage()]);
        }
    }
}

$title = filter_input(INPUT_POST, "title", FILTER_SANITIZE_SPECIAL_CHARS);
$description = filter_input(INPUT_POST, "description", FILTER_SANITIZE_SPECIAL_CHARS);
$contents = filter_input(INPUT_POST, "contents", FILTER_SANITIZE_SPECIAL_CHARS);
$blog_id = $_SESSION["blog_id"];
$user_id = $_SESSION["id"];
$blog_contents_update = new Blog_Contents_Update($title, $description, $contents, $blog_id, $user_id);
$blog_contents_update->update_blog_contents();