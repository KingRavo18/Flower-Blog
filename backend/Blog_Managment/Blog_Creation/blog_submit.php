<?php
require("../../DB_Connection/db_connection.php");

class Blog_Creation extends Db_Connection{
    private $user_id;
    private $title;
    private $description;
    private $contents;

    public function __construct($user_id, $title, $description, $contents){
        $this->user_id = $user_id;
        $this->title = $title;
        $this->description = $description;
        $this->contents = $contents;
    }

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
        $conn = parent::conn();
        $stmt = $conn->prepare("INSERT INTO blogs (user_id, title, description, contents) VALUES (?, ?, ?, ?)");
        $stmt->execute([$this->user_id, $this->title, $this->description, $this->contents]);
        $blog_id = $conn->lastInsertId();
        echo json_encode([
            "blog_id" => $blog_id,
            "query_success" => "Blog creation was successful."
        ]);
        $stmt = null;
    }

    public function create_blog(){
        try{
            $this->validate_inputs();
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