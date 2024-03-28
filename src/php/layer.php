<?php
require_once "pwd.php";
$layer = $_GET["layer"];
$screen = $_GET["screen"];
$ua = $_GET["ua"];
$referrer = $_GET["referrer"];
$url = $_GET["url"];

if (!$url){
    $url = "";
};

$mysql = "INSERT INTO layer(layer,screen,ua,referrer,url) values (?,?,?,?,?)";
$stmt = $pdo->prepare($mysql);
$stmt->execute(array($layer,$screen,$ua,$referrer,$url));
//$response = array('layer' => $layer);
//echo json_encode($response);
?>
