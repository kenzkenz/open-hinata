<?php
require_once "pwd.php";

$cityCode = $_GET["cityCode"];
$azaCode = $_GET["azaCode"];

$pdo->setAttribute(PDO::MYSQL_ATTR_USE_BUFFERED_QUERY, true);
$mysql = "SELECT * FROM pyramid WHERE 市区町村コード = ? AND 町丁字コード = ?";
$stmt = $pdo->prepare($mysql);
$stmt->execute(array($cityCode,$azaCode));
$count = $stmt->rowCount();
$array0 = array();
if ($count > 0) {
    foreach ($stmt as $row) {
        $array = [
            "男女" => $row['男女'],
            "0～4歳" => $row['0～4歳'],
            "5～9歳" => $row['5～9歳'],
            "10～14歳" => $row['10～14歳'],
        ];
        $array0[] = $array;
        $response = $array0;
    }
} else {
    //一致データなし
        $response = array('error' => 'nodata');
}
echo json_encode($response);
?>

