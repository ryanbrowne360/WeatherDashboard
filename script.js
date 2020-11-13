//API key from open weather

const key = '3cf10c54f7c16c2b9675a77edcf6ab12'


$("#searchBtn").on("click", function() {getWeather()})

//Gets all relevant data, 
function getWeather() {

    // Name of city to retrieve data for

    const city = $("#city").val()

     

    var weatherURL = "https://api.openweathermap.org/data/2.5/weather?q= {"city"} &appid= {"key"}"