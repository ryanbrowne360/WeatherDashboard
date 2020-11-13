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
