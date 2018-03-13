
// ===================================< global variables >======================================== //
var currLatLong = [];
var currLat = 0;
var currLong = 0;

var currPosOptions = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0
};

var response = "";

// ======================================< functions >============================================ //
function currPosError(err) {
    console.warn(`ERROR(${err.code}): ${err.message}`);
}

function initMap() { };

//Get geo location result
function processGeolocationResult(position) {
    html5Lat = position.coords.latitude;      //Get latitude
    html5Lon = position.coords.longitude;     //Get longitude
    return (html5Lat).toFixed(8) + ", " + (html5Lon).toFixed(8);
}

function callHikingApi(apiLat, apiLong, distance) {

    var apiKey = "200228428-1f5b2e55867344554f904d9273de0486";

    queryURL = "https://www.hikingproject.com/data/get-trails?lat=" + apiLat +
        "&lon=" + apiLong + "&maxDistance=" + distance + "&key=" + apiKey;
    
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        buildAPIrows(response);
    });
}

function buildAPIrows(response) {
    // this hides the activity selector bar.
    $(".activity-selector").addClass("d-none");
    // dynamically create table div.
    var tblDiv = $("<table>");
    tblDiv.addClass("table-responsive-sm");
    tblDiv.addClass("table");
    $(".data-display-area").append(tblDiv);

    // dynamically create thead div. 
    var theadDiv = $("<thead>");
    $(tblDiv).append(theadDiv);

    // dynamically create table row div.
    var trowDiv = $("<tr>");
    theadDiv.append(trowDiv);

    // dynamically create th rows.
    trowDiv.prepend("<button type='button' class='goto-activity-btn btn btn-sm'>Back");
    trowDiv.append("<th scope='col'><strong>Trail Name</strong></th>");
    trowDiv.append("<th scope='col'><strong>Location</strong></th>");
    trowDiv.append("<th scope='col'><strong>Trail Length (miles)</strong></th>");
    trowDiv.append("<th scope='col'><strong>Difficulty</strong></th>");
    trowDiv.append("<th scope='col'><strong>Stars</strong></th>");
    trowDiv.append("<th scope='col'><strong>Star Votes</strong></th>");

    // dynamically create table row div.
    var tbodyDiv = $("<tbody>");
    tblDiv.append(tbodyDiv);

    // dynamically create table row div.
    var trowDiv = $("<tr>");
    tbodyDiv.append(trowDiv);

    // dynamically create table detail rows. 
    var trail = response.trails;

    for (var i = 0; i < 10; i++) {
        // dynamically create table row div.
        var trowDiv = $("<tr>");
        tbodyDiv.append(trowDiv);
        // dynamically populate the table detail fields. 
        trowDiv.append("<td class='api-detail'>" + trail[i].name);
        trowDiv.append("<td class='api-detail'>" + trail[i].location);
        trowDiv.append("<td class='api-detail'>" + trail[i].length);
        trowDiv.append("<td class='api-detail'>" + trail[i].difficulty);
        trowDiv.append("<td class='api-detail'>" + trail[i].stars);
        trowDiv.append("<td class='api-detail'>" + trail[i].starVotes);

        // Then dynamicaly generating buttons for each movie in the array.
        // This code $("<button>") is all jQuery needs to create the start and end tag. (<button></button>)
        var btnDiv = $("<button>");
        // Adding a class
        trowDiv.prepend("<button type='button' class='trail-btn btn btn-sm' data-id=" + trail[i].id + ">Select");
    }
}




// ======================================< main process >========================================= //

// Initialize Firebase
var config = {
    apiKey: "AIzaSyBlCrv2E_pScDDDWYqj27T4Nr72hLc5Okw",
    authDomain: "test-authentication-march.firebaseapp.com",
    databaseURL: "https://test-authentication-march.firebaseio.com",
    projectId: "test-authentication-march",
    storageBucket: "test-authentication-march.appspot.com",
    messagingSenderId: "1014982371782"
};
firebase.initializeApp(config);

var database = firebase.database();


// On log in btn click - present #myModal2 
$(window).on('load', function(){
    $("#logInBtn").text("LOG IN");
});
$("#logInBtn").on('click', function () {
  $('#myModal2').modal('show');
});

var txtEmail = $("#txtEmail").val().trim();
var txtPassword = $("#txtPassword").val().trim();
var logIn = $("#logIn").val().trim();
var logOut = $("#logOut").val().trim();
var signUp = $("#signUp").val().trim();

