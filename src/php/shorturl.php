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
$urlid = $_GET["urlid"];
$parameters = $_GET["parameters"];
if (!$urlid) {
    try {
        $mysql = "INSERT INTO shorturl(id,url,parameters) values (?,?,?)";
        for ($i = 1; $i <= 10; $i++) {
            try {
                //ユニークID生成
                $newurlid = makeRandStr(5);
                $url = 'https://kenzkenz.xsrv.jp/open-hinata/#s' . $newurlid;
                $stmt = $pdo->prepare($mysql);
                $stmt->execute(array($newurlid,$url,$parameters));
                $response = array('urlid' => $newurlid,'url' => $url);
                break;
            } catch (PDOException $exc) {
                //万が一重複したら別のユニークIDを生成して再登録する
                continue;
            }
            //10回目も重複
            throw new Exception('error-unique');
        }
    } catch (Exception $e) {
        $response = array('error' => 'dbinsert');
    }
} else {
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
        $response = array('error' => 'nodata');
    }
}
echo json_encode($response);
?>
