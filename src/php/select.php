<?php
require_once "pwd.php";

$urlid = $_GET["urlid"];
$pdo->setAttribute(PDO::MYSQL_ATTR_USE_BUFFERED_QUERY, true);
$mysql = "SELECT parameters FROM shorturl WHERE id = ?";
$stmt = $pdo->prepare($mysql);
$stmt->execute(array($urlid));
$count = $stmt->rowCount();
if ($count > 0) {
    foreach ($stmt as $row) {
        $response = $row['parameters'];
        break;
    }
} else {
    //一致データなし
//    $response = array('error' => 'nodata');
}
echo json_encode($response);
?>
