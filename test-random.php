<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
</head>
<body>
<?php
error_reporting( E_ALL );
$n = 10;
$text = "";
$possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
$possibleLength = strlen($possible);

for ($i = 0; $i < $n; $i++)
{
    $rnum = mt_rand() / (mt_getrandmax() + 1);
    $temp = (int)(floor($rnum * $possibleLength));
    $text .= $possible{$temp};
}

var_dump( $text );
?>
</body>
</html>