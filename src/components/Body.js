import { useState } from 'react';
import { key } from '../config.js';

import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import { Button } from '@mui/material';

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

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'left',
    color: theme.palette.text.secondary,
}));

const Body = () => {
    const [location, setLocation] = useState(null);
    const [condition, setCondition] = useState(null);
    const [weather, setWeather] = useState(null);
    const [forecast, setForecast] = useState(null);

    const [isMetric, setIsMetric] = useState(true);
    const [is12Hour, setIs12Hour] = useState(true);
    const [time, setTime] = useState(null);
    const [militaryTime, setMilitaryTime] = useState(null);
    
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
            setMilitaryTime(currentLocation.localtime.slice(-5));
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
        e.target.elements[0].value = targetCity.slice(-1) === "?" ? targetCity : e.target.elements[0].value + "?";
        let city = targetCity;
        if (!city) {
            alert("Please enter a city.");
            return;
        }
        getWeather(city);
    }

    const forecastGrid = () => {
        return (
            <Box sx={{ flexGrow: 1 }}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Item>
                            <img src={condition.icon} alt="weather symbol"></img>
                            <h1>as of { is12Hour ? time : militaryTime }, { location.name } is { condition.text.toLocaleLowerCase() }.</h1>
                            <h2>temp:</h2> <p>{ isMetric ? weather.temp_c + "°C" : weather.temp_f + "°F" }</p>
                            <h2>wind:</h2> <p>{ isMetric ? weather.wind_kph + " kph" : weather.wind_mph + " mph" }</p>
                        </Item>
                    </Grid>

                    {forecast.currentForecast.map((day, index) => {
                        return (
                            <Grid item xs={4}>
                                <Item>
                                    <h3>temp:</h3> <p>{isMetric ? day.avgtemp_c + "°C" : day.avgtemp_f + "°F"}</p>
                                    <h3>condition:</h3> <p>{day.condition.text}</p>
                                </Item>
                            </Grid>
                        )
                    })}
                </Grid>
            </Box>
        );
    }
    
    return (
        <div className="body">
            <div className="search-container">
                <h1 className="search-text">what's the weather like in </h1>
                <form onSubmit={handleSubmit} className="search-form">
                    <input type="text" spellCheck="false" placeholder="Sydney?"/>
                </form>
                <Button variant="outlined" onClick={() => setIsMetric(!isMetric)}>{isMetric ? "Imperial" : "Metric"}</Button>
                <Button variant="outlined" onClick={() => setIs12Hour(!is12Hour)}>{is12Hour ? "24hr" : "12hr"}</Button>
            </div>
            {forecast ? forecastGrid() : null}
        </div>
    );
}
 
export default Body;