<?php
require ("../DB_Connection/db_connection.php");

class Display_Username extends Db_Connection{
    public function retrieve_username(){
        echo json_encode(["username" => $_SESSION["username"]]);
    }
}

$retrive_username = new Display_Username();
$retrive_username->retrieve_username();