<?php
session_start();

class Display_Username{
    public function retrieve_username(){
        echo json_encode(["username" => $_SESSION["username"]]);
    }
}

$retrive_username = new Display_Username();
$retrive_username->retrieve_username();