// when login button is clicked 
$("#logIn").on("click", function () {
    event.preventDefault();
    $("#logInBtn").text("LOG OUT");
    //grabs email and password input 
    var email = $("#txtEmail").val().trim();
    var pass = $("#txtPassword").val().trim();
    var auth = firebase.auth();
    //Sign in
    var promise = auth.signInWithEmailAndPassword(email, pass);
    if (email, pass) {
        $("#myModal2").modal("hide");
        
    } else {
        alert("Please Log in or register");
        $("#myModal2").modal("show");
    }

    promise.catch(function (error) {
        console.log(error);
    });
});

//add sign up event
$("#signUp").on("click", function () {
    event.preventDefault();
    $("#myModal2").modal("hide");

    //grabs email and password input
    var email = $("#txtEmail").val().trim();
    var pass = $("#txtPassword").val().trim();
    var auth = firebase.auth();
    //Sign in
    var promise = auth.createUserWithEmailAndPassword(email, pass);
    if (email, pass) {
        $("#myModal2").modal("hide");
    } else {
        alert("Please Log in or register");
        $("#myModal2").modal("show");
    }

    promise.catch(function (error) {
        console.log(error);
    });
});

//add realtime listener
firebase.auth().onAuthStateChanged(function (firebaseUser) {
    if (firebaseUser) {
        console.log(firebaseUser);
    } else {
        console.log("not logged in");
    }
});

//retrieves info from the form
$("#updateProfileBtn").on("click", function () {
	event.preventDefault();
    
    var name = $("#inputName").val().trim();
	var email = $("#inputEmail").val().trim();
	var password = $("#inputPassword").val().trim();
	var address = $("#inputAddress").val().trim();
    var address2 = $("#inputAddress2").val().trim();
    var city = $("#inputCity").val().trim();
    var state = $("#inputState").val().trim();
	var zipCode = $("#inputZip").val().trim();


	database.ref().push({
        name: name,
		email: email,
		password: password,
        address: address,
        address2: address2,
        city: city,
        state: state,
        zipCode: zipCode
    });
});
    
    database.ref().on("child_added", function (snapshot) {
        
        var name = snapshot.val().name;
		var email = snapshot.val().email;
		var password = snapshot.val().password;
		var address = snapshot.val().address;
		var address2 = snapshot.val().address2;
		var city = snapshot.val().city;
        var state = snapshot.val().state;
        var zipCode = snapshot.val().zipCode;
		var tr = $("<tr>");
		$("tbody").append(tr);
		tr.append("<td>" + name + "</td>");
		tr.append("<td>" + address + "</td>");
        tr.append("<td>" + city + "</td>");
        tr.append("<td>" + state + "</td>");
        tr.append("<td>" + zipCode + "</td>");


        



    $("#inputName").val("");
    $("#inputEmail").val("");
	$("#inputPassword").val("");
	$("#inputAddress").val("");
	$("#inputAddress2").val("");
    $("#inputCity").val("");
	$("#inputState").val("");
	$("#inputZip").val("");

	return false;
});




//  When user clicks the activity dropdown menu button. 
$(document).on("click", "#activity-btn", function () {
    event.preventDefault();


});

// add 'use current location' button. 
$("#current-loc-btn").on("click", function (event) {
    event.preventDefault();
    // call the HTML Geolocation API to get geographic position of the user. 
    navigator.geolocation.getCurrentPosition(function (currPosition, currPosError, currPosOptions) {
        // get the lat & long values from the currPosition object and store in geoLocResult string.
        geoLocResult = processGeolocationResult(currPosition);
        // split the lat & long string values into the currLatLong array so other functions can use them.
        currLatLong = geoLocResult.split(", ");
        currLat = currLatLong[0];
        currLong = currLatLong[1];
        // only call the Hiking API if the lat & long are populated with values. 
        if (currLat != '' && currLong != '') {
            callHikingApi(currLat, currLong, 50);
        }
    });
});

//  When user clicks a displayed api row. 
$(document).on("click", ".trail-btn", function () {

    trailId = $(this).attr("data-id");
    alert("You have clicked a table row that has trailId " + trailId);
    
});

//  When user clicks the back button on the displayed table. 
$(document).on("click", ".goto-activity-btn", function () {
    $(".activity-selector").removeClass("d-none");
    $(".data-display-area").empty();

});

$('.covervid-video').coverVid(1920, 1080);







