<?php
session_start();
if(empty($_SESSION["id"])){
    echo json_encode(["fatal_fail" => "Failed"]);
}
echo json_encode(["session_validation" => "Your session is valid"]);
