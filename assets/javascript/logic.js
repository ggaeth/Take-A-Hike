// ===================================< global variables >======================================== //
var currLatLong = [];
var currLat = 0;
var currLong = 0;
 
var currPosOptions = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0
};
 
var btnActivity = "";
var btnDistance = "";
var zipCode = "";
var zipJsonData = "";
var zipJsonLat = "";
var zipJsonLong = "";
 
var response = "";
var apiObject = {};
 
var trailId = "";
 
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
 
function getLatLongFromZip(zipInput) {
 
    var zipApiKey = "jO6Qt8toUAFBDMN6qwx2F4vYeB03vgd0PhTWwLXTf6o7n3U8nNHmlSE6POCUZIjE";
    // Build url
    var zipApiUrl = "https://www.zipcodeapi.com/rest/" + zipApiKey + "/info.json/" + zipInput + "/degrees";
 
    // Make AJAX request
    $.ajax({
        "url": zipApiUrl,
        method: "GET"
    }).then(function (zipJsonData) {
        zipJsonLat = parseFloat(zipJsonData.lat).toFixed(8);
        zipJsonLong = parseFloat(zipJsonData.lng).toFixed(8);
 
        // call the prepareApiCall function
        prepareApiCall(btnActivity, btnDistance, zipJsonLat, zipJsonLong);
    });
}
 
function prepareApiCall(btnActivity, btnDistance, apiLat, apiLong) {
    var lat = apiLat;
    var long = apiLong;
 
    if (btnActivity === "") {
        // send a back button and an error message back to user.
        $(".activity-selector").addClass("d-none");
        var tblDiv = $("<table>");
        tblDiv.addClass("table-responsive-sm");
        tblDiv.addClass("table");
        $(".data-display-area").append(tblDiv);
        var theadDiv = $("<thead>");
        $(tblDiv).append(theadDiv);
        var trowDiv = $("<tr>");
        theadDiv.append(trowDiv);
        trowDiv.prepend("<button type='button' class='goto-activity-btn btn btn-sm'>Back");
        trowDiv.append("<td class='api-detail text-left align-middle'><pre class='mb-0'><h6 class='mb-0'>No Activity was selected !<br><em>Please resubmit a search that specifies an Activity, a Miles Away, a Current Location or a 5 digit Zip Code.</em></pre></td>");
    }
    else if (btnDistance === "") {
        // // send a back button and an error message back to user.
        $(".activity-selector").addClass("d-none");
        var tblDiv = $("<table>");
        tblDiv.addClass("table-responsive-sm");
        tblDiv.addClass("table");
        $(".data-display-area").append(tblDiv);
        var theadDiv = $("<thead>");
        $(tblDiv).append(theadDiv);
        var trowDiv = $("<tr>");
        theadDiv.append(trowDiv);
        trowDiv.prepend("<button type='button' class='goto-activity-btn btn btn-sm'>Back");
        trowDiv.append("<td class='api-detail text-left align-middle'><pre class='mb-0'><h6 class='mb-0'>No Miles Away was selected !<br><em>Please resubmit a search that specifies an Activity, a Miles Away, a Current Location or a 5 digit Zip Code.</em></pre></td>");
    }
    else if (lat === '' || long === '') {
        // // send a back button and an error message back to user.
        $(".activity-selector").addClass("d-none");
        var tblDiv = $("<table>");
        tblDiv.addClass("table-responsive-sm");
        tblDiv.addClass("table");
        $(".data-display-area").append(tblDiv);
        var theadDiv = $("<thead>");
        $(tblDiv).append(theadDiv);
        var trowDiv = $("<tr>");
        theadDiv.append(trowDiv);
        trowDiv.prepend("<button type='button' class='goto-activity-btn btn btn-sm'>Back");
        trowDiv.append("<td class='api-detail text-left align-middle'><pre class='mb-0'><h6 class='mb-0'>A problem was encountered while trying to locate your entered position.<br><em>Please resubmit a search that specifies an Activity, a Miles Away, a Current Location or a 5 digit Zip Code.</em></pre></td>");
    }
    else {
        // call an api based on the activity button selected.
        switch (btnActivity) {
            case "Hiking":
                callHikingApi(lat, long, btnDistance);
                break;
            case "Mountain Biking":
                callMtnBikingApi(lat, long, btnDistance)
                break;
            case "Skiing":
                callSkiingApi(lat, long, btnDistance);
                break;

        }
    }
}
 
