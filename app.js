// Initialize Firebase
var config = {
  apiKey: "AIzaSyDJ3ZcNfcf-HO-kTATRWLpHjzsjn6hNXyg",
  authDomain: "clickbutton-5c237.firebaseapp.com",
  databaseURL: "https://clickbutton-5c237.firebaseio.com",
  projectId: "clickbutton-5c237",
  storageBucket: "clickbutton-5c237.appspot.com",
  messagingSenderId: "836875445795"
};
firebase.initializeApp(config);

var database = firebase.database();

$("#submitID").on("click", function(event) {
  event.preventDefault();
  var eName = $("#train-name")
    .val()
    .trim();
  var eDest = $("#destination")
    .val()
    .trim();
  var eTime = $("#train-time")
    .val()
    .trim();
  var eFreq = $("#frequency")
    .val()
    .trim();

  $(".form-group input").val(null);

  database.ref().push({
    name: eName,
    dest: eDest,
    time: eTime,
    freq: eFreq,
    dateAdded: firebase.database.ServerValue.TIMESTAMP
  });
});

database.ref().on("child_added", function(childSnapshot) {
  var ftConverted = moment(childSnapshot.val().time, "HH:mm").subtract(
    1,
    "years"
  );
  var currentTime = moment();
  var diffTime = moment().diff(moment(ftConverted), "minutes");
  var tRemainder = diffTime % childSnapshot.val().freq;
  console.log("remainder is" + tRemainder);
  var minAway = childSnapshot.val().freq - tRemainder;
  console.log("minutes away is" + minAway);
  var nextArrival = moment().add(minAway, "minutes");

  $("tbody").append(
    "<tr><td scope='col'>" +
      childSnapshot.val().name +
      "</td><td scope='col'>" +
      childSnapshot.val().dest +
      "</td><td scope='col'>" +
      childSnapshot.val().freq +
      "</td><td scope='col'>" +
      moment(nextArrival).format("hh:mm") +
      "</td><td scope='col'>" +
      minAway +
      "</td></tr>"
  );
});
