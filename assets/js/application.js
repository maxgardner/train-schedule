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

function addTrain(trainName, destination, firstTrain, frequency) {
	trainData.push({
		trainName: trainName,
		destination: destination,
		firstTrain: firstTrain,
		frequency: frequency
	});
}

function calcArrival(time, frequency) {
	var currentTime = (moment().hour() * 60) + moment().minute();
	var originalTime = time.split(":");
	var timeToCompare = originalTime.reduce(function(a, b) { return parseInt(a) * 60 + parseInt(b); });
	var timeDifference = currentTime - timeToCompare;
	var timeToNextTrain;
	return frequency - (timeDifference % parseInt(frequency));
}

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
	} else if (time[0] < 10) {
		standardTime[0] = standardTime[0].slice(1);
		standardTime = standardTime.join(":");
		standardTime += " AM";
	}
	return standardTime;
}

$(document).on("click", "#new-train", function(event) {
	event.preventDefault();
	var trainName = $("#train-name").val().trim();
	var destination = $("#destination").val().trim();
	var firstTrain = $("#first-train").val().trim();
	var frequency = $("#frequency").val().trim();
	var $newRow = $("<tr/>");
	var $newName = $("<th/>").attr("scope", "row").text(trainName).appendTo($newRow);
	var $newDestination = $("<td/>").text(destination).appendTo($newRow);
	var $newFirstTime = $("<td/>").text(firstTrainToStandard(firstTrain)).appendTo($newRow);
	var $newArrival = $("<td/>").text(calcArrival(firstTrain, frequency) + " min").appendTo($newRow);
	$("#train-table").append($newRow);

	addTrain(trainName, destination, firstTrain, frequency);
});