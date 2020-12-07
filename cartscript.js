
function createCookie(name, value, days) {
	var expires = "";
	if (days > 0) {
		var date = new Date();
		date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
		expires = "; expires=" + date.toGMTString();
	}
	document.cookie = name + "=" + value + expires + "; SameSite=Lax; path=/";
}

function readCookie(id) {
	var name = id + "=";
	var cooks = document.cookie.split(';');
	for (var i = 0; i < cooks.length; i++) {
		var cookie = cooks[i];
		while (cookie.charAt(0) == ' ') {
			cookie = cookie.substring(1, cookie.length);
		}
		if (cookie.indexOf(name) === 0) {
			return cookie.substring(name.length, cookie.length);
		}
	}
	return null;
}

function eraseCookie(name) {
	document.cookie = name + "= 0; expires = Thu, 01 Jan 1970 00:00:00 GMT; path=/";
}

function addToCart(productId, price, stock) {
	var oldval = readCookie(productId);
	if (oldval === null) {
		oldval = 0;
	}
	var instock = parseInt(stock);
	var newval = parseInt(oldval) + 1;
	if (newval > instock) {
		alert("Unable to add item: only " + instock + " left in stock");
		return false;
    }
	createCookie(productId, newval, 1);
	updateTotal(parsePrice(price));
	return true;
}

function addToCartWithMessage(productId, price, stock) {
	if (addToCart(productId, price, stock)) {
		$(function () {
			$("#cart_alert").fadeIn(300).delay(1500).fadeOut(400);
		});
	}
}

function increaseCartQty(productId, price, stock) {
	console.log(stock);
	var qtyPointer = document.getElementById('quantity' + productId);
	addToCart(productId, price, stock);
	qtyPointer.value = readCookie(productId);
}

function reduceCartQty(productId, price) {
	var qtyPointer = document.getElementById('quantity' + productId);
	var oldval = parseInt(readCookie(productId));
	if (oldval < 2 || isNaN(oldval) ){
		reduceCartQtyTo0(productId, price);
	}
	else {
		createCookie(productId, oldval - 1, 1);
		qtyPointer.value = readCookie(productId);
		updateTotal(0 - parsePrice(price));
	}
}

function reduceCartQtyTo0(productId, price) {
	var qtyPointer = document.getElementById('quantity' + productId);
	qtyPointer.value = 0;
	var qty = readCookie(productId);
	eraseCookie(productId);
	updateTotal(0 - (qty * parsePrice(price)));
}

function updateCartQty(productId, price, stock) {
	var qtyPointer = document.getElementById('quantity' + productId);
	var newval = parseInt(qtyPointer.value);
	var oldval = readCookie(productId);
	if (isNaN(newval)) {
		alert("Must enter a valid number");
	}
	else if (newval > 0) {
		if (newval > parseInt(stock)) {
			alert("Unable to add item(s): only " + stock + " left in stock");
			qtyPointer.value = oldval;
			return false;
        }
		createCookie(productId, newval, 1);
		updateTotal((newval - oldval)*parsePrice(price));
	}
	else if (newval === 0) {
		reduceCartQtyTo0(productId);
	}
	else {
		alert("Must enter a positive number");
    }

}

function parsePrice(price) {
	var p = price.substring(1);
	return parseFloat(p);
}

function getOldTotal() {
	var oldTotal = parseFloat(readCookie("total"));
	if (oldTotal === null || isNaN(oldTotal)) {
		return 0;
	}
	return oldTotal;
}

function updateTotal(price) {
	var newTotal = parseFloat(getOldTotal()) + parseFloat(price);
	if (newTotal < 0.1){
		newTotal = 0;
    }
	createCookie("total", newTotal.toFixed(2), 1);
	if (document.getElementById("totalDisplay") != null) {
		document.getElementById("totalDisplay").innerHTML = newTotal.toFixed(2);
		if (newTotal < 0.1) {
			$(function () {
				$('#totalBar').hide();
			});
		}
		else {
			$(function () {
				$('#totalBar').show();
			});
        }

	}
}

function populateModal() {
	document.getElementById("checkoutPrice").innerHTML = document.getElementById("totalDisplay").innerHTML
}

function updateStock() {
	var cooks = document.cookie.split(';');
	for (var i = 0; i < cooks.length; i++) {
		var cookie = cooks[i].split('=');
		var id = cookie[0];
		var bought = cookie[1]
		if (Number.isInteger(id)){ }
		if (!(bought === null)) {
			$.ajax({
				'async': 'false',
				'url': 'qtyupdate.php',
				'type': 'POST',
				'data': { "id": id, "bought": bought },
				'datatype': 'html'
			});
			eraseCookie(id);
		}
	}
	eraseCookie("total");
	window.location.replace('./thankyou.html');
}
