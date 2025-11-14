<?php 
require("../../../DB_Connection/db_connection.php");

class Blog_Contents_Update extends Db_Connection{

    public function __construct(
        private $blog_id, 
        private $user_id
    ){}

    private function execute_query(){
        $stmt = parent::conn()->prepare("");
    }

    public function update_blog_contents(){

    }
}

$blog_id = $_SESSION["blog_id"];
$user_id = $_SESSION["id"];
$blog_data_retrieval = new Blog_Contents_Update($blog_id, $user_id);
$blog_data_retrieval->update_blog_contents();