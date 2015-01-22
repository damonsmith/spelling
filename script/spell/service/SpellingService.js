
var SpellingService = {
};

SpellingService.check = function(text, successHandler, errorHandler) {
	
	SpellingService.send({"text": text}, 'wordsearch/spellcheck.php', successHandler, errorHandler);
};

SpellingService.getExamples = function(searchType, searchTerm, successHandler, errorHandler) {
	
	SpellingService.send({"searchType": searchType, "searchTerm": searchTerm}, 'wordsearch/words.php', successHandler, errorHandler);
	
};

SpellingService.send = function(data, url, successHandler, errorHandler) {
	var params = JSON.stringify(data);
	var req = new XMLHttpRequest();
	req.open("POST", url, true);
	req.addEventListener("load", 
		function(data, status) {successHandler(JSON.parse(req.responseText), status)}, false);
	req.addEventListener("error", function(data, status) {errorHandler(status)}, false);
	req.setRequestHeader("Content-type", "application/json; charset=utf-8");
	req.setRequestHeader("Content-length", params.length);
	req.setRequestHeader("Connection", "close");
	req.send(params);
};

module.exports = SpellingService;
