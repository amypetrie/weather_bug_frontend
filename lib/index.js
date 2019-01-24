var getWeatherButton = document.getElementById("submitLocation");
var weatherInput = document.getElementById("locationSearchInput");
var apiUrl = "https://weather-bug.herokuapp.com/";
// var apiUrl = "http://localhost:3000/";
var apiResponse = null;
var weatherForecastObj = null;

class WeatherForecast {
  constructor(weatherData){
    this.locationName = weatherData["attributes"]["location_description"]["formattedAddress"];
    this.currentWeather = weatherData["attributes"]["daily_forecast"]["current_summary"];
    this.currentTemp = weatherData["attributes"]["daily_forecast"]["current_temp"];
    this.currentHigh = weatherData["attributes"]["daily_forecast"]["temperature_high"];
    this.currentLow = weatherData["attributes"]["daily_forecast"]["temperature_low"];
    this.currentTime = weatherData["attributes"]["daily_forecast"]["time"];
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
  document.getElementById("currentTemp").innerHTML = `Current Temp: ${weatherForecastObj.currentTemp} degrees`;
  document.getElementById("currentWeatherDescription").innerHTML = `${weatherForecastObj.currentWeather}`;
  document.getElementById("currentTempHigh").innerHTML = `Temperature High: ${weatherForecastObj.currentHigh} degrees`;
  document.getElementById("currentTempLow").innerHTML = `Temperature Low: ${weatherForecastObj.currentLow} degrees`;
}

function displayDateTime(){
  // need to edit this to format unix time returned by DarkSky
  document.getElementById("currentTime").innerHTML = `Current Date and Time: ${weatherForecastObj.currentTime}`;
}
