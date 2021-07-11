const apiKey="65b50ac0fd144e1fbd69be8c79bf2491"
currentDate=moment().format("MMMM Do YYYY, h:mm ")
$("#currentDay").text(currentDate);
var fiveDaysection= $("#fiveDayContainer .row");

var searchBtn = $(".btn");
var inputEl = $(".cityName");
const locationElement = document.querySelector(".location p");
const notificationElement = document.querySelector(".notification");
// App data
var weather = {};
var timezone_offset
weather.temperature = {
  unit : "celsius", 
  temp : 0
}
// APP CONSTS AND VARS
searchBtn.on("click", searchCity);

function clearPage(){
  // $(".city-weather").empty();
   $("#fiveDayContainer .row").empty();
   console.log("clear the page")
  weather = {};

weather.temperature = {
  unit : "celsius", 
  temp : 0
}

}
// searchCity() 
// Search Function
// execute getWeather function then add it to the search history
function searchCity() {
  $("header .notification h2").text("");

   cityName = inputEl.val();
   clearPage();
   if( inputEl.val() =="") var cityName="London";

    console.log("city name is ",cityName)
    getWeather(cityName);

    setTimeout(function(){
        displayWeather()},1000);

    

//     // searchHistory.unshift(cityName);
//     // searchHistory = searchHistory.slice(0,5);
//     // localStorage.setItem("search",JSON.stringify(searchHistory));
//     // generateHistory();
//   
}
// get weather of a city
function getWeather(cityName) {
    let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&appid=${apiKey}`;
    console.log("city api", apiUrl)
    fetch(apiUrl)
        .then(function(response){
            let data = response.json();
            return data;
        })
        .then(function(data){
            weather.temperature.temp = Math.floor(data.main.temp);
            weather.description = data.weather[0].description;
            weather.iconId = data.weather[0].icon;
            weather.city = data.name;
            weather.windSpeed = data.wind.speed;
            weather.city=cityName;
            weather.humidity = data.main.humidity
            weather.country = data.sys.country;
            weather.lat= Math.floor(data.coord.lat);
            weather.lon= Math.floor(data.coord.lon);
            
        
        })
        
        .then(function(){
            console.log("trying to display");

        })
        .then(function(){
            getCityUVI(weather.lat,weather.lon,cityName)

        })
        .then(function(){
          getFiveDayForecast(cityName)   
        })
      
                // // Render an error message if the city isn't found
                // .catch((error) => {
                //   console.log("sadfadsfasdfasdfasdfasqdfsadf")
                //   $("header .notification h2").text("City Not Found !");
                //   // var error = $("<h2>");
                //   // error.html("City not found");
                //   // $('.main-container .ERROR').append(error);
                // });
            
      };

// get Uvi for a city
function getCityUVI(lat,lon,cityName){
    var UVurl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
    console.log("city UVI api", UVurl)
    fetch(UVurl)
        .then(function(response){
            let data = response.json();
            return data;
        })
        .then(function(data){ 
            weather.uvi= data.current.uvi; 
            console.log("UVI", weather.uvi)   ;   
            console.log(weather); 
            timezone_offset=data.timezone_offset
            var timezoneAdjustedUnix = data.current.dt + timezone_offset;
            const date2 = new Date((timezoneAdjustedUnix)*1000);
            const date=date2.toLocaleString("UK").split(",")[0];
            weather.todayDate=date;
            console.log( `"Date in ${cityName} is "`, date)  

        })

}

// get 5 days forecast
function getFiveDayForecast(cityName){
// var ForecastUrl = "https://api.openweathermap.org/data/2.5/forecast?q=" + cityName + "&units=metric&appid=7e3a149deb7dcf451641dcd1d05f5cd5";
var api5DaysUrl  = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&units=metric&appid=${apiKey}`;
//   var api5DaysUrl = "https://api.openweathermap.org/data/2.5/forecast?q=" + cityName + "&units=imperial&appid=7e3a149deb7dcf451641dcd1d05f5cd5";
console.log("5 days ", api5DaysUrl)

fetch(api5DaysUrl)
.then(function(response){
    let data = response.json();
    return data;
})
.then(function(data){ 

  dayListSize=data.list.length;
  console.log(dayListSize)
  for (var i=0;i<dayListSize;i+=8){
  // console.log(i, data.list[i].dt_txt)//.split(" ")[0]
  var theDate = moment().add(i+1, 'days').format('l'); 
  var timezoneAdjustedUnix = data.list[i].dt + timezone_offset;
  const date2 = new Date((timezoneAdjustedUnix)*1000);
  const date=date2.toLocaleString("UK").split(",")[0];
  // console.log(date.split(".")[0])
  if(true){
    console.log("they are equal",date, weather.todayDate);
    var dayTemp = data.list[i].main.temp;
    var dayHumid=data.list[i].main.humidity;
    var dayWind=data.list[i].wind.speed;
    var dayDescription=data.list[i].weather[0].description;
    var dayIcon=data.list[i].weather[0].icon;

  }

// console.log(theDate);
// console.log(dayTemp);
// console.log(dayHumid);
// console.log(dayWind);
// console.log(dayDescription);
// console.log(dayIcon);


creatDOM(theDate, dayTemp,dayHumid, dayWind, dayDescription,dayIcon)

}
    // weather.uvi= data.current.uvi; 
    // console.log("UVI", weather.uvi)   ;   
    // console.log(weather); 

    // var timezoneAdjustedUnix = data.current.dt + data.timezone_offset;
    // const date2 = new Date((timezoneAdjustedUnix)*1000);
    // const date=date2.toLocaleString("UK").split(",")[0];
    // weather.todayDate=date;
    // console.log( `"Date in ${cityName} is "`, date)




})

}


