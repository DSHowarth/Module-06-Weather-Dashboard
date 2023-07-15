//Wrapping JS in a .ready() function so it can't load before the DOM
$(document).ready(function(){

    var searchInput = $('#weatherSearch');
    var historyList = $('#history');
    var currentWeather = $('#currentWeather');
    var searchForm = $('#searchForm');

    //setting global variables used by functions, so we don't have to rely on return statements
    var cityLon = 0;
    var cityLat = 0;
    var currentCity = "";

    //checks local storage to see if any previous searches exist, and if so, display them
    var displayHistory = function(){
        if(localStorage.getItem('cities')){
            var storedCities = JSON.parse(localStorage.getItem('cities'));
            for(var i = 0; i < storedCities.length; i++){
                createHistoryEntry(storedCities[i]);

            }
        }
        else{
            return;
        }
    }



    var displayCurrentWeather = function(){
        //create api url from lat and long pulled by displayWeather
        var cityUrl = 'https://api.openweathermap.org/data/2.5/weather?lat=' + cityLat + '&lon=' + cityLon + '&units=imperial&appid=7f9953f1dd73d072c914ff82ce5ca3d1';

        fetch(cityUrl)
        .then(function(response){
            return response.json();
        })
        .then(function(data){
            // Update title, add weather icon, set temperature, wind, and humidity
            currentWeather.children('h1').text('Today, ' + dayjs().format('MMMM D, YYYY') + ' the current weather for ' + data.name + ' is:');
            currentWeather.children('img').attr('src', 'https://openweathermap.org/img/wn/' + data.weather[0].icon + '@2x.png')
            currentWeather.children('ul').children('.temperature').text('Temp: ' + data.main.temp + '°F');
            currentWeather.children('ul').children('.wind').text('Wind: ' + data.wind.speed + 'MPH');
            currentWeather.children('ul').children('.humidity').text('Humidity: ' + data.main.humidity + '%');
        })
    }
    // pulling and displaying the forecast for the next 5 days
    var displayForecast = function(){
        //create api url from lat and long pulled by displayWeather
        var cityUrl = 'https://api.openweathermap.org/data/2.5/forecast/?lat=' + cityLat + '&lon=' + cityLon + '&units=imperial&appid=7f9953f1dd73d072c914ff82ce5ca3d1';

        fetch(cityUrl)
        .then(function(response){
            return response.json();
        })
        .then(function(data){
            for(var i = 0; i < 5; i++){
                var forecastDay = $('#day' + (i+1)).children('.card-body');
                var timeInterval = i;
                //data from API starts 6+ hours ahead of current time, so the first pull needs to be fewer entries ahead to be the same time tomorrow. 
                //after that, every 8 entries will be the same time of day (8*3 = 24hrs)
                if(i === 0){
                    timeInterval = 5;
                }
                else{
                    timeInterval = 5 + (i * 8);
                }
                // Update title, add weather icon, set temperature, wind, and humidity
                forecastDay.children('h5').text(dayjs(data.list[timeInterval].dt_txt).format('MMMM D, YYYY'));
                forecastDay.children('img').attr('src', 'https://openweathermap.org/img/wn/' + data.list[timeInterval].weather[0].icon + '@2x.png')
                forecastDay.children('ul').children('.temperature').text('Temp: ' + data.list[timeInterval].main.temp + '°F');
                forecastDay.children('ul').children('.wind').text('Wind: ' + data.list[timeInterval].wind.speed + 'MPH');
                forecastDay.children('ul').children('.humidity').text('Humidity: ' + data.list[timeInterval].main.humidity + '%');
            }

        })
    }

    //Main function for populating page with weather info.
    var displayWeather = function(cityName){
        // create api url from city name
        var locUrl = 'http://api.openweathermap.org/geo/1.0/direct?q=' + cityName + '&appid=7f9953f1dd73d072c914ff82ce5ca3d1';

        //request info, when received, parse it and extract latitude and longitude data.
        fetch(locUrl)

        .then(function (response){
            return response.json();
        })
        .then(function(data){
            //check whether the user entered a valid city name
            if(data[0] === undefined){
                $('#errorModal').modal('show');
                return;
            }

            //set lat/long
            cityLon = data[0].lon;
            cityLat = data[0].lat;
            //use lat/long data to populate page elements
            displayCurrentWeather();
            displayForecast();
            saveSearchHistory(currentCity);
            //show weather info section on page, if this is the first search on load
            $('#weatherInfo').attr('style','display:inline-block');
        })


    }

    //Creates a new button on the screen with a city name
    var createHistoryEntry = function(cityName){
        var newEntry = $('<button></button>');
        newEntry.attr('class','m-1');
        newEntry.text(cityName);
        historyList.append(newEntry);
    }

    //Stores search history in an array within localStorage. 
    var saveSearchHistory = function(cityName){
        //Creates a new item if no search exists yet, otherwise pulls info and appends new search
        if(localStorage.getItem('cities')){
            //Does not save if name already exists
            if (localStorage.getItem('cities').includes(cityName)){
                return;
            }
            var storedCities = JSON.parse(localStorage.getItem('cities'));
            storedCities.push(cityName);
            localStorage.setItem('cities', JSON.stringify(storedCities));
            console.log(storedCities);
        }
        else{
            localStorage.setItem('cities', JSON.stringify([cityName]));
        }
        createHistoryEntry(cityName);

    }

    //display history, if it exists, on page load
    displayHistory();
    //When the user submits a city name to the form, stop form default function,
    //display weather, and save city to history
    searchForm.submit(function(event){
        event.preventDefault();
        currentCity = searchInput.val();
        displayWeather(currentCity);

        //clear input
        searchInput.val('');
    })

    //newly created history buttons will initiate weather display
    historyList.on('click', 'button', function(event){
        var buttonValue = event.target.textContent;
        //Clear input field so it doesn't get saved when executing a search from a history button
        searchInput.val('');
        
        displayWeather(buttonValue);
    })

})