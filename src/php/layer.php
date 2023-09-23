<?php
require_once "pwd.php";
$layer = $_GET["layer"];
$screen = $_GET["screen"];
$ua = $_GET["ua"];
$mysql = "INSERT INTO layer(layer,screen,ua) values (?,?,?)";
$stmt = $pdo->prepare($mysql);
$stmt->execute(array($layer,$screen,$ua));
//$response = array('layer' => $layer);
//echo json_encode($response);
?>
