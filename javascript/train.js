$(document).ready(function () {

    //Set up firebase

    var config = {
        apiKey: "AIzaSyCe_4ZZj-nMwkda7vOjww01BoKdrB9SCFs",
        authDomain: "train-scheduler-58de3.firebaseapp.com",
        databaseURL: "https://train-scheduler-58de3.firebaseio.com",
        projectId: "train-scheduler-58de3",
        storageBucket: "",
        messagingSenderId: "155510842845",
        appId: "1:155510842845:web:c711f8d60fa69867"
    };

    // Initialize Firebase

    firebase.initializeApp(config);

    var database = firebase.database();

    //Set up variables

    var trainName = "";
    var destination = "";
    var firstTrainTime = "";
    var frequency = 0;

    //Set up onclick function and append data

    $("#submit").on("click", function () {
        event.preventDefault();

        trainName = $("#trainName").val().trim();
        destination = $("#destination").val().trim();
        firstTrainTime = $("#firstTrainTime").val().trim();
        frequency = $("#frequency").val().trim();

        $("#myForm")[0].reset();

        //Send data to firebase

        database.ref().push({
            trainName: trainName,
            destination: destination,
            firstTrainTime: firstTrainTime,
            frequency: frequency,

            dateAdded: firebase.database.ServerValue.TIMESTAMP
        });

    });

    //Use of moment to determine next train and minutes away

    database.ref().on("child_added", function (childSnapShot) {

        var minutesAway;

        var veryFirstTrain = moment(childSnapShot.val().firstTrainTime, "HH:mm").subtract(1, "years");

        //Difference between the current and first train

        var diffTime = moment().diff(moment(veryFirstTrain), "minutes");
        var remainder = diffTime % childSnapShot.val().frequency;

        //Minutes until next train

        var minutesAway = childSnapShot.val().frequency - remainder;

        //Time for next train

        var nextTrain = moment().add(minutesAway, "minutes");
        nextTrain = moment(nextTrain).format("HH:mm");

        $("#add-row").append("<tr><td>" + childSnapShot.val().trainName +
            "</td><td>" + childSnapShot.val().destination +
            "</td><td>" + childSnapShot.val().frequency +
            "</td><td>" + nextTrain +
            "</td><td>" + minutesAway + "</td></tr>");

        // Handle the errors
    }, function (errorObject) {
        console.log("Errors handled: " + errorObject.code);

    });

})



