var searchInput = $('#weatherSearch');
var historyList = $('#history');
var forecast = $('#fiveDayForecast');
var currentWeather = $('#currentWeather');

var cityLon;
var cityLat;


var getLocData = function(cityName){

    // create api url from city name
    var locUrl = 'http://api.openweathermap.org/geo/1.0/direct?q=' + cityName + '&appid=7f9953f1dd73d072c914ff82ce5ca3d1'

    //request info, when received, parse it and extract latitude and longitude data.
    fetch(locUrl)
    .then(function (response){
        return response.json();
    })
    .then(function(data){
        cityLon = data.lon;
        cityLat = data.lat;
    })
}

var getCurrentWeather = function(){

}

var displayWeather = function(){

}