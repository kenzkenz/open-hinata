<?php
require_once "pwd.php";

$cityCode = $_GET["cityCode"];
$azaCode = $_GET["azaCode"];
$year = $_GET["year"];

if ($year === 'H27') {
    $mysql = "SELECT * FROM pyramidh27 WHERE 市区町村コード = ? AND 町丁字コード = ?";
} else if ($year === 'H22'){
    $mysql = "SELECT * FROM pyramidh22 WHERE 市区町村コード = ? AND 町丁字コード = ?";
} else if ($year === 'H17'){
    $mysql = "SELECT * FROM pyramidh17 WHERE 市区町村コード = ? AND 町丁字コード = ?";
}


$pdo->setAttribute(PDO::MYSQL_ATTR_USE_BUFFERED_QUERY, true);
//$mysql = "SELECT * FROM pyramidh27 WHERE 市区町村コード = ? AND 町丁字コード = ?";
$stmt = $pdo->prepare($mysql);
$stmt->execute(array($cityCode,$azaCode));
$count = $stmt->rowCount();
$array0 = array();
if ($count > 0) {
    foreach ($stmt as $row) {
        $array = [
            "秘匿処理" => $row['秘匿処理'],
            "総数" => $row['総数総数'],
            
            "男0～4歳" => $row['男0～4歳'],
            "男5～9歳" => $row['男5～9歳'],
            "男10～14歳" => $row['男10～14歳'],
            "男15～19歳" => $row['男15～19歳'],
            "男20～24歳" => $row['男20～24歳'],
            "男25～29歳" => $row['男25～29歳'],
            "男30～34歳" => $row['男30～34歳'],
            "男35～39歳" => $row['男35～39歳'],
            "男40～44歳" => $row['男40～44歳'],
            "男45～49歳" => $row['男45～49歳'],
            "男50～54歳" => $row['男50～54歳'],
            "男55～59歳" => $row['男55～59歳'],
            "男60～64歳" => $row['男60～64歳'],
            "男65～69歳" => $row['男65～69歳'],
            "男70～74歳" => $row['男70～74歳'],
            "男75～79歳" => $row['男75～79歳'],
            "男80～84歳" => $row['男80～84歳'],
            "男85～89歳" => $row['男85～89歳'],
            "男90～94歳" => $row['男90～94歳'],
            "男95～99歳" => $row['男95～99歳'],
            "男100歳以上" => $row['男100歳以上'],

            "女0～4歳" => $row['女0～4歳'],
            "女5～9歳" => $row['女5～9歳'],
            "女10～14歳" => $row['女10～14歳'],
            "女15～19歳" => $row['女15～19歳'],
            "女20～24歳" => $row['女20～24歳'],
            "女25～29歳" => $row['女25～29歳'],
            "女30～34歳" => $row['女30～34歳'],
            "女35～39歳" => $row['女35～39歳'],
            "女40～44歳" => $row['女40～44歳'],
            "女45～49歳" => $row['女45～49歳'],
            "女50～54歳" => $row['女50～54歳'],
            "女55～59歳" => $row['女55～59歳'],
            "女60～64歳" => $row['女60～64歳'],
            "女65～69歳" => $row['女65～69歳'],
            "女70～74歳" => $row['女70～74歳'],
            "女75～79歳" => $row['女75～79歳'],
            "女80～84歳" => $row['女80～84歳'],
            "女85～89歳" => $row['女85～89歳'],
            "女90～94歳" => $row['女90～94歳'],
            "女95～99歳" => $row['女95～99歳'],
            "女100歳以上" => $row['女100歳以上'],
            
            "65歳以上" => $row['総数65歳以上'],
            "平均年齢" => $row['総数平均年齢'],

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

