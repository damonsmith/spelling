<?php
header('Content-Type: application/json');
$limit = 50;
$count = 0;

$data = json_decode($HTTP_RAW_POST_DATA, true);
$searchTerm = $data['searchTerm'];
$searchType = $data['searchType'];

$results = array();

$file = file('words.noserve');
foreach($file as $line) {
	$line = trim($line);
	
	if ($searchType == "startsWith") {
		if (preg_match('/^' . $data["searchTerm"] . '/', $line)) {
			$results[] = $line;
			$count++;
		}
	}
	else if ($searchType == "endsWith") {
		if (preg_match('/' . $data["searchTerm"] . '$/', $line)) {
			$results[] = $line;
			$count++;
		}
	}
	else {
		if (preg_match('/' . $data["searchTerm"] . '/', $line)) {
			$results[] = $line;
			$count++;
		}
	}
	
	if ($count >= $limit) {
		break;
	}
}

echo json_encode(array_values(array_unique($results)));
?>