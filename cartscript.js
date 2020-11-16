
function createCookie(name, value, days) {
	var expires = "";
	if (days > 0) {
		var date = new Date();
		date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
		expires = "; expires=" + date.toGMTString();
	}
	document.cookie = name + "=" + value + expires + "; SameSite=Lax; path=/";
}

function readCookie(name) {
	var nameEQ = name + "=";
	var ca = document.cookie.split(';');
	for (var i = 0; i < ca.length; i++) {
		var c = ca[i];
		while (c.charAt(0) == ' ') c = c.substring(1, c.length);
		if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
	}
	return null;
}

function eraseCookie(name) {
	document.cookie = name + "= 0; expires = Thu, 01 Jan 1970 00:00:00 GMT; path=/";
}

function addToCart(productId) {
	var oldval = readCookie(productId);
	if (oldval === null) {
		oldval = 0;
	}
	createCookie(productId, parseInt(oldval) + 1, 1);
}

function addToCartWithMessage(productId) {
	addToCart(productId);
	$(function () {
		$("#cart_alert").fadeIn(300).delay(1500).fadeOut(400);
	});
}

function increaseCartQty(productId) {
	var qtyPointer = document.getElementById('quantity' + productId);
	addToCart(productId);
	qtyPointer.value = readCookie(productId);
}

function reduceCartQty(productId) {
	var qtyPointer = document.getElementById('quantity' + productId);
	var oldval = parseInt(readCookie(productId));
	if (oldval < 2 || isNaN(oldval) ){
		reduceCartQtyTo0(productId);
	}
	else {
		createCookie(productId, oldval - 1, 1);
		qtyPointer.value = readCookie(productId);
	}
	
}

function reduceCartQtyTo0(productId) {
	var qtyPointer = document.getElementById('quantity' + productId);
	qtyPointer.value = 0;
	eraseCookie(productId);
}

function updateCartQty(productId) {
	var qtyPointer = document.getElementById('quantity' + productId);
	var newval = parseInt(qtyPointer.value);
	if (isNaN(newval)) {
		alert("Must enter a valid number")
	}
	else if (newval > 0) {
		createCookie(productId, newval, 1);
	}
	else if (newval === 0) {
		reduceCartQtyTo0(productId);
	}
	else {
		alert("Must enter a positive number")
    }

}