<?php
require ("../DB_Connection/db_connection.php");
require ("../Session_Maintanance/global_session_check.php");

class All_Blog_Retrieval extends Db_Connection{
    public function __construct(private $title_req){}

    private function execute_query(){
        $stmt = parent::conn()->prepare("SELECT * FROM blogs WHERE title LIKE ? ORDER BY like_count");
        $stmt->execute(["%{$this->title_req}%"]);
        $blogs = $stmt->fetchAll();

        if(count($blogs) === 0){
            echo json_encode([
                "row_count" => count($blogs),
                "blogs" => [],
                "query_success" => "The blogs were retrieved successfully."
            ]);
            exit;
        }

        foreach($blogs as $blog){
            $stmt = parent::conn()->prepare("SELECT username FROM users WHERE id = ?");
            $stmt->execute([$blog->user_id]);
            $username = $stmt->fetch();
            $blog->username = $username->username;
        }

        echo json_encode([
            "row_count" => count($blogs),
            "blogs" => $blogs,
            "query_success" => "The blogs were retrieved successfully."
        ]);
    }

    public function retrieve_blogs(){
        try{
            $this->execute_query();
        }
        catch(PDOException $e){
            echo json_encode(["query_fail" => "A problem has occured, faield to retrieve all blogs."]);
        }
    }
}

$title_req = filter_input(INPUT_POST, "title_req", FILTER_SANITIZE_SPECIAL_CHARS);
$retrieve_blogs = new All_Blog_Retrieval($title_req);
$retrieve_blogs->retrieve_blogs();