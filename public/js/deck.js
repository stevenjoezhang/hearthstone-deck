(function() {
	var deckTitleInputEl = document.getElementById("deck-title-input");
	var newTitle = deckTitleInputEl.value;
	deckTitleInputEl.addEventListener("change", function(e) {
		if (!e) e = window.event;
		newTitle = e.target.value;
		var deckTitle = encodeURIComponent((newTitle || "").trim());
		var deckCode = deckTitleInputEl.dataset.deckcode;
		window.location.href = `${window.location.protocol}//${window.location.host}/deck/?name=${deckTitle}&code=${deckCode}`;
	}, false);
	var deckEntries = document.querySelectorAll(".deck-entry");

	function showPreviewCard(card) {
		return function() {
			card.style.display = "block";
		}
	}

	function hidePreviewCard(card) {
		return function() {
			card.style.display = "none";
		}
	}
	for (var i = 0; i < deckEntries.length; i++) {
		var card = deckEntries[i].querySelector(".preview-card");
		deckEntries[i].addEventListener("mouseover", showPreviewCard(card));
		deckEntries[i].addEventListener("mouseout", hidePreviewCard(card));
	}
})();
