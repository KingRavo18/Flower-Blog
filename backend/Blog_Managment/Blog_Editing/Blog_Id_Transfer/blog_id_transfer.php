<?php 
require("../../../DB_Connection/db_connection.php");

class Edit_Page_Blog_Id_Transfer extends Db_Connection{
    public function __construct(
        private $user_id, 
        private $blog_id
    ){}

    private function check_ownership(){
        $stmt = parent::conn()->prepare("SELECT user_id FROM blogs WHERE id = ?");
        $stmt->execute([$this->blog_id]);
        $owner_id = $stmt->fetch();
        if($owner_id->user_id !== $this->user_id){
            throw new Exception("The current user does not own this blog.");
        }
    }

    public function transfer_data(){
        try{
            $this->check_ownership();
            $_SESSION["blog_id"] = $this->blog_id;
            echo json_encode(["query_success" => "The blog id has been successfully transfered."]);
        }
        catch(PDOException $e){
            echo json_encode(["query_fail" => "A problem has occured, please try again later."]);
        }
        catch(Exception $e){
            echo json_encode(["fatal_fail" => $e->getMessage()]);
        }
    }
}

$user_id = $_SESSION["id"];
$blog_id = filter_input(INPUT_POST, "blog_id", FILTER_SANITIZE_NUMBER_INT);
$blog_deletion = new Edit_Page_Blog_Id_Transfer($user_id, $blog_id);
$blog_deletion->transfer_data();