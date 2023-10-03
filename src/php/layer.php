<?php
require_once "pwd.php";
$layer = $_GET["layer"];
$screen = $_GET["screen"];
$ua = $_GET["ua"];
$referrer = $_GET["referrer"];

$mysql = "INSERT INTO layer(layer,screen,ua,referrer) values (?,?,?,?)";
$stmt = $pdo->prepare($mysql);
$stmt->execute(array($layer,$screen,$ua,$referrer));
//$response = array('layer' => $layer);
//echo json_encode($response);
?>
