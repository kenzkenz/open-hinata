<?php

$server = "https://kenzkenz.xsrv.jp/";

$proxy = array(
    "http" => array(
        "proxy" => $server,
        'request_fulluri' => true,
    ),
);
$proxy_context = stream_context_create($proxy);
$url = $_GET['url'];
header('Content-type:image/jpeg');
echo file_get_contents($url,false,$proxy_context);
?>
