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

$(document).on("click", "#new-train", function(event) {
	event.preventDefault();
	var trainName = $("#train-name").val().trim();
	var destination = $("#destination").val().trim();
	var firstTrain = $("#first-train").val().trim();
	var frequency = $("#frequency").val().trim();

	console.log(trainName, destination, firstTrain, frequency);
});