$( document ).ready(function(){
    var searchInput = $('#weatherSearch');

    var historyList = $('#history');
    var currentWeather = $('#currentWeather');
    var searchForm = $('#searchForm');

    var cityLon = 0;
    var cityLat = 0;
    var currentCity = "";



    var displayCurrentWeather = function(){
        //create api url from lat and long pulled by getLocData
        var cityUrl = 'https://api.openweathermap.org/data/2.5/weather?lat=' + cityLat + '&lon=' + cityLon + '&units=imperial&appid=7f9953f1dd73d072c914ff82ce5ca3d1';

        fetch(cityUrl)
        .then(function(response){
            return response.json();
        })
        .then(function(data){
            // Update title, temperature, wind, and humidity
            console.log(data)
            currentWeather.children('h1').text('Today, ' + dayjs().format('MMMM D, YYYY') + ' the current weather for ' + data.name + ' is:');
            currentWeather.children('ul').children('.temperature').text('Temp: ' + data.main.temp + '°F');
            currentWeather.children('ul').children('.wind').text('Wind: ' + data.wind.speed + 'MPH');
            currentWeather.children('ul').children('.humidity').text('Humidity: ' + data.main.humidity + '%');
        })
    }

    var displayForecast = function(){

        var cityUrl = 'https://api.openweathermap.org/data/2.5/forecast/daily?lat=' + cityLat + '&lon=' + cityLon + '&units=imperial&appid=7f9953f1dd73d072c914ff82ce5ca3d1';

        fetch(cityUrl)
        .then(function(response){
            return response.json();
        })
        .then(function(data){
            // Update title, temperature, wind, and humidity
            console.log(data);
            for(var i = 0; i < 5; i++){
                var forecastDay = $('#day' + (i+1));

                forecastDay.children('h5').text(dayjs().format('MMMM D, YYYY'));
                forecastDay.children('ul').children('.temperature').text('Temp: ' + data.list[i]["temp"]["day"] + '°F');
                forecastDay.children('ul').children('.wind').text('Wind: ' + data.list[i]["temp"]["day"] + 'MPH');
                forecastDay.children('ul').children('.humidity').text('Humidity: ' + data.list[i]["humidity"] + '%');
            }

        })
    }
    var displayWeather = function(cityName){
        // create api url from city name
        var locUrl = 'http://api.openweathermap.org/geo/1.0/direct?q=' + cityName + '&appid=7f9953f1dd73d072c914ff82ce5ca3d1';

        //request info, when received, parse it and extract latitude and longitude data.
        fetch(locUrl)
        .then(function (response){

            return response.json();
        })
        .then(function(data){
            cityLon = data[0].lon;
            cityLat = data[0].lat;
            displayCurrentWeather();
            displayForecast();
        })

    }

    searchForm.submit(function(event){
        event.preventDefault();

        currentCity = searchInput.val();
        displayWeather(currentCity);
    })

})