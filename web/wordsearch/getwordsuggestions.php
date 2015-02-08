<?php
header('Content-Type: application/json');

$data = json_decode($HTTP_RAW_POST_DATA, true);

$searchTerm = $data['searchTerm'];

$searchTerm = preg_replace("/[^a-zA-Z ']+/", ' ', $searchTerm);
$searchTerm = trim($searchTerm);
$searchTerm = preg_split("/\s+/", $searchTerm);

$pspell_link = pspell_new("en");

$results = pspell_suggest ($pspell_link, $searchTerm[0]);
echo json_encode($results);

?>