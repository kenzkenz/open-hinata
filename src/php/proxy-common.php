<?php
function curl_get_contents($url)
{

//    $server = 'tcp://183.90.232.31';
    $server = 'tcp://10.151.91.188';
    $port = '8080';

    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_HEADER, false);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_TIMEOUT, 8);
    curl_setopt($ch, CURLOPT_FAILONERROR, true);

    // curl_setopt($ch, CURLOPT_HTTPPROXYTUNNEL, TRUE);
    curl_setopt($ch, CURLOPT_PROXYPORT, $port);
    curl_setopt($ch, CURLOPT_PROXY, $server);

    $result = curl_exec($ch);
    curl_close($ch);
    return $result;
}
