<?php
require_once "pwd.php";
//// 一時アップロード先ファイルパス
$file_tmp  = $_FILES["file_1"]["tmp_name"];
$dir = './img/';
$image = uniqid(mt_rand(), false);//ファイル名をユニーク化
switch (@exif_imagetype($file_tmp)) {//画像ファイルかのチェック
    case IMAGETYPE_GIF:
        $image .= '.gif';
        break;
    case IMAGETYPE_JPEG:
        $image .= '.jpg';
        break;
    case IMAGETYPE_PNG:
        $image .= '.png';
        break;
    default:
//        echo '拡張子を変更してください';
        $response = array('error' => '拡張子を変更してください');
        echo json_encode($response);
}
// ファイル移動
$result = @move_uploaded_file($file_tmp, $dir . $image);


if ( $result === true ) {
//    echo "アップロード成功！";
    $mysqlI = "INSERT INTO image(name) values (?)";
//    $response = array('error' => 'nodata');
    $stmtI = $pdo->prepare($mysqlI);
    $stmtI->execute(array($image));

    $response = array('fileName' => $image);
    echo json_encode($response);
} else {
    $response = array('error' => 'アップロード失敗');
    echo json_encode($response);
}
?>