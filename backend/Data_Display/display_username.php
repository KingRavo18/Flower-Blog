<?php
require ("../Session_Maintanance/global_session_check.php");

class Display_Username{
    public function retrieve_username(): void{
        echo json_encode(["username" => $_SESSION["username"]]);
    }
}

$retrive_username = new Display_Username();
$retrive_username->retrieve_username();