<?php
session_start();

class DbConnection{
    private $db_server = "localhost";
    private $db_username = "root";
    private $db_password = "";
    private $db_name = "flower-blog";

    protected function conn(){
        $attribute_options = [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_EMULATE_PREPARES => false,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_OBJ
        ];
        $dsn = "mysql:host={$this->db_server};dbname={$this->db_name};charset=utf8mb4";
        try{
            return new PDO($dsn, $this->db_username, $this->db_password, $attribute_options);
        }
        catch(PDOException $e){
            echo json_encode(["db_pdo_fail" => "Database connection failed: {$e->getMessage()}"]);
        }
    }
}
