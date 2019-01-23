var getWeatherButton = document.getElementById("submitLocation");
var weatherInput = document.getElementById("locationSearchInput");
var apiUrl = "http://localhost:3000/";
var apiResponse = null;

function processWeatherRequest(){
  let formattedLocation = weatherInput.value;
  let requestUrl = `${apiUrl}` + "api/v1/forecast?location=" + formattedLocation;
  const requestResponse = $.ajax(
                            {url: `${requestUrl}`,
                            type: 'get',
                            success: function(res) {
                              apiResponse = res["data"]["attributes"];
                              document.getElementById("locationHeader").innerHTML = "Hi";
                            },
                            error: function(res) {
                              apiResponse = "Error";
                              return apiResponse;
                            }
                          });
}
