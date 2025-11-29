<?php
require ("../DB_Connection/db_connection.php");
require ("../Session_Maintanance/global_session_check.php");

class Liked_Blog_Retrieval extends Db_Connection{
    public function __construct(private $user_id){}

    private function execute_query(): array{
        $stmt = parent::conn()->prepare("SELECT blog_id FROM blog_likes WHERE user_id = ? AND is_liked = ?");
        $stmt->execute([$this->user_id, true]);
        $return = $stmt->fetchAll();

        if(empty($return)){
            return [
                "row_count" => 0,
                "blogs" => [],
                "query_success" => "Your blogs were retrieved successfully."
            ];
        }

        $liked_blog_ids = [];
        foreach($return as $id){
            $liked_blog_ids[] = $id->blog_id;
        }

        $placeholders = implode(',', array_fill(0, count($liked_blog_ids), '?'));

        $stmt = parent::conn()->prepare("SELECT id, title, description, contents FROM blogs WHERE id IN ($placeholders)");
        $stmt->execute($liked_blog_ids);
        $blogs = $stmt->fetchAll();
        return [
            "row_count" => count($blogs),
            "blogs" => $blogs,
            "query_success" => "Your blogs were retrieved successfully."
        ];
    }

    public function retrieve_blogs(): void{
        try{
            $json_response = $this->execute_query();
            echo json_encode($json_response);
        }
        catch(PDOException $e){
            echo json_encode(["query_fail" => "A problem has occured, failed to retrieve your liked blogs."]);
        }
    }
}

$user_id = $_SESSION["id"];
$retrieve_blogs = new Liked_Blog_Retrieval($user_id);
$retrieve_blogs->retrieve_blogs();