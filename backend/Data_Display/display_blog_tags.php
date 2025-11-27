<?php
require ("../DB_Connection/db_connection.php");
require ("../Session_Maintanance/global_session_check.php");

class Blog_Tag_Retrieval extends Db_Connection{
    public function __construct(private $blog_id){}

    private function execute_query(): array{
        $stmt = parent::conn()->prepare("SELECT id, tag FROM blog_tags WHERE blog_id = ?");
        $stmt->execute([$this->blog_id]);
        $tags = $stmt->fetchAll();
        return [
            "row_count" => count($tags),
            "tags" => $tags,
            "query_success" => "The tags were retrieved successfully."
        ];
    }

    public function retrieve_tags(): void{
        try{
            $json_return = $this->execute_query();
            echo json_encode($json_return);
        }
        catch(PDOException $e){
            echo json_encode(["query_fail" => "Failed to load tags for this blog."]);
        }
    }
}

$blog_id = $_SESSION["blog_id"];
$tag_retrieval = new Blog_Tag_Retrieval($blog_id);
$tag_retrieval->retrieve_tags();