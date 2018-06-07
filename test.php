<?php
$notifier_file_url = 'https://neweb.info/notifier-premium.xml';
if( function_exists('curl_init') ) { // if cURL is available, use it...
    $ch = curl_init($notifier_file_url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HEADER, 0);
    curl_setopt($ch, CURLOPT_TIMEOUT, 10);
    $cache = curl_exec($ch);
    curl_close($ch);
} else {
    $cache = file_get_contents($notifier_file_url); // ...if not, use the common file_get_contents()
}
var_dump($cache);