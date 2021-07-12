const apiKey="65b50ac0fd144e1fbd69be8c79bf2491"
currentDate=moment().format("MMMM Do YYYY")//, h:mm 
$("#currentDay").text(currentDate);
var fiveDaysection= $("#fiveDayContainer .row");
var searchBtn = $(".btn");
var inputEl = $(".cityName");
const locationElement = document.querySelector(".location p");
const notificationElement = document.querySelector(".notification");
// App data
var weather = {};
var timezone_offset;
var LOCAL_STORAGE_KEY = "previous_searches";
var foundCity

weather.temperature = {
  unit : "celsius", 
  temp : 0
}
$( document ).ready(function() {

// add event listner to the search button
searchBtn.on("click", searchCity);

function clearPage(){
  // $(".city-weather").empty();
   $("#fiveDayContainer .row").empty();
    weather = {};
    weather.temperature = {
    unit : "celsius", 
    temp : 0
}

}
// execute getWeather function 
function searchCity() {
  $("header .notification h2").text("");

    cityName = inputEl.val().toUpperCase();
    cityName=cityName.trim();
    clearPage();
    console.log("city name is ",cityName);

    getWeather(cityName);
    updateLocalStorage(cityName) ;
    addButtonEvent()

    $(".city-weather.hide").removeClass("hide");
    $(".search-history").removeClass("full");

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
            weather.city=data.name;
            
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
       var uvim
            if(weather.uvi<4){
              uvim="uviLow";
              console.log("low UVI")
            }else if(weather.uvi<6){
              uvim="uviModerate";
              console.log("moderate UVI")
            }else{
               uvim="uviExtreame";
               console.log("Extreame UVI")
            } 
              $(".info .UVIndex span").text(`${weather.uvi}`);
              $(".uviImage img").attr("src", `./icons/${uvim}.png`); 
          getFiveDayForecast(cityName) ;
          
        }).then(function(){
          displayWeather()
        })
      
                // Render an error message if the city isn't found
                .catch((error) => {
                  console.log("City Not Found !")
                  $("header .notification h2").text("City Not Found !");

                });
            
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
            console.log("UVI", weather.uvi);
             
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
          var j=0;
          var counter=0
test=false
          for (var i=0;i<dayListSize;i++){
                 var timezoneAdjustedUnix = data.list[i].dt + timezone_offset;
                const date2 = new Date((timezoneAdjustedUnix)*1000);
                const date=date2.toLocaleString("UK").split(",")[0];
                todayDay=currentDate.split("th")[0].split(" ")[1];
                // theDate=date2.toLocaleString("UK");
                listDay=date.split(".")[0];
                
                if(listDay<=todayDay)counter++
          }
          console.log("counter", counter)
          for (var i=counter;i<dayListSize;i++){
          // console.log(i, data.list[i].dt_txt)//.split(" ")[0]
          var theDate = moment().add(j+1, 'days').format("MMMM Do YYYY"); 
          var timezoneAdjustedUnix = data.list[i].dt + timezone_offset;
          const date2 = new Date((timezoneAdjustedUnix)*1000);
          const date=date2.toLocaleString("UK").split(",")[0];
          todayDay=currentDate.split("th")[0].split(" ")[1];
          hourss=date2.toLocaleString("UK").split(",")[1].split(":")[0];
          listDay=date.split(".")[0];
          // theDate=date2.toLocaleString("UK").split(",")
          if( (parseInt(hourss)==10 || parseInt(hourss)==11 ||parseInt(hourss)==12 ) && j<5 ){
            test=true
           j++
           console.log("list date and the current date",i, listDay , todayDay)
          
            var dayTemp = data.list[i].main.temp;
            var dayHumid=data.list[i].main.humidity;
            var dayWind=data.list[i].wind.speed;
            var dayDescription=data.list[i].weather[0].description;
            var dayIcon=data.list[i].weather[0].icon;
    creatDOM(theDate, dayTemp,dayHumid, dayWind, dayDescription,dayIcon);

           }
// creat five day Dom on the HTML page
    inputEl.val("")
    
          }

        })

}

function addButtonEvent(){
  $(".savedCities .btn").on("click", function(){
    cityName=$(this).text();
    inputEl.val(cityName.trim());
 searchCity()
    });
  
}


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
  var cityList= $(".history .savedCities")
  $(".history .savedCities").empty();
  for(var i=0;i<previousSearches.length;i++){
    cityList.append(`<p class="btn btn-secondary histornBtn "> ${previousSearches[i]}</p>`)
  }

}

function updateLocalStorage(cityName) {
  if(cityName!==""){
  var previousSearches = getPreviousSearches();
  previousSearches.unshift(cityName);
  previousSearches = [...new Set(previousSearches)]; // remove the duplicated search
  setPreviousSearches(previousSearches);
  }
}


//  creat DOM for the five day forecast
function creatDOM(theDate, dayTemp,dayHumid, dayWind, dayDescription,dayIcon){

      cardDiv=$(`<div class="col">`);

      mycard=$(`<div id= "mycard" class="card border border-primary my-3">`);
      mycard.append(`<h5 class="card-title text-center my-2 font-weight-bold text-primary">${theDate}</h5>`);
      mycard.append(`<h5 class="card-title text-center my-2 font-weight-bold text-primary">${dayDescription}</h5>`);
      
      imgEl=$(`<img class="card-img-top" src="./icons/${dayIcon}.png" alt="weather image">`);
      cardBodyDiv=$(`<div class="card-body">`);

      cardBodyDiv.append(`<p class="Temprature">Temprature: <span>°${dayTemp}</span></p>`);
      cardBodyDiv.append(`<p class="Humidity">Humidity:<span> ${dayHumid} </span></p>`) ;
      cardBodyDiv.append(`<p class="WindSpeed">WindSpeed:<span> ${dayWind}MPH</span> </p>` )  ;
      mycard.append(imgEl, cardBodyDiv)

      cardDiv.append(mycard);
      fiveDaysection.append(cardDiv)    ;
  // }
}

// DISPLAY WEATHER TO the UI
function displayWeather(){
  
    $(".weatherIcon").attr("src", `./icons/${weather.iconId}.png`);

    $(".todayHeading .Temprature span").text(`°${weather.temperature.temp}C`);
    $(".info .Humidity span").text(`${weather.humidity}%`);
    $(".info .WindSpeed span").text(`${weather.windSpeed}`);

    $(".todayHeading .description").text(`${weather.description}`);
    
    $(".todayTime span").text(`  ${weather.city}`);

  
}

// C to F conversion

function celsiusToFahrenheit(temperature){
  return (temperature * 9/5) + 32;
}
// F to C conversion
function fahrenheitToCelcius(temp){
  return (temp -32)* 5/9;
}




// ________________________________________________________________________________________________
// WHEN THE USER CLICKS ON THE TEMPERATURE ELEMENET
//  adding a feature to toggle the temprature between F/C when you click on the temprature
tempElement=$(".todayHeading .Temprature span")
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

// load previous cities to the page


getPreviousSearches()
var previousSearches = localStorage.getItem(LOCAL_STORAGE_KEY);

if (previousSearches) {
    var mylist= JSON.parse(previousSearches);
console.log(mylist)
cityList= $(".history .savedCities")
  $(".history .savedCities").empty();
  for(var i=0;i<mylist.length;i++){
    cityList.append(`<p class="btn btn-secondary histornBtn "> ${mylist[i]}</p>`)
  }
  addButtonEvent()

} 
console.log( " Document is ready!" );

});
