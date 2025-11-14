<?php 
require("../../DB_Connection/db_connection.php");

class Blog_Data_Retrieval extends Db_Connection{
    private $blog_id;
    private $user_id;

    public function __construct($user_id, $blog_id){
        $this->blog_id = $blog_id;
        $this->user_id = $user_id;
    }

    private function execute_query(){
        $stmt = parent::conn()->prepare("SELECT * FROM blogs WHERE id = ? AND user_id = ?");
        $stmt->execute([$this->blog_id, $this->user_id]);
    }

    public function retrieve_blog_data(){
        try{
            $this->execute_query();
            echo json_encode(["query_success" => "The blog data has been succesfully retrieved."]);
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
$blog_data_retrieval = new Blog_Data_Retrieval($blog_id, $user_id,);
$blog_data_retrieval->retrieve_blog_data();