fiveDaysection= $("#5DayContainer .container .row");

function creatDOM(dayTemp,dayHumid, dayWind, dayUVI){
    // for (var i=0;i<5;i++){
        cardDiv=$(`<div class="col">`);

        mycard=$(`<div id= "mycard" class="card border border-primary my-3">`);

        imgEl=$(`<img class="card-img-top" src="./icons/unknown.png" alt="weather image">`);
        cardBodyDiv=$(`<div class="crad-body">`);

        cardBodyDiv.append(`<p class="Temprature">Temprature: <span>°${dayTemp}</span></p>`);
        cardBodyDiv.append(`<p class="Humidity">Humidity:<span> ${dayHumid} </span></p>`) ;
        cardBodyDiv.append(`<p class="WindSpeed">WindSpeed:<span> ${dayWind}MPH</span> </p>` )  ;
        cardBodyDiv.append(`<p class="UVIndex">UV Index: <span>${dayUVI}</span></p>` )  
        mycard.append(imgEl, cardBodyDiv)

        cardDiv.append(mycard);
        fiveDaysection.append(cardDiv)    ;
    // }
}