function callHikingApi(hikingLat, hikingLong, apiDistance) {
 
    var apiKey = "200228428-1f5b2e55867344554f904d9273de0486";
 
    queryURL = "https://www.hikingproject.com/data/get-trails?lat=" + hikingLat +
        "&lon=" + hikingLong + "&maxDistance=" + apiDistance + "&key=" + apiKey;
 
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        apiObject = new buildAPIrows(response);
    });
}
 
function callMtnBikingApi(mtnbikingLat, mtnbikingLong, apiDistance) {
 
    var apiKey = "200228428-1f5b2e55867344554f904d9273de0486";
 
    queryURL = "https://www.mtbproject.com/data/get-trails?lat=" + mtnbikingLat +
        "&lon=" + mtnbikingLong + "&maxDistance=" + apiDistance + "&key=" + apiKey;
 
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        apiObject = new buildAPIrows(response);
    });
}
 
function callSkiingApi(skiingLat, skiingLong, apiDistance) {
 
    var apiKey = "200228428-1f5b2e55867344554f904d9273de0486";
 
    queryURL = "https://www.powderproject.com/data/get-trails?lat=" + skiingLat +
        "&lon=" + skiingLong + "&maxDistance=" + apiDistance + "&key=" + apiKey;
 
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        apiObject = new buildAPIrows(response);
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
 
    if (response.trails.length === 0) {
        // send a back button and a no trails found message to user.
        trowDiv.prepend("<button type='button' class='goto-activity-btn btn btn-sm'>Back");
        trowDiv.append("<td class='api-detail text-left align-middle'><pre class='mb-0'><h6 class='mb-0' >Sorry ! No trails were found for the specified Miles Away.<em>    Use the Back button to return to the previous screen.</em></h6></pre></td>");
    }
    else {
        // dynamically create the table header row.
        trowDiv.prepend("<button type='button' class='goto-activity-btn btn btn-sm'>Back");
        trowDiv.append("<th scope='col'><strong>Trail Name</strong></th>");
        trowDiv.append("<th scope='col'><strong>Location</strong></th>");
        trowDiv.append("<th scope='col'><strong>Trail Length (miles)</strong></th>");
        trowDiv.append("<th scope='col'><strong>Difficulty</strong></th>");
        trowDiv.append("<th scope='col'><strong>Stars</strong></th>");
        trowDiv.append("<th scope='col'><strong>Star Votes</strong></th>");
 
        // dynamically create table body div.
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
 
            var btnDiv = $("<button>");
            // Adding a class
            trowDiv.prepend("<button type='button' class='trail-btn btn btn-sm' data-id=" + trail[i].id + ">Select");
        }
    }
    return response;
}
 
function buildClimbAPIrows(response) {
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
 
    if (response.routes.length === 0) {
        // send a back button and a no trails found message to user.
        trowDiv.prepend("<button type='button' class='goto-activity-btn btn btn-sm'>Back");
        trowDiv.append("<td class='api-detail text-left align-middle'><pre class='mb-0'><h6 class='mb-0' >Sorry ! No trails were found for the specified Miles Away.<em>    Use the Back button to return to the previous screen.</em></h6></pre></td>");
    }
    else {
        // dynamically create the table header row.
        trowDiv.prepend("<button type='button' class='goto-activity-btn btn btn-sm'>Back");
        trowDiv.append("<th scope='col'><strong>Route Name</strong></th>");
        trowDiv.append("<th scope='col'><strong>Location</strong></th>");
        trowDiv.append("<th scope='col'><strong>Pitches</strong></th>");
        trowDiv.append("<th scope='col'><strong>Difficulty</strong></th>");
        trowDiv.append("<th scope='col'><strong>Stars</strong></th>");
        trowDiv.append("<th scope='col'><strong>Star Votes</strong></th>");
 
        // dynamically create table body div.
        var tbodyDiv = $("<tbody>");
        tblDiv.append(tbodyDiv);
 
        // dynamically create table row div.
        var trowDiv = $("<tr>");
        tbodyDiv.append(trowDiv);
 
        // dynamically create table detail rows.
        var route = response.routes;
 
        for (var i = 0; i < 10; i++) {
            // dynamically create table row div.
            var trowDiv = $("<tr>");
            tbodyDiv.append(trowDiv);
            // dynamically populate the table detail fields.
            trowDiv.append("<td class='api-detail'>" + route[i].name);
            trowDiv.append("<td class='api-detail'>" + route[i].location[1] + ", " + route[i].location[0]);
            trowDiv.append("<td class='api-detail'>" + route[i].pitches);
            trowDiv.append("<td class='api-detail'>" + route[i].rating);
            trowDiv.append("<td class='api-detail'>" + route[i].stars);
            trowDiv.append("<td class='api-detail'>" + route[i].starVotes);
 
            var btnDiv = $("<button>");
            // Adding a class
            trowDiv.prepend("<button type='button' class='trail-btn btn btn-sm' data-id=" + route[i].id + ">Select");
        }
    }
    return response;
}
 
