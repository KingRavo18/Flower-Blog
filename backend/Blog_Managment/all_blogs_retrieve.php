<?php
require ("../DB_Connection/db_connection.php");
require ("../Session_Maintanance/global_session_check.php");

class All_Blog_Retrieval extends Db_Connection{
    public function __construct(
        private $title_req,
        private $tag_req
    ){}

    private function add_extra_params(){
        $extra_req = "";
        $tag_blog_ids = [];

        if(!empty($this->tag_req)){
            $stmt = parent::conn()->prepare("SELECT blog_id FROM blog_tags WHERE tag = ?");
            foreach($this->tag_req as $tag){
                $stmt->execute([$tag]);
                foreach($stmt->fetchAll() as $row){
                   $tag_blog_ids[] = (int)$row->blog_id;
                }
            }
            if(!empty($tag_blog_ids)){
                $tag_blog_ids = array_values(array_unique($tag_blog_ids));
                $placeholders = implode(',', array_fill(0, count($tag_blog_ids), '?'));
                $extra_req = " AND id IN ($placeholders)";
            }
            else{
                $extra_req = " AND 0=1";
            }
        }
        
        $params = ["%{$this->title_req}%"];
        $params = array_merge($params, $tag_blog_ids);
        return array($extra_req, $params);
    }

    private function execute_query(){
        list($extra_req, $params) = $this->add_extra_params();
        $stmt = parent::conn()->prepare("SELECT * FROM blogs WHERE title LIKE ? {$extra_req} ORDER BY like_count");
        $stmt->execute($params);
        $blogs = $stmt->fetchAll();

        if(empty($blogs)){
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
            echo json_encode(["query_fail" => $e->getMessage()]);
        }
    }
}

$title_req = filter_input(INPUT_POST, "title_req", FILTER_SANITIZE_SPECIAL_CHARS);
$tag_req = json_decode($_POST["tag_req"]);
$retrieve_blogs = new All_Blog_Retrieval($title_req, $tag_req);
$retrieve_blogs->retrieve_blogs();