//   console.log(timeConverter(0));
var LOCAL_STORAGE_KEY = "previous_searches";

function getPreviousSearches() {
  var previousSearches = localStorage.getItem(LOCAL_STORAGE_KEY);

  if (previousSearches) {
    return JSON.parse(previousSearches);
  } else {
    return [];
  }
}

function setPreviousSearches(previousSearches) {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(previousSearches));
}

function updateLocalStorage(cityName) {
  var previousSearches = getPreviousSearches();
  previousSearches.unshift(cityName);

  setPreviousSearches(previousSearches);
}



// DISPLAY WEATHER TO UI
function displayWeather(){
  var uvim
  if(weather.uvi<3){
    uvim="uviLow";
    console.log("low UVI")
  }else if(weather.uvi<5){
    uvim="uviModerate";
    console.log("moderate UVI")
  }else{
     uvim="uviExtreame";
     console.log("Extreame UVI")
  }
    $(".uviImage img").attr("src", `./icons/${uvim}.png`);
    $(".weatherIcon").attr("src", `./icons/${weather.iconId}.png`);

    $(".todayHeading .Temprature span").text(`°${weather.temperature.temp}C`);
    $(".info .Humidity span").text(`${weather.humidity}%`);
    $(".info .WindSpeed span").text(`${weather.windSpeed}`);
    $(".info .UVIndex span").text(`${weather.uvi}`);
    $(".todayHeading .description").text(`${weather.description}`);
    
    $(".todayTime span").text(`  ${weather.city}`);

  
}

function celsiusToFahrenheit(temperature){
  return (temperature * 9/5) + 32;
}
// C to F conversion
function fahrenheitToCelcius(temp){
  return (temp -32)* 5/9;
}
// $(".todayHeading .Temprature span").text(`°${weather.temperature}`);
tempElement=$(".todayHeading .Temprature span")
console.log("tempElement", tempElement)
// WHEN THE USER CLICKS ON THE TEMPERATURE ELEMENET
tempElement.on("click", function(){
  if(weather.temperature.temp === "undefined") return;
  if(weather.temperature.unit == "celsius"){
      let fahrenheit = celsiusToFahrenheit(weather.temperature.temp);
      weather.temperature.temp = Math.floor(fahrenheit);
      $(".todayHeading .Temprature span").text(`°${weather.temperature.temp}F`);
      weather.temperature.unit = "fahrenheit";
  }else{
    let celsius = fahrenheitToCelcius(weather.temperature.temp);
    weather.temperature.temp = Math.floor(celsius);
    $(".todayHeading .Temprature span").text(`°${weather.temperature.temp}C`);
    weather.temperature.unit = "celsius"
  }
});


function creatDOM(theDate, dayTemp,dayHumid, dayWind, dayDescription,dayIcon){

  console.log("the date is ", theDate)
      cardDiv=$(`<div class="col">`);
      // cardDiv.append(`<h5 class="card-title">${theDate}</h5>`);

      mycard=$(`<div id= "mycard" class="card border border-primary my-3">`);
      
      imgEl=$(`<img class="card-img-top" src="./icons/${dayIcon}.png" alt="weather image">`);
      cardBodyDiv=$(`<div class="crad-body">`);

      cardBodyDiv.append(`<p class="Temprature">Temprature: <span>°${dayTemp}</span></p>`);
      cardBodyDiv.append(`<p class="Humidity">Humidity:<span> ${dayHumid} </span></p>`) ;
      cardBodyDiv.append(`<p class="WindSpeed">WindSpeed:<span> ${dayWind}MPH</span> </p>` )  ;
      cardBodyDiv.append(`<p class="UVIndex">UV Index: <span>${dayDescription}</span></p>` )  
      mycard.append(imgEl, cardBodyDiv)

      cardDiv.append(mycard);
      fiveDaysection.append(cardDiv)    ;
  // }
}