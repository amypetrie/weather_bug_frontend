var getWeatherButton = document.getElementById("submitLocation");
var weatherInput = document.getElementById("locationSearchInput");
var apiUrl = "http://localhost:3000/";
var apiResponse = null;

class WeatherForecast {
  constructor(weatherData){
    this.currentWeather = weatherData["daily_forecast"]["current_summary"];
    this.currentTemp = weatherData["daily_forecast"]["current_temp"];
    this.currentHigh = weatherData["daily_forecast"]["temperature_high"];
    this.currentLow = weatherData["daily_forecast"]["temperature_low"];
//     this.current_date = weatherData["daily_forecast"]["current_summary"];
    this.currentTime = weatherData["daily_forecast"]["current_time"];
  }
}

// Location name (City, state, country)
// Date and time
// Current temp
// Current weather (i.e. “sunny”)
// Temp high and temp low

function processWeatherRequest(){
  let formattedLocation = weatherInput.value;
  let requestUrl = `${apiUrl}` + "api/v1/forecast?location=" + formattedLocation;
  const requestResponse = $.ajax(
                            {url: `${requestUrl}`,
                            type: 'get',
                            success: function(res) {
                              apiResponse = res["data"]["attributes"];
                              var weatherForecastObj = new WeatherForecast(apiResponse);
                              document.getElementById("currentWeatherDescription").innerHTML = `${weatherForecastObj.currentWeather}`;
                            },
                            error: function(res) {
                              apiResponse = "Error";
                              return apiResponse;
                            }
                          });
}

function createLocationForecast(location_data){

}
