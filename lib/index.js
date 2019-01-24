var getWeatherButton = document.getElementById("submitLocation");
var weatherInput = document.getElementById("locationSearchInput");
var apiUrl = "https://weather-bug.herokuapp.com/";
// var apiUrl = "http://localhost:3000/";
var apiResponse = null;
var weatherForecastObj = null;

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
  }
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
                            },
                            error: function(res) {
                              apiResponse = "Error";
                              return apiResponse;
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

function displayDateTime(){
  // need to edit this to format unix time returned by DarkSky
  document.getElementById("currentTime").innerHTML = `Current Date and Time: ${weatherForecastObj.currentTime}`;
}
