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

class WeatherForecast {
  constructor(weatherData){
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
  userApiKey = "467cb9044730c0d11fb4ebd511a9";
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
  displayDateTime();
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
  // displayNextDays();
}

function displayNextHours(){
  let hours = weatherForecastObj.nextHours;
  hours.forEach(function(e){
    // container for an hour's attributes
    let hourDiv = document.createElement("div");
    //  time attribute
    let hour = e["time"];
    let hourTime = document.createElement("div");
    let timeText = document.createTextNode(`${hour}`);
    hourTime.appendChild(timeText);
    //add time to the container div
    hourDiv.appendChild(hourTime);

    // temp attribute
    let temp = e["temperature"];
    let hourTemp = document.createElement("div");
    let tempText = document.createTextNode(`${temp}`);
    hourTemp.appendChild(tempText);
    hourDiv.appendChild(hourTemp);

    document.getElementById("nextHours").appendChild(hourDiv);
  });
}

function displayDateTime(){
  // need to edit this to format unix time returned by DarkSky
  document.getElementById("currentTime").innerHTML = `Current Date and Time: ${weatherForecastObj.currentTime}`;
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
