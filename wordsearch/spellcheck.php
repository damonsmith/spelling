<?php
header('Content-Type: application/json');

$data = json_decode($HTTP_RAW_POST_DATA, true);
$inputContents = $data['text'];

$inputContents = preg_replace("/[^a-zA-Z ']+/", ' ', $inputContents);
$inputContents = trim($inputContents);
$inputContents = preg_split("/\s+/", $inputContents);

$pspell_link = pspell_new("en");

$results = array();

foreach ($inputContents as $singleWord) {
	if (!pspell_check($pspell_link, $singleWord)) {
		$suggestions = pspell_suggest ($pspell_link , $singleWord);
		
		$result = array();
		$result['word'] = $singleWord;
		$result['suggestions'] = $suggestions;
		$results[] = $result;
	}
}

echo json_encode($results);
?>