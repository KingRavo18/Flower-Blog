<?php 
require ("../../DB_Connection/db_connection.php");
require ("../../Session_Maintanance/global_session_check.php");

class Blog_Id_Transfer extends Db_Connection{
    public function __construct(private $blog_id){}

    public function transfer(){
        $_SESSION["blog_id"] = $this->blog_id;
        echo json_encode(["query_success" => "The blog id has been successfully transfered."]);
    }
}

$blog_id = filter_input(INPUT_POST, "blog_id", FILTER_SANITIZE_NUMBER_INT);
$blog_deletion = new Blog_Id_Transfer($blog_id);
$blog_deletion->transfer();