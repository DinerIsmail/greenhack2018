$(document).ready(function () {
	var config = {
		apiKey: "AIzaSyBsAQ3RHmTCPNI4k94dl3o1Qoyv_MYTiQg",
		authDomain: "lifespanner-b62e1.firebaseapp.com",
		databaseURL: "https://lifespanner-b62e1.firebaseio.com",
		storageBucket: "<BUCKET>.appspot.com",
		messagingSenderId: "<SENDER_ID>",
	};
	firebase.initializeApp(config);
	var database = firebase.database();

	$("[name=submit]").click(function(event) {
		event.preventDefault();
		var successLabel = document.getElementById('success-message');

		var asinCode = $('[name=asin]').val();
		var option = $('[name=typ2]:checked').val();
		var lifespan;
		if (option == 'dates') {
			var dateFrom = new Date($('[name=purchase-date]').val());
			var dateTo = new Date($('[name=breakdown-date]').val());
			lifespan = dateTo.getMonth() - dateFrom.getMonth() + (12 * (dateTo.getFullYear() - dateFrom.getFullYear()));
		} else {
			lifespan = $('[name=lifespan-months]').val();
		}
		var rating = $('[name=rating]').val();

		if (!asinCode) {
			return;
		}

		var newReview = {
			lifespan: lifespan,
			rating: rating
		};
		var reviewsRef = database.ref(`/${asinCode}/reviews/`);
		reviewsRef.once("value", function(snapshot) {
			var newReviewIndex = snapshot.numChildren();
			var newReviewRef = database.ref(`/${asinCode}/reviews/${newReviewIndex}/`);
			
			newReviewRef.push();
			newReviewRef.set(newReview);
		});

		successLabel.innerHTML = "Entry submitted succesfully! Thank you for doing your part in helping the environment! ♻️";
	});
});