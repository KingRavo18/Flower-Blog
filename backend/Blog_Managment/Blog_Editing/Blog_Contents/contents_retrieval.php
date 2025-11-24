<?php 
require("../../../DB_Connection/db_connection.php");
require ("../../../Session_Maintanance/global_session_check.php");

class Blog_Contents_Retrieval extends Db_Connection{
    public function __construct(
        private $blog_id, 
        private $user_id
    ){}

    private function execute_query(): array{
        $stmt = parent::conn()->prepare("SELECT * FROM blogs WHERE id = ? AND user_id = ?");
        $stmt->execute([$this->blog_id, $this->user_id]);
        $blog_data = $stmt->fetch();
        if(empty($blog_data)){
            throw new Exception("Blog has not been found");
        }
        return [
            "query_success" => "The blog data has been succesfully retrieved.",
            "blog" => $blog_data
        ];
    }

    public function retrieve_blog_contents(): void{
        try{
            $json_response = $this->execute_query();
            echo json_encode($json_response);
        }
        catch(PDOException $e){
            echo json_encode(["query_fail" => "A problem has occured, please try again later."]);
        }
        catch(Exception $e){
            echo json_encode(["fatal_fail" => $e->getMessage()]);
        }
    }
}

$blog_id = $_SESSION["blog_id"];
$user_id = $_SESSION["id"];
$blog_data_retrieval = new Blog_Contents_Retrieval($blog_id, $user_id);
$blog_data_retrieval->retrieve_blog_contents();