//map functions
function trailWidget(trailById) {
    $('<iframe>', {
        src: 'https://www.hikingproject.com/widget?v=3&map=1&type=trail&id=' + trailId,
        id: 'myFrame',
        frameborder: 0,
        scrolling: 'no',
        height: '410px'
    }).appendTo('#map');
}
 
//map functions
function hikingMapWidget(trailId) {
    $('<iframe>', {
        src: 'https://www.hikingproject.com/widget?v=3&map=1&type=trail&id=' + trailId,
        id: 'myFrame',
        frameborder: 0,
        scrolling: 'no',
        height: '410px'
    }).appendTo('#map');
}
 
//map functions
function mtnBikingMapWidget(trailId) {
    $('<iframe>', {
        src: 'https://www.mtbproject.com/widget?v=3&map=1&type=trail&id=' + trailId,
        id: 'myFrame',
        frameborder: 0,
        scrolling: 'no',
        height: '410px'
    }).appendTo('#map');
}
 
//map functions
function skiingMapWidget(trailId) {
    $('<iframe>', {
        src: 'https://www.powderproject.com/widget?v=3&map=1&type=trail&id=' + trailId,
        id: 'myFrame',
        frameborder: 0,
        scrolling: 'no',
        height: '410px'
    }).appendTo('#map');
}
 

 
function buildTrailInfo(trailId, apiObject) {
 
    $(".data-display-area").addClass("d-none");
 
    var apiTrails = apiObject.trails;
 
    for (var i = 0; i < apiTrails.length; i++) {
 
        console.log("apiObject trail-id is " + apiTrails[i].id + "   passed trailId is " + trailId);
 
        if (apiTrails[i].id == trailId) {
            console.log("apiTrails id matches passed trailId !");
 
            var trailIdDiv = $("<div id='trail-info'>");
           
            $(".trail-id-display").append(trailIdDiv);
 
            var trailDiv = $("<div class='trail'>");
 
            trailDiv.append("<h2>" + apiTrails[i].name);
            trailDiv.append("<p>Location: " + apiTrails[i].location);
           // trailDiv.append("<p>Difficulty: " + apiTrails[i].difficulty);
           // trailDiv.append("<p>Length: " + apiTrails[i].length + " Miles");
            trailDiv.append("<p>Elevation:  High-" + apiTrails[i].high + " ft" + " " + "Low-" + apiTrails[i].low + " ft");
           
            trailDiv.append("<p>Summary: " + apiTrails[i].summary);
            trailIdDiv.append(trailDiv);
        }
    }
    trailDiv.append("<button type='button' class='goto-api-rows-btn btn btn-sm'>Back");
 
    var centerDiv = $("<div>");
    trailIdDiv.append(centerDiv);
    centerDiv.attr("align-center");
    var mapIdDiv = $("<div id='map'>");
    centerDiv.append(mapIdDiv);
    switch (btnActivity) {
        case "Hiking":
            hikingMapWidget(trailId);
            break;
        case "Mountain Biking":
            mtnBikingMapWidget(trailId)
            break;
        case "Skiing":
            skiingMapWidget(trailId);
            break;
    }
}
 
