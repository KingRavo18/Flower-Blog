<?php
require ("../DB_Connection/db_connection.php");

class DisplayUsername extends DbConnection{
    public function retrieveUsername(){
        echo json_encode(["username" => $_SESSION["username"]]);
    }
}

$retrive_username = new DisplayUsername();
$retrive_username->retrieveUsername();