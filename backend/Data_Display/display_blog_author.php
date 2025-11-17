<?php 
require ("../DB_Connection/db_connection.php");
require ("../Session_Maintanance/global_session_check.php");

class Blog_Author_Display extends Db_Connection{
    public function __construct(private $blog_id){}

    private function execute_query(){
        $stmt = parent::conn()->prepare("SELECT user_id FROM blogs WHERE id = ?");
        $stmt->execute([$this->blog_id]);
        $result = $stmt->fetch();
        $user_id = $result->user_id;

        $stmt = parent::conn()->prepare("SELECT username FROM users WHERE id = ?");
        $stmt->execute([$user_id]);
        $username = $stmt->fetch();
        echo json_encode([
            "query_success" => "Blog title was found.",
            "content" => $username
        ]);
    }

    public function display_blog_author(){
        try{
            $this->execute_query();
        }
        catch(PDOException $e){
            echo json_encode(["query_fail" => "A problem has occured."]);
        }
    }
}

$blog_id = $_SESSION["blog_id"];
$display_blog_author = new Blog_Author_Display($blog_id);
$display_blog_author->display_blog_author();