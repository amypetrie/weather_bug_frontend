var getWeatherButton = document.getElementById("submitLocation");
var weatherInput = document.getElementById("locationSearchInput");
// var apiUrl = "https://weather-bug.herokuapp.com/";
var apiUrl = "http://localhost:3000/";
var apiResponse = null;
var weatherForecastObj = null;
var weatherLocationTimezone = null;
var userApiKey = null;
var userFavoritesObj = null;
var favDropDownLink = document.getElementById("dropDownFavs");


window.onload = setUserVariabes();

class WeatherForecast {
  constructor(weatherData){
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
  }
}

class UserFavorites {
  constructor(favorites){
    this.favoriteLocations = favorites;
  }
}

function setUserVariabes(){
  getUserApiKey();
  getUserFavorites(userApiKey, displayFavorites);
}

function getUserApiKey(){
  // heroku app
  // userApiKey = "467cb9044730c0d11fb4ebd511a9";

  //local host
  userApiKey = "29fc41e307adf31185a6563bf5bc";
}

function displayFavorites(){
  let locations = userFavoritesObj.favoriteLocations;
  locations.forEach(function(e) {
    let name = e["attributes"]["location"];
    var favDropDown =  document.getElementById("menuFavs");
    let newFav = document.createElement("li");
    let favText = document.createTextNode(`${name}`);

    newFav.appendChild(favText);
    document.getElementById("menuFavs").appendChild(newFav);
  });
}

function getUserFavorites(api_key, callback){
  let requestUrl = `${apiUrl}` + "api/v1/favorites";
  const requestResponse = $.ajax(
                                  {url: `${requestUrl}`,
                                  type: 'get',
                                  contentType: 'application/json',
                                  data: {api_key: `${userApiKey}`},
                                  dataType: 'json',
                                  success: function(res){
                                    userFavoritesObj = new UserFavorites(res["data"]);
                                    callback();
                                  },
                                  error: function(res){
                                    userFavoritesObj = "Error";
                                  }
                                });
}

function processWeatherRequest(){
  let formattedLocation = weatherInput.value;
  let requestUrl = `${apiUrl}` + "api/v1/forecast?location=" + formattedLocation;
  const requestResponse = $.ajax(
                                  {url: `${requestUrl}`,
                                  type: 'get',
                                  success: function(res) {
                                    apiResponse = res["data"];
                                    weatherForecastObj = new WeatherForecast(apiResponse);
                                    weatherLocationTimezone = weatherForecastObj.timezone;
                                    displayBoxOne();
                                    displayBoxTwo();
                                    displayBoxThree();
                                  },
                                  error: function(res) {
                                    apiResponse = "Error";
                                  }
                                });
}

function displayBoxOne(){
  let location_time = weatherForecastObj.currentTime;
  let currentDateTime = timeConverter(location_time);
  document.getElementById("currentDate").innerHTML = `Local Time: ${currentDateTime}`
  document.getElementById("locationName").innerHTML = `${weatherForecastObj.locationName}`;
  document.getElementById("currentTemp").innerHTML = `Current Temperature: ${weatherForecastObj.currentTemp} degrees`;
  document.getElementById("shortWeatherBlurb").innerHTML = `Right Now: ${weatherForecastObj.shortDescription}`;
  document.getElementById("currentTempHigh").innerHTML = `Temperature High: ${weatherForecastObj.currentHigh} degrees`;
  document.getElementById("currentTempLow").innerHTML = `Temperature Low: ${weatherForecastObj.currentLow} degrees`;
}

function displayBoxTwo(){
  document.getElementById("longWeatherBlurb").innerHTML = `Today: ${weatherForecastObj.longDescription}`;
  document.getElementById("feelsLike").innerHTML = `Feels Like: ${weatherForecastObj.feelsLike} degrees`;
  document.getElementById("humidity").innerHTML = `Humidity: ${weatherForecastObj.humidity}%`;
  document.getElementById("Visibility").innerHTML = `Visibility: ${weatherForecastObj.visibility} mi.`;
  document.getElementById("uvIndex").innerHTML = `UV Index: ${weatherForecastObj.uvIndex}`;
}

function displayBoxThree(){
  displayNextHours();
  displayNextDays();
}

function displayNextHours(){
  let hours = weatherForecastObj.nextHours.splice(1,9);
  hours.forEach(function(e){
    displayHour(e);
  });
}

function displayHour(hour_data){
  let hourDiv = document.createElement("div");
  let time = hour_data["time"];
  let currentHourTime = timeConverter(time);

  let hourTimeDiv = document.createElement("div");
  let timeText = document.createTextNode(`${currentHourTime}`);
  hourTimeDiv.appendChild(timeText);
  hourDiv.appendChild(hourTimeDiv);

  let hourTemp = hour_data["temperature"];
  let hourTempDiv = document.createElement("div");
  let tempText = document.createTextNode(`${hourTemp} degrees`);
  hourTempDiv.appendChild(tempText);
  hourDiv.appendChild(hourTempDiv);

  document.getElementById("nextHours").appendChild(hourDiv);
}

function displayNextDays(){
  let days = weatherForecastObj.nextDays.splice(1,6);
  days.forEach(function(e){
    displayUpcomingDay(e);
  });
}

function displayUpcomingDay(day_data){
  let dayDiv = document.createElement("div");

  let day = timeConverter(day_data["time"]);
  let dayName = getDayName(day);
  let dayNameDiv = document.createElement("div");
  let dayNameText = document.createTextNode(`${dayName}`);
  dayNameDiv.appendChild(dayNameText);
  dayDiv.appendChild(dayNameDiv);

  let day_high = day_data["temperature_high"];
  let day_low = day_data["temperature_low"];
  let dayHighLowDiv = document.createElement("div");
  let dayHighLowText = document.createTextNode(`High: ${day_high} / Low: ${day_low}`);
  dayHighLowDiv.appendChild(dayHighLowText);
  dayDiv.appendChild(dayHighLowDiv);

  let day_summary = day_data["summary"];
  let daySummaryDiv = document.createElement("div");
  let daySummaryText = document.createTextNode(`${day_summary}`);
  daySummaryDiv.appendChild(daySummaryText);
  dayDiv.appendChild(daySummaryDiv);

  let day_humidity = day_data["humidity"];
  let dayHumidityDiv = document.createElement("div");
  let dayHumidityText = document.createTextNode(`Humidity: ${day_humidity}`);
  dayHumidityDiv.appendChild(dayHumidityText);
  dayDiv.appendChild(dayHumidityDiv);

  document.getElementById("nextDays").appendChild(dayDiv);
}

function timeConverter(unix_timestamp,){
  let timezone = weatherLocationTimezone;
  let timestamp = parseInt(unix_timestamp, 10);
  let local_time = new Date(timestamp * 1000).toLocaleString("en-US", {timeZone: timezone})

  return local_time;
}

function getDayName(date_obj){
  var d = new Date(date_obj);
  var days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
  return days[d.getDay()];
}

getWeatherButton.addEventListener("click", function(){
  processWeatherRequest();
})

favDropDownLink.addEventListener("click", function( event ) {
  document.getElementById("menuFavs").classList.toggle('drop');
})
  // reset after a short delay
  // setTimeout(function() {
  //   event.target.style.color = "";
  // }, 500);
