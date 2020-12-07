
//Adds 24-hour cookie to store cart quantities and total price
function createCookie(id, value) {
	var date = new Date();
	date.setTime(date.getTime() + (24 * 60 * 60 * 1000));
	var expires = "; expires=" + date.toGMTString();
	document.cookie = id + "=" + value + expires + "; SameSite=Lax; path=/";
}

//gets a cookie's value based on its id.
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

//destroys a cookie
function eraseCookie(name) {
	document.cookie = name + "= 0; expires = Thu, 01 Jan 1970 00:00:00 GMT; path=/";
}

//adds item to cart in stock, updates total price
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
	createCookie(productId, newval);
	updateTotal(parsePrice(price));
	return true;
}

//displays "item added to cart!"
function addToCartWithMessage(productId, price, stock) {
	if (addToCart(productId, price, stock)) {
		$(function () {
			$("#cart_alert").fadeIn(300).delay(1500).fadeOut(400);
		});
	}
}

// for + button
function increaseCartQty(productId, price, stock) {
	var qtyPointer = document.getElementById('quantity' + productId);
	addToCart(productId, price, stock);
	qtyPointer.value = readCookie(productId);
}

//for - button
function reduceCartQty(productId, price) {
	var qtyPointer = document.getElementById('quantity' + productId);
	var oldval = parseInt(readCookie(productId));
	if (oldval < 2 || isNaN(oldval) ){
		reduceCartQtyTo0(productId, price);
	}
	else {
		createCookie(productId, oldval - 1);
		qtyPointer.value = readCookie(productId);
		updateTotal(0 - parsePrice(price));
	}
}

//for remove all button
function reduceCartQtyTo0(productId, price) {
	var qtyPointer = document.getElementById('quantity' + productId);
	qtyPointer.value = 0;
	var qty = readCookie(productId);
	eraseCookie(productId);
	updateTotal(0 - (qty * parsePrice(price)));
}

//for update button
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
		createCookie(productId, newval);
		updateTotal((newval - oldval)*parsePrice(price));
	}
	else if (newval === 0) {
		reduceCartQtyTo0(productId, price);
	}
	else {
		alert("Must enter a positive number");
    }

}

//removes dollar sign
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

//calculates and displays price on cartpage. Hides checkout bar if price = 0
function updateTotal(price) {
	var newTotal = parseFloat(getOldTotal()) + parseFloat(price);
	if (newTotal < 0.1){
		newTotal = 0;
    }
	createCookie("total", newTotal.toFixed(2));
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

//diplays total price in modal button
function populateModal() {
	document.getElementById("checkoutPrice").innerHTML = document.getElementById("totalDisplay").innerHTML
}

//call php script to remove purchased items from MySQL database. Resets all product cookies.
function updateStock() {
	console.log("calld")
	var cooks = document.cookie.split(';');
	for (var i = 0; i < cooks.length; i++) {
		var cookie = cooks[i].split('=');
		var id = parseInt(cookie[0]);
		var bought = parseInt(cookie[1]);
		if (Number.isInteger(id)) { 
			if (!(bought === null || isNaN(bought))) {
				$.ajax({
					'async': 'false',
					'url': 'qtyupdate.php',
					'type': 'POST',
					'data': { "id": id, "bought": bought },
					'datatype': 'html',
					'success': function (data) {
						console.log(data);
					}
				});
				eraseCookie(id);
			}
		}
	}
	eraseCookie("total");
}

function openThank() {
	window.location.replace('./thankyou.html');
}