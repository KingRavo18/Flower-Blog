<?php 
require ("../DB_Connection/db_connection.php");
require ("../Session_Maintanance/global_session_check.php");

class Blog_Content_Display extends Db_Connection{
    public function __construct(private $blog_id){}

    private function execute_query(){
        $stmt = parent::conn()->prepare("SELECT title, description, contents FROM blogs WHERE id = ?");
        $stmt->execute([$this->blog_id]);
        $result = $stmt->fetch();
        echo json_encode([
            "query_success" => "Blog title was found.",
            "content" => $result
        ]);
    }

    public function display_blog_content(){
        try{
            $this->execute_query();
        }
        catch(PDOException $e){
            echo json_encode(["query_fail" => "A problem has occured."]);
        }
    }
}

$blog_id = $_SESSION["blog_id"];
$display_blog_title = new Blog_Content_Display($blog_id);
$display_blog_title->display_blog_content();