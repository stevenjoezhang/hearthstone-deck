if (window.innerWidth < 900) {
	var scale = window.innerWidth / 900;
	document.getElementById("main").style.transform = `scale(${scale},${scale})`;
}
/*
if (window.top.location.host != "2heng.xin") {
    document.getElementsByTagName("main")[0].remove()
    document.body.innerHTML = "Access Denied<br>This is a private API<br><br>Mashiro @https://2heng.xin";
}
*/
