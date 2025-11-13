<?php
session_start();
if(empty($_SESSION["id"]) || empty($_SESSION["username"])){
    echo json_encode(["fatal_fail" => "Failed"]);
}else{
    echo json_encode(["session_validation" => "Your session is valid"]);
}