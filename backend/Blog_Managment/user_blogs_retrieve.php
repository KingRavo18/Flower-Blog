<?php
require ("../DB_Connection/db_connection.php");
require ("../Session_Maintanance/global_session_check.php");

class Personal_Blog_Retrieval extends Db_Connection{
    public function __construct(private $user_id){}

    private function execute_query(): array{
        $stmt = parent::conn()->prepare("SELECT id, title, description, contents FROM blogs WHERE user_id = ?");
        $stmt->execute([$this->user_id]);
        $blogs = $stmt->fetchAll();
        $json_response = [
            "row_count" => count($blogs),
            "blogs" => $blogs,
            "query_success" => "Your blogs were retrieved successfully."
        ];
        return $json_response;
    }
    
    public function retrieve_blogs(): void{
        try{
            $json_response = $this->execute_query();
            echo json_encode($json_response);
        }
        catch(PDOException $e){
            echo json_encode(["query_fail" => "A problem has occured, failed to retrieve your blogs."]);
        }
    }
}

$user_id = $_SESSION["id"];
$retrieve_blogs = new Personal_Blog_Retrieval($user_id);
$retrieve_blogs->retrieve_blogs();