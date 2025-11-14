<?php
require("../../DB_Connection/db_connection.php");

class Blog_Tag_Submit extends Db_Connection{
    public function __construct(
        private $blog_id, 
        private $tag
    ){}

    private function validate_data(){
        if($this->blog_id === 0){
            throw new Exception();
        }
    }

    private function execute_query(){
        $stmt = parent::conn() -> prepare("INSERT INTO blog_tags (blog_id, tag) VALUES (?, ?)");
        $stmt->execute([$this->blog_id, $this->tag]);
    }

    public function submit_blog_tag(){
        try{
            $this->validate_data();
            $this->execute_query();
            echo json_encode(["query_success" => "Tags were successfully added."]);
        }
        catch(PDOException $e){
            echo json_encode(["query_fail" => "Could not assign tags. Please assign them in blog edit later."]);
        }
        catch(Exception $e){
            echo json_encode(["query_fail" => "Could not assign tags. Please assign them in blog edit later."]);
        }
    }
}

$blog_id = filter_input(INPUT_POST, "blog_id", FILTER_SANITIZE_NUMBER_INT);
$tag = filter_input(INPUT_POST, "tag", FILTER_SANITIZE_SPECIAL_CHARS);
$submit_tag = new Blog_Tag_Submit($blog_id, $tag);
$submit_tag->submit_blog_tag();