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
	var weatherLocationTimezone = null;
	var userApiKey = null;
	var userFavoritesObj = null;
	var favDropDownLink = document.getElementById("dropDownFavs");
	var favoriteButton = null;

	window.onload = setUserVariabes();

	var WeatherForecast = function WeatherForecast(weatherData) {
	  _classCallCheck(this, WeatherForecast);

	  // box one
	  this.locationName = weatherData["attributes"]["location_description"]["formattedAddress"];
	  this.shortDescription = weatherData["attributes"]["daily_forecast"]["current_summary"];
	  this.currentTemp = weatherData["attributes"]["daily_forecast"]["current_temp"];
	  this.currentHigh = weatherData["attributes"]["daily_forecast"]["temperature_high"];
	  this.currentLow = weatherData["attributes"]["daily_forecast"]["temperature_low"];
	  this.currentTime = weatherData["attributes"]["current_time"];
	  this.timezone = weatherData["attributes"]["timezone"];
	  // box two
	  this.feelsLike = weatherData["attributes"]["daily_forecast"]["feels_like_temp"];
	  this.humidity = weatherData["attributes"]["daily_forecast"]["humidity"];
	  this.visibility = weatherData["attributes"]["daily_forecast"]["visibility"];
	  this.uvIndex = weatherData["attributes"]["daily_forecast"]["uv_index"];
	  this.longDescription = weatherData["attributes"]["daily_forecast"]["daily_summary"];
	  //box three
	  this.nextHours = weatherData["attributes"]["hourly_forecast"];
	  this.nextDays = weatherData["attributes"]["upcoming_forecast"];
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
	  // heroku app
	  userApiKey = "467cb9044730c0d11fb4ebd511a9";

	  //local host
	  // userApiKey = "29fc41e307adf31185a6563bf5bc";
	}

	function displayFavorites() {
	  var locations = userFavoritesObj.favoriteLocations;
	  locations.forEach(function (e) {
	    var name = e["attributes"]["location"];
	    var newFav = document.createElement("li");
	    newFav.innerHTML = "" + name;

	    document.getElementById("menuFavs").appendChild(newFav);
	  });
	}

	function updateFavorites(location_name) {
	  var newFav = document.createElement("li");
	  var addedMsg = document.createElement("span");
	  newFav.innerHTML = "" + location_name;
	  addedMsg.innerHTML = "   " + location_name + " has been added to your Favorites";

	  document.getElementById("menuFavs").appendChild(newFav);
	  document.getElementById("locationName").appendChild(addedMsg);
	}

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

	function processWeatherRequest(callback) {
	  var formattedLocation = weatherInput.value;
	  var requestUrl = "" + apiUrl + "api/v1/forecast?location=" + formattedLocation;
	  var requestResponse = $.ajax({ url: "" + requestUrl,
	    type: 'get',
	    success: function success(res) {
	      apiResponse = res["data"];
	      weatherForecastObj = new WeatherForecast(apiResponse);
	      weatherLocationTimezone = weatherForecastObj.timezone;
	      displayAllLocationData();
	      callback();
	    },
	    error: function error(res) {
	      apiResponse = "Error";
	    }
	  });
	}

	function displayAllLocationData() {
	  displayBoxOne();
	  displayBoxTwo();
	  clearBoxThree(displayBoxThree);
	}

	function displayBoxOne() {
	  var location_time = weatherForecastObj.currentTime;
	  var currentDateTime = timeConverter(location_time);
	  var currentTime = new Date(currentDateTime).toLocaleTimeString();

	  document.getElementById("currentDate").innerHTML = "" + currentTime;
	  document.getElementById("locationName").innerHTML = weatherForecastObj.locationName + " " + '<button type="button" class="btn btn-default" id="favoriteButton"><span class="glyphicon glyphicon-heart" aria-hidden="true"></span> Favorite</button>';
	  document.getElementById("currentTemp").innerHTML = weatherForecastObj.currentTemp + "&deg;F";
	  document.getElementById("shortWeatherBlurb").innerHTML = "" + weatherForecastObj.shortDescription;
	}

	function displayBoxTwo() {
	  document.getElementById("longWeatherBlurb").innerHTML = "" + weatherForecastObj.longDescription;
	  document.getElementById("feelsLike").innerHTML = "Feels Like: " + weatherForecastObj.feelsLike + "&deg;F";
	  document.getElementById("currentTempHigh").innerHTML = "High: " + weatherForecastObj.currentHigh + "&deg;F";
	  document.getElementById("currentTempLow").innerHTML = "Low: " + weatherForecastObj.currentLow + "&deg;F";
	  document.getElementById("humidity").innerHTML = "Humidity: " + weatherForecastObj.humidity + "%";
	  document.getElementById("Visibility").innerHTML = "Visibility: " + weatherForecastObj.visibility + " mi.";
	  document.getElementById("uvIndex").innerHTML = "UV Index: " + weatherForecastObj.uvIndex;
	}

	function displayBoxThree() {
	  displayNextHours();
	  displayNextDays();
	}

	function displayNextHours() {
	  var hours = weatherForecastObj.nextHours.splice(1, 8);
	  hours.forEach(function (e) {
	    displayHour(e);
	  });
	}

	function clearBoxThree(callback) {
	  document.getElementById("nextDays").innerHTML = '';
	  document.getElementById("nextHours").innerHTML = '';
	  callback();
	}

	function displayHour(hour_data) {
	  var hourDiv = document.createElement("div");
	  var time = hour_data["time"];
	  var currentHourTime = timeConverter(time);
	  var currentHour = new Date(currentHourTime).toLocaleTimeString();

	  var hourTimeDiv = document.createElement("div");
	  var timeText = document.createTextNode("" + currentHour);
	  hourTimeDiv.appendChild(timeText);
	  hourDiv.appendChild(hourTimeDiv);

	  var hourTemp = hour_data["temperature"];
	  var hourTempDiv = document.createElement("div");
	  hourTempDiv.innerHTML = hourTemp + " &deg;F";
	  hourDiv.appendChild(hourTempDiv);

	  document.getElementById("nextHours").appendChild(hourDiv);
	}

	function displayNextDays() {
	  var days = weatherForecastObj.nextDays.splice(1, 5);
	  days.forEach(function (e) {
	    displayUpcomingDay(e);
	  });
	}

	function displayUpcomingDay(day_data) {
	  var dayDiv = document.createElement("div");

	  var day = timeConverter(day_data["time"]);
	  var dayName = getDayName(day);
	  var dayNameDiv = document.createElement("div");
	  var dayNameText = document.createTextNode("" + dayName);
	  dayNameDiv.appendChild(dayNameText);
	  dayDiv.appendChild(dayNameDiv);

	  var day_high = day_data["temperature_high"];
	  var day_low = day_data["temperature_low"];
	  var dayHighLowDiv = document.createElement("div");
	  dayHighLowDiv.innerHTML = "High: " + day_high + "&deg;F / Low: " + day_low + "&deg;F";
	  dayDiv.appendChild(dayHighLowDiv);

	  var day_summary = day_data["summary"];
	  var daySummaryDiv = document.createElement("div");
	  var daySummaryText = document.createTextNode("" + day_summary);
	  daySummaryDiv.appendChild(daySummaryText);
	  dayDiv.appendChild(daySummaryDiv);

	  var day_humidity = day_data["humidity"];
	  var dayHumidityDiv = document.createElement("div");
	  var dayHumidityText = document.createTextNode("Humidity: " + day_humidity + "%");
	  dayHumidityDiv.appendChild(dayHumidityText);
	  dayDiv.appendChild(dayHumidityDiv);

	  document.getElementById("nextDays").appendChild(dayDiv);
	}

	function timeConverter(unix_timestamp) {
	  var timezone = weatherLocationTimezone;
	  var timestamp = parseInt(unix_timestamp, 10);
	  var local_time = new Date(timestamp * 1000).toLocaleString("en-US", { timeZone: timezone });

	  return local_time;
	}

	function getDayName(date_obj) {
	  var d = new Date(date_obj);
	  var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
	  return days[d.getDay()];
	}

	function setFavoriteButton() {
	  favoriteButton = document.getElementById("favoriteButton");
	  favoriteButton.addEventListener("click", function (event) {
	    event.preventDefault();
	    var curr_location = weatherForecastObj.locationName;
	    postFavorite(curr_location);
	  });
	}

	getWeatherButton.addEventListener("click", function (event) {
	  event.preventDefault();
	  processWeatherRequest(setFavoriteButton);
	});

	favDropDownLink.addEventListener("click", function (event) {
	  event.preventDefault();
	  document.getElementById("menuFavs").classList.toggle('drop');
	});

	function postFavorite(location_name) {
	  fetch('https://weather-bug.herokuapp.com/api/v1/favorites', {
	    method: 'POST',
	    headers: { 'Content-Type': 'application/json' },
	    body: JSON.stringify({
	      "api_key": "467cb9044730c0d11fb4ebd511a9",
	      "location": "" + location_name
	    })
	  }).then(updateFavorites(location_name)).catch(function (error) {
	    console.log(error);
	  });
	}

	//
	// // Fetch call is nice and tidy on its own
	// const postArticle = (event) => {
	//   event.preventDefault()
	//   return fetch('http://example.com/articles', requestOptions)
	//     .then(handleResponse)
	//     .then(appendArticle)
	//     .catch(errorLog)
	// }

/***/ })
/******/ ]);