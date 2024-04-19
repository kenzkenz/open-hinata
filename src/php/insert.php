<?php
require_once "pwd.php";
/**
 * ランダム文字列生成 (英数字)
 * $length: 生成する文字数
 */
function makeRandStr($length) {
    $str = array_merge(range('a', 'z'), range('0', '9'), range('A', 'Z'));
    $r_str = null;
    for ($i = 0; $i < $length; $i++) {
        $r_str .= $str[rand(0, count($str) - 1)];
    }
    return $r_str;
}
$parameters = $_GET["parameters"];
for ($i = 1; $i <= 10; $i++) {
    //ユニークID生成
    $newurlid = makeRandStr(5);
//    $newurlid = 9;
//    $pdo->setAttribute(PDO::MYSQL_ATTR_USE_BUFFERED_QUERY, true);
    $mysql = "SELECT parameters FROM shorturl WHERE id = ?";
    $stmt = $pdo->prepare($mysql);
    $stmt->execute(array($newurlid));
    $count = $stmt->rowCount();
    if ($count > 0) {
//        print_r("重複");
    } else {
        //一致データなし
        $mysqlI = "INSERT INTO shorturl(id,url,parameters) values (?,?,?)";
        $response = array('error' => 'nodata');
        $url = 'https://kenzkenz.xsrv.jp/open-hinata/#s' . $newurlid;
        $stmtI = $pdo->prepare($mysqlI);
        $stmtI->execute(array($newurlid,$url,$parameters));
//            print_r("追加");
        $response = array('urlid' => $newurlid,'url' => $url);
        break;
    }
}
echo json_encode($response);
?>
