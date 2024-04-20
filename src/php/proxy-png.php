<?php

$server = "tcp://183.90.232.31:80";
//$server = "tcp://10.151.110.59:80";



$proxy = array(
    "http" => array(
        "proxy" => $server,
        'request_fulluri' => true,
    ),
);
$proxy_context = stream_context_create($proxy);
$url = $_GET['url'];
header('Content-type:image/png');
echo file_get_contents($url,false,$proxy_context);
?>