// Copyright (c) 2014 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

var config = {
	apiKey: "AIzaSyBsAQ3RHmTCPNI4k94dl3o1Qoyv_MYTiQg",
	authDomain: "lifespanner-b62e1.firebaseapp.com",
	databaseURL: "https://lifespanner-b62e1.firebaseio.com",
	storageBucket: "<BUCKET>.appspot.com",
	messagingSenderId: "<SENDER_ID>",
};
firebase.initializeApp(config);
var database = firebase.database();

/**
 * Get the current URL.
 *
 * @param {function(string)} callback called when the URL of the current tab
 *   is found.
 */
function getCurrentTabUrl(callback) {
	// Query filter to be passed to chrome.tabs.query - see
	// https://developer.chrome.com/extensions/tabs#method-query
	var queryInfo = {
		active: true,
		currentWindow: true
	};

	//chrome.extension.getBackgroundPage().console.log('button was clicked!');

	chrome.tabs.query(queryInfo, (tabs) => {
		// chrome.tabs.query invokes the callback with a list of tabs that match the
		// query. When the popup is opened, there is certainly a window and at least
		// one tab, so we can safely assume that |tabs| is a non-empty array.
		// A window can only have one active tab at a time, so the array consists of
		// exactly one tab.
		var tab = tabs[0];

		// A tab is a plain object that provides information about the tab.
		// See https://developer.chrome.com/extensions/tabs#type-Tab
		var url = tab.url;

		// tab.url is only available if the "activeTab" permission is declared.
		// If you want to see the URL of other tabs (e.g. after removing active:true
		// from |queryInfo|), then the "tabs" permission is required to see their
		// "url" properties.
		console.assert(typeof url == 'string', 'tab.url should be a string');

		callback(url);
	});

	// Most methods of the Chrome extension APIs are asynchronous. This means that
	// you CANNOT do something like this:
	//
	// var url;
	// chrome.tabs.query(queryInfo, (tabs) => {
	//   url = tabs[0].url;
	// });
	// alert(url); // Shows "undefined", because chrome.tabs.query is async.
}

/**
 * Change the background color of the current page.
 *
 * @param {string} color The new background color.
 */
function changeBackgroundColor(color) {
	var script = 'document.body.style.backgroundColor="' + color + '";';
	// See https://developer.chrome.com/extensions/tabs#method-executeScript.
	// chrome.tabs.executeScript allows us to programmatically inject JavaScript
	// into a page. Since we omit the optional first argument "tabId", the script
	// is inserted into the active tab of the current window, which serves as the
	// default.
	chrome.tabs.executeScript({
		code: script
	});
}

/**
 * Gets the saved background color for url.
 *
 * @param {string} url URL whose background color is to be retrieved.
 * @param {function(string)} callback called with the saved background color for
 *     the given url on success, or a falsy value if no color is retrieved.
 */
function getSavedBackgroundColor(url, callback) {
	// See https://developer.chrome.com/apps/storage#type-StorageArea. We check
	// for chrome.runtime.lastError to ensure correctness even when the API call
	// fails.
	chrome.storage.sync.get(url, (items) => {
		callback(chrome.runtime.lastError ? null : items[url]);
	});
}

/**
 * Sets the given background color for url.
 *
 * @param {string} url URL for which background color is to be saved.
 * @param {string} color The background color to be saved.
 */
function saveBackgroundColor(url, color) {
	var items = {};
	items[url] = color;
	// See https://developer.chrome.com/apps/storage#type-StorageArea. We omit the
	// optional callback since we don't need to perform any action once the
	// background color is saved.
	chrome.storage.sync.set(items);
}

var hide = function(el) {
	el.classList.add('is-hidden');
};

var show = function(el) {
	el.classList.remove('is-hidden');
}

function displayProductInformation(product) {
	var lifespans = [], ratings = [];
	product.reviews.forEach(function(review) {
		if (review.lifespan) lifespans.push(review.lifespan);
		if (review.rating) ratings.push(review.rating);
	});
	var avgLifespan = _.round(_.mean(lifespans), 0);
	var avgRating = _.mean(ratings);

	var productInfoLabel = document.getElementById('productInfo');
	productInfoLabel.innerHTML = `
		Average lifespan: <b>${avgLifespan}</b> months<br>
		Average rating: <b>${avgRating}/5</b>`;
}

document.addEventListener('DOMContentLoaded', () => {
	getCurrentTabUrl((url) => {
		var productInfoLabel = document.getElementById('productInfo');
		var statusLabel = document.getElementById('statusLabel');
		var emoji = document.getElementById('emoji');
		var ASIN = null;

		var regex = RegExp("https://www.amazon.co.uk/([\\w-]+/)?(dp|gp/product)/(\\w+/)?(\\w{10})");
		m = url.match(regex);
		if (m) {
			ASIN = m[4];
		} else {
			productInfoLabel.innerHTML = 'Sorry, Lifespanner only works with Amazon for now.';
		}

		if (ASIN) {
			var reviewRef = firebase.database().ref(`${ASIN}/`);
			reviewRef.on('value', function(snapshot) {
				var product = snapshot.val();
				console.log(product);
				if (product) {
					displayProductInformation(product);
					statusLabel.textContent = "We have some useful information about this product."
				} else {
					productInfoLabel.textContent = 'Sorry, but we don\'t have this product in our database yet.'
					show(emoji);
				}
			});
		}
	});
});
