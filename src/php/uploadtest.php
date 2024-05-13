<?php
//$dsn = "mysql:host=localhost; dbname=xxx; charset=utf8";
//$username = "xxx";
//$password = "xxx";
//
//try {
//    $dbh = new PDO($dsn, $username, $password);
//} catch (PDOException $e) {
//    echo $e->getMessage();
//}

if (isset($_POST['upload'])){
    $temp_file = $_FILES['image']['tmp_name'];
    $dir = './img/';

    if (file_exists($temp_file)) {//②送信した画像が存在するかチェック
        $image = uniqid(mt_rand(), false);//③ファイル名をユニーク化
        switch (@exif_imagetype($temp_file)) {//④画像ファイルかのチェック
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
                echo '拡張子を変更してください';
        }
        //⑤DBではなくサーバーのimageディレクトリに画像を保存
        move_uploaded_file($temp_file, $dir . $image);
    }
//　　　　 　　　//⑥DBにはファイル名保存
//    $sql = "INSERT INTO images(name) VALUES (:image)";
//    $stmt = $dbh->prepare($sql);
//    $stmt->bindValue(':image', $image, PDO::PARAM_STR);
//    $stmt->execute();
}

?>