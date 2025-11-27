<?php
require ("../DB_Connection/db_connection.php");
require ("../Session_Maintanance/global_session_check.php");

class All_Blog_Retrieval extends Db_Connection{
    public function __construct(
        private $title_req,
        private $tag_req,
        private $sort_option
    ){}

    private function add_extra_params(): array{
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

    private function sort_blogs(): string{
        $sort_req = "";
        switch($this->sort_option){
            case "most-liked":
                $sort_req = "ORDER BY like_count DESC";
                break;
            case "abc":
                $sort_req = "ORDER BY title";
                break;
            case "cba":
                $sort_req = "ORDER BY title DESC";
                break;
            default:
                throw new Exception("Could not retrieve blogs, please try again later.");
        }
        return $sort_req;
    }

    private function execute_query(): array{
        list($extra_req, $params) = $this->add_extra_params();
        $sort_req = $this->sort_blogs();
        $stmt = parent::conn()->prepare("SELECT * FROM blogs WHERE title LIKE ? {$extra_req} {$sort_req}");
        $stmt->execute($params);
        $blogs = $stmt->fetchAll();
        if(!empty($blogs)){
            foreach($blogs as $blog){
                $stmt = parent::conn()->prepare("SELECT username FROM users WHERE id = ?");
                $stmt->execute([$blog->user_id]);
                $username = $stmt->fetch();
                $blog->username = $username->username;
            }
        }
        return [
            "row_count" => count($blogs),
            "blogs" => $blogs,
            "query_success" => "The blogs were retrieved successfully."
        ];
    }

    public function retrieve_blogs(): void{
        try{
            $json_response = $this->execute_query();
            echo json_encode($json_response);
        }
        catch(PDOException $e){
            echo json_encode(["query_fail" => "A problem has occured, please try again later."]);
        }
        catch(Exception $e){
            echo json_encode(["query_fail" => $e->getMessage()]);
        }
    }
}

$title_req = filter_input(INPUT_POST, "title_req", FILTER_SANITIZE_SPECIAL_CHARS);
$tag_req = json_decode($_POST["tag_req"]);
$sort_option = filter_input(INPUT_POST, "sort_option", FILTER_SANITIZE_SPECIAL_CHARS);
$retrieve_blogs = new All_Blog_Retrieval($title_req, $tag_req, $sort_option);
$retrieve_blogs->retrieve_blogs();