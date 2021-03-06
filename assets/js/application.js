// Initialize Firebase

var config = {
	apiKey: "AIzaSyDvzEIy4kinJU_OLcOY8DRBwuxn3NB1OLE",
	authDomain: "train-schedule-80036.firebaseapp.com",
	databaseURL: "https://train-schedule-80036.firebaseio.com",
	storageBucket: "train-schedule-80036.appspot.com",
	messagingSenderId: "496472254162"
};

firebase.initializeApp(config);

var trainData = firebase.database().ref("/trains");
var userData = firebase.database().ref("/users");

// Populate data from database

trainData.on("value", function(snapshot) {
	snapshot.forEach(function(childSnapshot) {
		var childKey = childSnapshot.val();
		displayTrain(childKey.trainName, childKey.destination, childKey.firstTrain, childKey.frequency);
	});
});

// Add train to database

function addTrain(trainName, destination, firstTrain, frequency) {
	trainData.push({
		trainName: trainName,
		destination: destination,
		firstTrain: firstTrain,
		frequency: frequency
	});
}

// Create HTML for the train data

function displayTrain(trainName, destination, firstTrain, frequency) {
	var $newRow = $("<tr/>");
	var $newName = $("<th/>").attr("scope", "row").text(trainName).appendTo($newRow);
	var $newDestination = $("<td/>").text(destination).appendTo($newRow);
	var $newFirstTime = $("<td/>").text(firstTrainToStandard(firstTrain)).appendTo($newRow);
	var $newArrival = $("<td/>").text(calcArrival(firstTrain, frequency) + " min").appendTo($newRow);
	$("#train-table").append($newRow);
}

// Calculate the next arrival time for a train

function calcArrival(time, frequency) {
	var currentTime = (moment().hour() * 60) + moment().minute();
	var originalTime = time.split(":");
	var timeToCompare = originalTime.reduce(function(a, b) { return parseInt(a) * 60 + parseInt(b); });
	var timeDifference = currentTime - timeToCompare;
	var timeToNextTrain;
	return frequency - (timeDifference % parseInt(frequency));
}

// Convert the first train's format to ST to display

function firstTrainToStandard(time) {
	var standardTime = time.split(":");
	if (time[0] > 12) {
		switch(time[0]) {
			case 13:
				time[0] = 1;
				break;
			case 14:
				time[0] = 2;
				break;
			case 15:
				time[0] = 3;
				break;
			case 16:
				time[0] = 4;
				break;
			case 17:
				time[0] = 5;
				break;
			case 18:
				time[0] = 6;
				break;
			case 19:
				time[0] = 7;
				break;
			case 20:
				time[0] = 8;
				break;
			case 21:
				time[0] = 9;
				break;
			case 22:
				time[0] = 10;
				break;
			case 23:
				time[0] = 11;
		}
		standardTime = standardTime.join(":");
		standardTime += " PM";
	} else if (time[0] <= 9) {
		standardTime[0] = standardTime[0].slice(1);
		standardTime = standardTime.join(":");
		standardTime += " AM";
	}
	return standardTime;
}

// Add listener to check if user has logged in/logged out

firebase.auth().onAuthStateChanged(function(user) {
	if (user) {
		// User is signed in
		$("#signIn").modal("hide");
		$("#sign-in-nav").addClass("hide");
		$("#sign-up-nav").addClass("hide");
		$("#sign-out").removeClass("hide");
		$("#add-train").removeClass("hide");
	} else {
		$("#sign-in-nav").removeClass("hide");
		$("#sign-up-nav").removeClass("hide");
		$("#sign-out").addClass("hide");
		$("#add-train").addClass("hide");
	}
})

// Add a new train to the database and front-end when the "Add Train" button is clicked

$(document).on("click", "#new-train", function(event) {
	event.preventDefault();
	var trainName = $("#train-name").val().trim();
	var destination = $("#destination").val().trim();
	var firstTrain = $("#first-train").val().trim();
	var frequency = $("#frequency").val().trim();
	addTrain(trainName, destination, firstTrain, frequency);
});

// Activate modal with "Sign In" button

$(document).on("click", "#sign-in-nav", function() {
	$('#signIn').modal();
	$("#sign-up").addClass("hide");
});

// Activate modal with "Sign Up" button

$(document).on("click", "#sign-up-nav", function() {
	$('#signIn').modal();
	$("#sign-in").addClass("hide");
});

// Sign user in when they fill out form

$(document).on("click", "#sign-in", function() {
	var email = $("#email").val().trim();
	var password = $("#password").val().trim();
	firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
	  // Handle Errors here.
	  var errorCode = error.code;
	  var errorMessage = error.message;
	  console.log(error.code);
	  console.log(error.message);
	});
});

// Sign user up when they fill out form
// NEEDS VALIDATION

$(document).on("click", "#sign-up", function() {
	console.log("it's clicking");
	var email = $("#email").val().trim();
	var password = $("#password").val().trim();
	console.log(email);
	var promise = firebase.auth().createUserWithEmailAndPassword(email, password);
	promise.catch(function(error) {
	  // Handle Errors here.
	  var errorCode = error.code;
	  var errorMessage = error.message;
	  console.log(error.code);
	  console.log(error.message);
	});
});

// Sign user out when they click "Sign Out" button

$(document).on("click", "#sign-out", function() {
	firebase.auth().signOut();
});
