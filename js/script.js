let searchInp = document.querySelector('.weather__search');
let city = document.querySelector('.weather__city'); 
let day = document.querySelector('.weather__day');
let humidity = document.querySelector('.weather__indicator--humidity>.value');
let wind = document.querySelector('.weather__indicator--wind>.value');
let presurre = document.querySelector('.weather__indicator--pressure>.value');
let image = document.querySelector('.weather__image');
let temperature = document.querySelector('.weather__temperature>.value');
let forecastBlock = document.querySelector('.weather__forecast');
//let weatherAPIKey = '';
let weatherBaseEndpoint = 'https://api.openweathermap.org/data/2.5/weather?units=metric&appid=' + weatherAPIKey;
let forecastBaseEndpoint = 'https://api.openweathermap.org/data/2.5/forecast?units=metric&appid=' + weatherAPIKey;

let getWeatherByCityName = async (city) => {
    let endpoint = weatherBaseEndpoint + '&q=' + city;
    let response = await fetch(endpoint);
    let weather = await response.json();
    
    return weather;
}

let getForecastByCityID = async (id) => {
    let endpoint = forecastBaseEndpoint + '&id='  +id;
    let result = await fetch(endpoint);
    let forecast = await result.json();
    let forecastList = forecast.list;
    let daily = [];

    forecastList.forEach(day => {
        let date = new Date(day.dt_txt.replace(' ', 'T'));
        let hours = date.getHours();
        if(hours === 12) {
            daily.push(day);
        }
        
    })
    return daily;

}

searchInp.addEventListener('keydown', async (e) => {
    if(e.keyCode === 13) {
        let weather = await getWeatherByCityName(searchInp.value);
        let CityID = weather.id;
    updateCurrentWeather(weather);
    let forecast = await getForecastByCityID(CityID);
    updateForecast(forecast);
    }
})

let updateCurrentWeather = (data) => {
    city.textContent = data.name + ', ' + data.sys.country
    day.textContent = dayOfWeek();
    humidity.textContent = data.main.humidity;
    presurre.textContent = data.main.pressure;
    let windDirection;
    let  deg = data.wind.deg;
    if(deg > 45 && deg <= 135) {
        windDirection = 'East';
    } else if(deg > 135 && deg<=225) {
        windDirection = 'South';
    } else if(deg > 225 && deg <= 315) {
            windDirection = 'West';
    } else {
        windDirection = 'North';
    }

    wind.textContent = windDirection + ', ' + data.wind.speed;
    temperature.textContent = data.main.temp > 0 ? 
                            '+' + Math.round(data.main.temp ): 
                            Math.round(data.main.temp);
}

let updateForecast = (forecast) => {
    forecastBlock.innerHTML ='';
    forecast.forEach(day => {
        let iconURL = ' http://openweathermap.org/img/wn/' + day.weather[0].icon + '@2x.png';
        let dayName = dayOfWeek(day.dt * 1000);
        let temperature = day.main.temp > 0 ? 
                     '+' + Math.round(day.main.temp ): 
                      Math.round(day.main.temp);    
        let forecastItem = `
            <article class="weather__forecast__item">
                <img src="${iconURL}" alt="${day.weather[0].description}" class="weather__forecast__icon">
                 <h3 class="weather__forecast__day">${dayName}</h3>
                 <p class="weather__forecast__temperature"><span class="value">${temperature}</span>&deg;C</p>
            </article>
            `;
            forecastBlock.insertAdjacentHTML('beforeend', forecastItem);

    })

}
let dayOfWeek = (dt = new Date().getTime()) => {
   return new Date(dt).toLocaleDateString('en-En', {'weekday': 'long'});
}