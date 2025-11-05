<?php
require ("../DB_Connection/db_connection.php");

class DisplayUsername extends Db_Connection{
    public function retrieveUsername(){
        echo json_encode(["username" => $_SESSION["username"]]);
    }
}

$retrive_username = new DisplayUsername();
$retrive_username->retrieveUsername();