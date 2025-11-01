<?php
session_start();
if(empty($_SESSION["id"]) || empty($_SESSION["username"]) || empty($_SESSION["password"])){
    echo json_encode(["session_validation" => "Failed"]);
}else{
    echo json_encode(["session_validation" => "Your session is valid"]);
}