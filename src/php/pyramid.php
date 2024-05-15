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
            "秘匿処理" => $row['秘匿処理'],
            "総数" => $row['総数'],
            "0～4歳" => $row['0～4歳'],
            "5～9歳" => $row['5～9歳'],
            "10～14歳" => $row['10～14歳'],
            "15～19歳" => $row['15～19歳'],
            "20～24歳" => $row['20～24歳'],
            "25～29歳" => $row['25～29歳'],
            "30～34歳" => $row['30～34歳'],
            "35～39歳" => $row['35～39歳'],
            "40～44歳" => $row['40～44歳'],
            "45～49歳" => $row['45～49歳'],
            "50～54歳" => $row['50～54歳'],
            "55～59歳" => $row['55～59歳'],
            "60～64歳" => $row['60～64歳'],
            "65～69歳" => $row['65～69歳'],
            "70～74歳" => $row['70～74歳'],
            "75～79歳" => $row['75～79歳'],
            "80～84歳" => $row['80～84歳'],
            "85～89歳" => $row['85～89歳'],
            "90～94歳" => $row['90～94歳'],
            "95～99歳" => $row['95～99歳'],
            "100歳以上" => $row['100歳以上'],

            "15歳未満" => $row['15歳未満'],
            "15～64歳" => $row['15～64歳'],
            "65歳以上" => $row['65歳以上'],
            "平均年齢" => $row['平均年齢'],

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

