<?php
require("../../DB_Connection/db_connection.php");

class Blog_Creation extends Db_Connection{
    public function __construct(
        private $user_id, 
        private $title, 
        private $description, 
        private $contents
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

    private function char_replace(){
        $this->title = str_replace(['&#9;', '&#10;'], ["\t", "\n"], $this->title);
        $this->description = str_replace(['&#9;', '&#10;'], ["\t", "\n"], $this->description);
        $this->contents = str_replace(['&#9;', '&#10;'], ["\t", "\n"], $this->contents);
    }

    private function execute_query(){
        $conn = parent::conn();
        $stmt = $conn->prepare("INSERT INTO blogs (user_id, title, description, contents) VALUES (?, ?, ?, ?)");
        $stmt->execute([$this->user_id, $this->title, $this->description, $this->contents]);
        $blog_id = $conn->lastInsertId();
        echo json_encode([
            "blog_id" => $blog_id,
            "query_success" => "Blog creation was successful."
        ]);
    }

    public function create_blog(){
        try{
            $this->validate_inputs();
            $this->char_replace();
            $this->execute_query();
        }
        catch(PDOException $e){
            echo json_encode(["query_fail" => "A problem has occured, please try again later."]);
        }
        catch(Exception $e){
            echo json_encode(["query_fail" => $e->getMessage()]);
        }
    }
}

$user_id = $_SESSION["id"];
$title = filter_input(INPUT_POST, "title", FILTER_SANITIZE_SPECIAL_CHARS);
$description = filter_input(INPUT_POST, "description", FILTER_SANITIZE_SPECIAL_CHARS);
$contents = filter_input(INPUT_POST, "contents", FILTER_SANITIZE_SPECIAL_CHARS);

$create_blog = new Blog_Creation($user_id, $title, $description, $contents);
$create_blog->create_blog();