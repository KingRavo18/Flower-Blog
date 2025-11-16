<?php 
if(session_status() === PHP_SESSION_NONE){
    session_start();
}
if(empty($_SESSION["id"])){
    echo json_encode(["fatal_fail" => "Failed"]);
    exit;
}