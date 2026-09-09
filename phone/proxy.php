<?php
header('Content-Type: application/javascript; charset=utf-8');
$ch = curl_init('https://ljse.si/json/TradingPriceList?lng=sl&market_segment_ids=A,B,C,D,E,F&type=&model=&date=&only_traded=0');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
$data = curl_exec($ch);
curl_close($ch);
$cb = isset($_GET['cb']) ? preg_replace('/[^a-zA-Z0-9_]/', '', $_GET['cb']) : 'ljseCallback';
echo $cb . '(' . $data . ');';