function buildRouteInfo(trailId, apiObject) {
 
    $(".data-display-area").addClass("d-none");
 
    var apiRoutes = apiObject.routes;
 
    for (var i = 0; i < apiRoutes.length; i++) {
 
        console.log("apiObject route-id is " + apiRoutes[i].id + "   passed trailId is " + trailId);
 
        if (apiRoutes[i].id == trailId) {
            console.log("apiRoutes id matches passed trailId !");
 
            var routeIdDiv = $("<div id='route-info'>");
 
            $(".trail-id-display").append(routeIdDiv);
 
            var routeDiv = $("<div class='route'>");
 
            routeDiv.append("<h1>" + apiRoutes[i].name);
            routeDiv.append("<p>Location: " + apiRoutes[i].location[1] + ", " +  apiRoutes[i].location[0]);
            routeDiv.append("<p>Difficulty: " + apiRoutes[i].rating);
            routeDiv.append("<p>Pitches: " + apiRoutes[i].pitches + "  (Nbr of full length rope climbs)");
           
            routeIdDiv.append(routeDiv);
        }
    }
    routeDiv.append("<button type='button' class='goto-api-rows-btn btn btn-sm'>Back");
 
    var centerDiv = $("<div>");
    routeIdDiv.append(centerDiv);
    centerDiv.attr("align-center");
    var mapIdDiv = $("<div id='map'>");
    centerDiv.append(mapIdDiv);
}
 
function dynamicButtons() {
    var div = $('<div />', { 'data-role': 'fieldcontain' }),
        btn = $('<input />', {
            type: 'button',
            value: 'Go Back!',
            id: 'btn_a',
            on: {
                click: function () {
                    //alert ( this.value );
                    $(".data-display-area").removeClass("d-none");
                    $(".trail-id-display").empty();
                    console.log("trail-id-disp");
                    $("#buttons").empty();
 
                }
            }
        });
 
    div.append(btn).appendTo($('#buttons'));
}
 
function callTrailById(trailId) {
    console.log("entering");
 
    var apiKey = "200228428-1f5b2e55867344554f904d9273de0486";
    queryURL = "https://www.hikingproject.com/data/get-trails-by-id?ids=" + trailId + "&key=" + apiKey;
    console.log(queryURL);
    $.ajax({
        url: queryURL,
        method: "GET"
    })
        .then(function (trailById) {
 
            trailInfo(trailById);
            trailWidget(trailById);
            dynamicButtons();
 
        });
    console.log("leaving");
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
$(window).on('load', function () {
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
$(document).on("click", ".activity-btn", function () {
    event.preventDefault();
    btnActivity = $(this).text();
});
 
//  When user clicks the miles-away dropdown menu button.
$(document).on("click", ".distance-btn", function () {
    event.preventDefault();
    btnDistance = $(this).text();
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
        // only call the API if buttons are populated with values.
        prepareApiCall(btnActivity, btnDistance, currLat, currLong);
    });
});
 
// when user entered a numeric zip code and clicked submit button.
$("#zip-code-submit-btn").on("click", function (event) {
    event.preventDefault();
    zipCode = $("#zip-code-input").val().trim();
    $("#zip-code-input").val("");
 
    if (zipCode !== "") {
        getLatLongFromZip(zipCode);
    }
});
 
//  When user clicks a displayed api row.
$(document).on("click", ".trail-btn", function () {
    //alert("trail-btn clicked");
    trailId = $(this).attr("data-id");
    console.log(trailId);
    //callTrailById(trailId);
    if (btnActivity == "Mountain Climbing") {
        buildRouteInfo(trailId, apiObject);
    }
    else {
    buildTrailInfo(trailId, apiObject);
    }
 
});
 
//  When user clicks the back button on the displayed table.
$(document).on("click", ".goto-activity-btn", function () {
    $(".activity-selector").removeClass("d-none");
    $(".data-display-area").empty();
});
 
//  When user clicks the back button on the displayed table.
$(document).on("click", ".goto-api-rows-btn", function () {
    $(".data-display-area").removeClass("d-none");
    $("#trail-id-display").empty();
    $("#trail-info").remove();
    $("#route-info").remove();
});
 
 
 
$('.covervid-video').coverVid(5000, 7000);

















