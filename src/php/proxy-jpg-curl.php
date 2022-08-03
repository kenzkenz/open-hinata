<?php
require_once('proxy-common.php');

header('Content-type:image/jpg');
echo curl_get_contents($_GET['url']);
