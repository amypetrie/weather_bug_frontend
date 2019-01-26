/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

	"use strict";

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var getWeatherButton = document.getElementById("submitLocation");
	var weatherInput = document.getElementById("locationSearchInput");
	var apiUrl = "https://weather-bug.herokuapp.com/";
	// var apiUrl = "http://localhost:3000/";
	var apiResponse = null;
	var weatherForecastObj = null;
	var userApiKey = null;
	var userFavoritesObj = null;
	var favDropDownLink = document.getElementById("dropDownFavs");

	window.onload = setUserVariabes();

	var WeatherForecast = function WeatherForecast(weatherData) {
	  _classCallCheck(this, WeatherForecast);

	  // box one
	  this.locationName = weatherData["attributes"]["location_description"]["formattedAddress"];
	  this.shortDescription = weatherData["attributes"]["daily_forecast"]["current_summary"];
	  this.currentTemp = weatherData["attributes"]["daily_forecast"]["current_temp"];
	  this.currentHigh = weatherData["attributes"]["daily_forecast"]["temperature_high"];
	  this.currentLow = weatherData["attributes"]["daily_forecast"]["temperature_low"];
	  this.currentTime = weatherData["attributes"]["daily_forecast"]["time"];
	  // box two
	  this.feelsLike = weatherData["attributes"]["daily_forecast"]["feels_like_temp"];
	  this.humidity = weatherData["attributes"]["daily_forecast"]["humidity"];
	  this.visibility = weatherData["attributes"]["daily_forecast"]["visibility"];
	  this.uvIndex = weatherData["attributes"]["daily_forecast"]["uv_index"];
	  this.longDescription = weatherData["attributes"]["daily_forecast"]["daily_summary"];
	};

	var UserFavorites = function UserFavorites(favorites) {
	  _classCallCheck(this, UserFavorites);

	  this.favoriteLocations = favorites;
	};

	function setUserVariabes() {
	  getUserApiKey();
	  getUserFavorites(userApiKey, displayFavorites);
	}

	function getUserApiKey() {
	  userApiKey = "467cb9044730c0d11fb4ebd511a9";
	}

	function displayFavorites() {
	  //   var favDropDown = document.getElementById("dropdown");
	  var locations = userFavoritesObj.favoriteLocations;
	  locations.forEach(function (e) {
	    var name = e["attributes"]["location"];
	    // var favOption = document.createElement('option');
	    // favOption.text = `${name}`;
	    // favOption.value = `${name}`;
	    var favDropDown = document.getElementById("menuFavs");
	    var newFav = document.createElement("li");
	    var favText = document.createTextNode("" + name);

	    newFav.appendChild(favText);
	    document.getElementById("menuFavs").appendChild(newFav);

	    // var addDropDownItem = function( txt ) {
	    //   favDropDown.appendChild( '<li>' + txt + '</li>' );
	    // };
	    // addDropDownItem(name);
	  });
	}

	// function AddItem()
	// {
	//     // Create an Option object
	//     var opt = document.createElement("option");
	//
	//     // Assign text and value to Option object
	//     opt.text = "New Value";
	//     opt.value = "New Value";
	//
	//     // Add an Option object to Drop Down List Box
	//     document.getElementById('<%=DropDownList.ClientID%>').options.add(opt);
	// }

	function getUserFavorites(api_key, callback) {
	  var requestUrl = "" + apiUrl + "api/v1/favorites";
	  var requestResponse = $.ajax({ url: "" + requestUrl,
	    type: 'get',
	    contentType: 'application/json',
	    data: { api_key: "" + userApiKey },
	    dataType: 'json',
	    success: function success(res) {
	      userFavoritesObj = new UserFavorites(res["data"]);
	      callback();
	    },
	    error: function error(res) {
	      userFavoritesObj = "Error";
	    }
	  });
	}

	function processWeatherRequest() {
	  var formattedLocation = weatherInput.value;
	  var requestUrl = "" + apiUrl + "api/v1/forecast?location=" + formattedLocation;
	  var requestResponse = $.ajax({ url: "" + requestUrl,
	    type: 'get',
	    success: function success(res) {
	      apiResponse = res["data"];
	      weatherForecastObj = new WeatherForecast(apiResponse);
	      displayBoxOne();
	      displayBoxTwo();
	    },
	    error: function error(res) {
	      apiResponse = "Error";
	    }
	  });
	}

	function displayBoxOne() {
	  displayDateTime();
	  document.getElementById("locationName").innerHTML = "" + weatherForecastObj.locationName;
	  document.getElementById("currentTemp").innerHTML = "Current Temperature: " + weatherForecastObj.currentTemp + " degrees";
	  document.getElementById("shortWeatherBlurb").innerHTML = "Right Now: " + weatherForecastObj.shortDescription;
	  document.getElementById("currentTempHigh").innerHTML = "Temperature High: " + weatherForecastObj.currentHigh + " degrees";
	  document.getElementById("currentTempLow").innerHTML = "Temperature Low: " + weatherForecastObj.currentLow + " degrees";
	}

	function displayBoxTwo() {
	  document.getElementById("longWeatherBlurb").innerHTML = "Today: " + weatherForecastObj.longDescription;
	  document.getElementById("feelsLike").innerHTML = "Feels Like: " + weatherForecastObj.feelsLike + " degrees";
	  document.getElementById("humidity").innerHTML = "Humidity: " + weatherForecastObj.humidity + "%";
	  document.getElementById("Visibility").innerHTML = "Visibility: " + weatherForecastObj.visibility + " mi.";
	  document.getElementById("uvIndex").innerHTML = "UV Index: " + weatherForecastObj.uvIndex;
	}

	function displayBoxThree() {
	  displayNextHours();
	  displayNextDays();
	}

	function displayNextHours() {}

	function displayDateTime() {
	  // need to edit this to format unix time returned by DarkSky
	  document.getElementById("currentTime").innerHTML = "Current Date and Time: " + weatherForecastObj.currentTime;
	}

	getWeatherButton.addEventListener("click", function () {
	  processWeatherRequest();
	});

	// $('body').on('mouseover mouseout', '.dropdown', function(e) {
	//     $(e.target).dropdown('toggle');
	// });

	favDropDownLink.addEventListener("click", function (event) {
	  document.getElementById("menuFavs").classList.toggle('drop');
	});
	// reset after a short delay
	// setTimeout(function() {
	//   event.target.style.color = "";
	// }, 500);

/***/ })
/******/ ]);