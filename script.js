//API key from open weather
const key = '3cf10c54f7c16c2b9675a77edcf6ab12'

// Get the value of the city when search button is clicked, and then executing the function to retrieve and display data
$("#searchBtn").on("click", function () { getWeather() })

//Gets all relevant data, and update UI accordingly
function getWeather() {

    // Name of city to retrieve data for
    const city = $("#city").val()

    // connecting through https and updating on UI
    var weatherURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${key}`
    $.ajax({
        url: weatherURL,
        method: "GET"
    }).then(function (response) {

        // remove previous data to replace with new city search data
        $("#cityDate").empty();
        $("#temperature").empty();
        $("#humidity").empty();
        $("#windSpeed").empty();
        $("#uvIndex").empty();
        $("#forecast").empty();

        //save data of cities already searched 
        saveData(city)

        // Putting todays date next to the city that was searched for in the data title and making it simple to read
        let todaysDate = new Date().toLocaleDateString()
        $('#cityDate').append(`${city.toUpperCase()} (${todaysDate})`)

        longitude = response.coord.lon;
        latitude = response.coord.lat;
        
        getUV()

        getForecastdata()

        // Appends Data from First API Call to main card

        let temperaturediv = $('#temperature')
        temperaturediv.append(`<b>Temperature: </b>${Math.round(parseInt(response.main.temp) - 273.15)} ° Celcius`)

        let humiditydiv = $('#humidity')
        humiditydiv.append(`<b>Humidity: </b>${response.main.humidity}%`)

        let windSpeeddiv = $('#windSpeed')
        windSpeeddiv.append(`<b>Wind Speed: </b>${response.wind.speed} meters/sec`)
    });
};

//Getting UV data using lat/long http request link and displaying it on the UI
function getUV() {
    var uvURL = `https://api.openweathermap.org/data/2.5/uvi?lat=${latitude}&lon=${longitude}&appid=${key}`
    $.ajax({
        url: uvURL,
        method: "GET"
    }).then(function (response) {

        let uvIndexdiv = $('#uvIndex')
        uvIndexdiv.append(`<b>UV Index: </b>${response.value}`)
    });
}

//Getting forecast data using http request link and displaying it on the UI
function getForecastdata() {
    const city = $("#city").val()
    var forecastURL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${key}`
    $.ajax({
        url: forecastURL,
        method: "GET"
    }).then(function (response) {
        console.log(response)

        let day1 = response.list[4]
        let day2 = response.list[12]
        let day3 = response.list[20]
        let day4 = response.list[28]
        let day5 = response.list[36]

        const forecastArray = [day1, day2, day3, day4, day5];

        let forecastdiv = $('#forecast')

        for (let i = 0; i < forecastArray.length; i++) {
            let date = moment().add(1 + i, 'days').format('L')
            let icon = forecastArray[i].weather[0].icon
            console.log(icon)
            let temperature = forecastArray[i].main.temp
            console.log(temperature)
            let humidity = forecastArray[i].main.humidity
            console.log(humidity)

            forecastdiv.append(`
            <div class="card col forecastCard">
                <div class="card-body">
                    <h5 class="card-title" id="forecastDate"><b>${date}</b></h5>
                    <img src="http://openweathermap.org/img/wn/${icon}@2x.png" />
                    <p class="card-text forecast" id="forecastTemp"><b>Temperature: </b>${Math.round(parseInt(temperature) - 273.15)}°C</p>
                    <p class="card-text forecast" id="forecastHumidity"><b>Humidity: </b>${humidity}%</p>
                </div>
            </div>`)
        }
    });
}

//Saving the search history in local storage then displaying on the UI
function saveData(city) {
    let historyID = 0;

    if (localStorage.getItem("historyID") == undefined) {
        localStorage.setItem("historyID", 0)
    }
    else {
        historyID = localStorage.getItem("historyID");
        ++historyID
    }

    localStorage.setItem(historyID, city)
    localStorage.setItem("historyID", historyID)

    $('#searchHistory').empty()

    for (let i = 0; i <= historyID; i++) {

        let city = localStorage.getItem(i)
        $('#searchHistory').append(`<tr><td><button id="row${i + 1}" class="btn btn-sm btn-dark">` + city + `</button></td></tr>`)
        document.getElementById(`row${i + 1}`).addEventListener("click", function () {
            $("#city").val(city)
            getWeather()
        }); 
       
    }
}

function displayHistory() {
    let historyID = localStorage.getItem("historyID");
    for (let i = 0; i < historyID; i++) {
        let city = localStorage.getItem(i)
        $('#searchHistory').append(`<tr><td><button id="row${i + 1}" class="btn btn-sm btn-light">` + city + `</button></td></tr>`)
    }
}

displayHistory()

// Removing history when function is called

function clearHistory() {
    localStorage.clear();
    $('#searchHistory').empty();
}