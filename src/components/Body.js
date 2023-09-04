import { useState } from 'react';
import { key } from '../config.js';

const Body = () => {
    const [location, setLocation] = useState();
    const [condition, setCondition] = useState();
    const [weather, setWeather] = useState();
    const [time, setTime] = useState();
    const [forecast, setForecast] = useState();

    const formatTime = (time) => {
        // get the last 5 characters ( e.g. 12:00 ) from the localtime string
        let currentHours = time.slice(-5);
        // convert to 12 hour format
        let hours = currentHours.slice(0, 2);
        let suffix = hours > 11 ? "pm" : "am";
        hours = hours > 12 ? hours - 12 : hours;
        let formattedTime = `${hours}:${currentHours.slice(-2)} ${suffix}`;
        return formattedTime;
    }
    
    async function getWeather(city) {
        const url = `http://api.weatherapi.com/v1/forecast.json?key=${key}&q=${city}&aqi=no&days=3`;
        try {
            const res = await fetch(url);
            let weather = await res.json();
            console.log(weather);
            const currentLocation = weather.location;
            const currentCondition = weather.current.condition;
            const currentWeather = weather.current;
            delete currentWeather.condition;

            setTime(formatTime(currentLocation.localtime));
            setLocation(currentLocation);
            setCondition(currentCondition);
            setWeather(currentWeather);

            getForecast(weather.forecast);
        } catch (error) {
            console.log(error);
        }
    };
    
    const getForecast = (forecast) => {
        let currentForecast = [];
        forecast.forecastday.forEach((day) => {
            currentForecast.push(day.day);
        })
        setForecast({currentForecast});
    }

    const handleSubmit = (e) => {
        // prevent page from loading
        e.preventDefault();
        const targetCity = e.target.elements[0].value;
        let city = targetCity;
        if (!city) {
            alert("Please enter a city.");
            return;
        }
        getWeather(city);
    }

    const renderForecast = () => {
        return (
            <div className="tile-day-container">
                {forecast.currentForecast.map((day, index) => {
                    return (
                        <div className="tile-day" key={index}>
                            <h3>{day.date}</h3>
                            <h3>temp: {day.avgtemp_c}</h3>
                            <h3>condition: {day.condition.text}</h3>
                        </div>
                    )
                })}
            </div>
        )
    }



    const renderWeather = () => {
        return (
            <div className="body">
                <div className="tile-container">
                    <div className="tile-current">
                        <img src={condition.icon} alt="weather"></img>
                        <h4>as of { time }, { location.name } is { condition.text.toLocaleLowerCase() }.</h4>
                        <h4>temp: {weather.temp_c}</h4>
                        <h4>wind: {weather.wind_kph}</h4>
                    </div>
                </div>
            </div>
        )
    }
    
    return (
        <div className="body">
            <div className="search-container">
                <h1 className="search-text">what's the weather like in </h1>
                <form onSubmit={handleSubmit} className="search-form">
                    <input type="text" spellCheck="false" placeholder="Sydney?"/>
                </form>
            </div>
            {weather ? renderWeather() : null}
            {forecast ? renderForecast() : null}
        </div>
    );
}
 
export default Body;