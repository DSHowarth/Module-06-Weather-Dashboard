var searchInput = $('#weatherSearch');
var historyList = $('#history');
var forecast = $('#fiveDayForecast');
var currentWeather = $('#currentWeather');

var cityLon;
var cityLat;
var currentCity;

var getLocData = function(cityName){

    // create api url from city name
    var locUrl = 'http://api.openweathermap.org/geo/1.0/direct?q=' + cityName + '&appid=7f9953f1dd73d072c914ff82ce5ca3d1';

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
    //create api url from lat and long pulled by getLocData
    var cityUrl = 'https://api.openweathermap.org/data/2.5/weather?lat=' + cityLat + '&lon=' + cityLon + '&units=imperial&appid=7f9953f1dd73d072c914ff82ce5ca3d1';

    fetch(cityUrl)
    .then(function(response){
        return response.json();
    })
    .then(function(data){
        // Update title, temperature, wind, and humidity
        currentWeather.children('h1').text('Today, ' + dayjs().format('MMMM D, YYYY') + ' the current weather for ' + data.name + ' is:');
        currentWeather.children('ul').children('.temperature').text('Temp: ' + data.main.temp + '°F')
        currentWeather.children('ul').children('.wind').text('Wind: ' + data.wind.speed + 'MPH')
        currentWeather.children('ul').children('.humidity').text('Humidity: ' + data.main.humidity + '%')
    })
}

var displayWeather = function(){

}