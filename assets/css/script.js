// Config file
var city_name = $('#city_name');
var city_temp = $('#city_temp');
var city_humidity = $('#city_humidity');
var city_wind = $('#city_wind');
var city_UV = $('#city_UV');
var forecast = $('.forecast');
var listGroup = $('.list-group');
const APIKey = "2e033a6312d280155ba68211cd6e56e28";




// Initialize the city array that is saved in the local storage.
const cities = JSON.parse(localStorage.getItem('cities')) || [];
if (typeof cityArray != 'undefined' && cityArray.length > 0)
{
   mFirst = true;
   updateList();
}

$(document).ready(() => {

    cities.forEach((city) => {
        listGroup.prepend(
            $(`<li class="list-group-item text-capitalize">${city}</li>`)
        );
    });
    // Add Event Listener
    const city = 'Miami';
    getCurrentWeather(city);
    getFutureWeather(city);

    $('.list-group-item').on('click', (e) => {
        const city = e.target.textContent;
        getCurrentWeather(city);
        getFutureWeather(city);
    });
});
function success(position) {
    var lat  = position.coords.latitude;
    var lon = position.coords.longitude;
    
    getSingleWeather("", lat, lon);
 }

 /** error: give user alert */
 function error() {
     alert("fail to retrive location! If you want to use your corrent location, please refresh page and click \"allow\" for pop-up question");
 }

// Event Listener on submit.
$('form').on('submit', (e) => {
    e.preventDefault();

    const city = $('input').val();
    cities.push(city);

    // City name has been saved to the local storage.
    localStorage.setItem('cities', JSON.stringify(cities));

    // Render search history.
    listGroup.prepend($(`<li class="list-group-item">${city}</li>`));

    // Event Listener on list item has been clicked.
    $('.list-group-item').on('click', (e) => {
        const city = e.target.textContent;
        getCurrentWeather(city);
        getFutureWeather(city);
    });

    // Get the weather info.
    getCurrentWeather(city);
    getFutureWeather(city);
});

// Function to get the current weather.
function getCurrentWeather(city) {
    if (typeof lat !== 'undefined' && typeof lon !== 'undefined') {
        var baseURL = 'https://api.openweathermap.org/data/2.5/weather?lat=35.994034&lon=-78.898621&appid=ceae53b8bf5e7a4be954a28102239971&units=imperial';
    } else if (city !== ""){ 
        var baseURL = `https://api.openweathermap.org/data/2.5/weather?lat=35.994034&lon=-78.898621&appid=ceae53b8bf5e7a4be954a28102239971&units=imperial
        `;
    } else {
        alert("invalid search! Please give a city name in search bar!");
        return;
    }

    $.ajax({
        url: baseURL + `&q=${city}`,
        method: 'GET',
    }).then((res) => {

        // pull the time
        var unix_timestamp = res.dt;
        var date = new Date(unix_timestamp * 1000);
        var month = date.getMonth() + 1;
        var day = date.getDate();
        var year = date.getFullYear();
        var formatedTime = `(${month}/${day}/${year})`;
        
        //Render the current weather.
        city_name.text(res.name + ' ' + formatedTime);
        city_temp.text('Temperature: ' + res.main.temp + '℉');
        city_humidity.text('Humidity: ' + res.main.humidity + '%');
        city_wind.text('Wind Speed: ' + res.wind.speed + 'MPH');
        city_name.append(
            $(
                `<img src="http://openweathermap.org/img/wn/10d@2x.png"></img>`
            )
        );

        const lat = res.coord.lat;
        const lon = res.coord.lon;

        $.ajax({
            url: ` https://api.openweathermap.org/data/2.5/uvi?appid=9385bb375daef99b7d5d3a120b3b3b1e&units=imperial&lat=${lat}&lon=${lon}`,
            method: 'GET',
        }).then((res) =>
            city_UV.html(
                `UV Index: <span class="text-white p-1 ${
          res.value < 2
            ? 'bg-sucess'
            : res.value <= 7
            ? 'bg-warning'
            : 'bg-danger'
        }">${res.value}</span>`
            )
        );
    });
}

// Get the future weather.
function getFutureWeather(city) {
    let baseURL =
        'https://api.openweathermap.org/data/2.5/forecast?appid=9385bb375daef99b7d5d3a120b3b3b1e&units=imperial';

    $.ajax({
        url: baseURL + `&q=${city}`,
        method: 'GET',
    }).then((res) => {

        // Get Future weather
        const futureWeather = [];

        for (let i = 4; i < res.list.length; i += 8) {
            futureWeather.push(res.list[i]);
        }

        // Render the future weather.
        futureWeather.forEach((day) => {
            const weatherCard = $('<div>').addClass(
                'card col-sm-4 col-md-2 bg-primary'
            );

            weatherCard.html(`
      <div class="card-body p-md-0 p-sm-1">
      <h5 class="card-title">${day.dt_txt.slice(0, 10)}</h5>
      <img src="https://openweathermap.org/img/wn/${
        day.weather[0].icon
      }@2x.png"></img>
      <p class="card-text">Temp: ${day.main.temp}℉</p>
      <p class="card-text">Humidity: ${day.main.humidity}%</p>
    </div>
        `);

            forecast.append(weatherCard);
        });
    });
    // function to save 
    function savedsearch() {
        let $oldCity = $(this).text();
        $("#cityenter").val($oldCity);
        $clicked.trigger("click");
    }
    
    // Function to restore Hisory
    let $clear = $("#clearhist");
    $clear.on("click", function () {
        localStorage.clear();
        historydisplay = []
        for (i = 0; i < 11; i++) {
            $("#search" + i).text("");
        }
    
    }); 
}