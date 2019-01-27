$(document).ready(function() {
  var config = {
    apiKey: "AIzaSyDukqTbTLHFz8oatPep-rrQxXfvxG24cb0",
    authDomain: "trainschedulerdb-4b829.firebaseapp.com",
    databaseURL: "https://trainschedulerdb-4b829.firebaseio.com",
    projectId: "trainschedulerdb-4b829",
    storageBucket: "trainschedulerdb-4b829.appspot.com",
    messagingSenderId: "528492803595"
  };
  firebase.initializeApp(config);

  var database = firebase.database();

  var trainName;
  var trainDestination;
  var trainTime;
  var trainFrequency;
  var minutesAway;
  var nextArrival;

  $("form").submit(function(event){
    event.preventDefault();

    trainName = $("#name").val().trim();
    trainDestination = $("#destination").val().trim();
    trainTime = $("#time").val().trim();
    console.log(trainTime);
    trainFrequency = $("#frequency").val().trim();

    calculateValues();
  });

  function calculateValues()
  {
    var convertedTime = moment(trainTime,"HH:mm").subtract(1,"years");
    console.log("TIME CONVERTED: "+convertedTime);
    
    var timeDifference = moment().diff(moment(convertedTime),"minutes");
    console.log("DIFFERENCE IN TIME: "+timeDifference);

    var timeRemaining = timeDifference%trainFrequency;
    console.log(timeRemaining);

    minutesAway = trainFrequency-timeRemaining;
    console.log("MINUTES TILL TRAIN: "+minutesAway);

    nextArrival = moment(moment().add(minutesAway,"minutes")).format("HH:mm");
    console.log("ARRIVAL TIME: "+nextArrival);
    
    writeTrainData();
  }

  function writeTrainData() 
  { 
    var newData={
      name: trainName,
      destination: trainDestination,
      frequency: trainFrequency,
      nextArrival: nextArrival,
      minutesAway: minutesAway
    }
    database.ref().push(newData);
  }

  database.ref().on("child_added", function(snapshot) {
    $(".postArea").append("<tr>");
      $(".postArea").append("<td>"+snapshot.val().name+"</td>");
      $(".postArea").append("<td>"+snapshot.val().destination+"</td>");
      $(".postArea").append("<td>"+snapshot.val().frequency+"</td>");
      $(".postArea").append("<td>"+snapshot.val().nextArrival+"</td>");
      $(".postArea").append("<td>"+snapshot.val().minutesAway+"</td>");
    $(".postArea").append("</tr>");
  });

  // Need to write a function to update the times in the display table every minute.
});