<?php
require("../../DB_Connection/db_connection.php");
require ("../../Session_Maintanance/global_session_check.php");

class Blog_Tag_Submit extends Db_Connection{
    public function __construct(
        private $blog_id, 
        private $tag
    ){}

    private function char_decode(): void{
        $this->tag = html_entity_decode($this->tag, ENT_QUOTES);
    }

    private function validate_data(): void{
        if($this->blog_id === 0){
            throw new Exception();
        }
        if(empty(trim($this->tag)) === ""){
            throw new Exception();
        }
    }

    private function execute_query(): array{
        $conn = parent::conn();
        $stmt = $conn->prepare("INSERT INTO blog_tags (blog_id, tag) VALUES (?, ?)");
        $stmt->execute([$this->blog_id, $this->tag]);
        $tag_id = $conn->lastInsertId();
        return [
            "tag_id" => $tag_id,
            "query_success" => "The tag was succesfully added."
        ];
    }

    public function submit_blog_tag(): void{
        try{
            $this->char_decode();
            $this->validate_data();
            $json_return = $this->execute_query();
            echo json_encode($json_return);
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

if(!$blog_id){
    $blog_id = $_SESSION["blog_id"];
} else {
    echo json_encode(["fatal_fail" => "A problem has occured."]);
}

$tag = filter_input(INPUT_POST, "tag", FILTER_SANITIZE_SPECIAL_CHARS);
$submit_tag = new Blog_Tag_Submit($blog_id, $tag);
$submit_tag->submit_blog_tag();