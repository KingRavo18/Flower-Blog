<?php 
require ("../../../DB_Connection/db_connection.php");
require ("../../../Session_Maintanance/global_session_check.php");

class Blog_Tag_Deletion extends Db_Connection{
    public function __construct( private $tag_id ){}

    private function execute_query(){
        $stmt = parent::conn()->prepare("DELETE FROM blog_tags WHERE id = ?");
        $stmt->execute([$this->tag_id]);
        $tag_count = $stmt->rowCount();
        if($tag_count === 0){
            throw new Exception("Unauthorised deletion attempt.");
        }
    }

    public function delete_blog_tag(){
        try{
            $this->execute_query();
            echo json_encode(["query_success" => "The tag was succesfully deleted."]);
        }
        catch(PDOException $e){
            echo json_encode(["query_fail" => "A problem has occured, please try again later."]);
        }
        catch(Exception $e){
            echo json_encode(["fatal_fail" => $e->getMessage()]);
        }
    }
}

$tag_id = filter_input(INPUT_POST, "tag_id", FILTER_SANITIZE_NUMBER_INT);
$tag_deletion = new Blog_Tag_Deletion($tag_id);
$tag_deletion->delete_blog_tag();