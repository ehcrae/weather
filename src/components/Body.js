import { useState } from 'react';

const Body = () => {
    const [city, setCity] = useState("...");
    const [time, setTime] = useState("...");
    const [weather, setWeather] = useState({
        description: "placeholder",
        temperature: "placeholder",
        wind: "placeholder",
        forecast: [{
            day: "placeholder",
            temperature: "placeholder",
            wind: "placeholder"
        }]
    });

    console.log(weather);
    
    const getWeather = async (city, time) => {
        const res = await fetch(`http://localhost:3000/weather/${city}`);
        const weather = await res.json();
        setWeather(weather);
        setTime(time);
        setCity(city);
        console.log(weather);
    };

    const handleSubmit = (e) => {
        // prevent page from loading
        e.preventDefault();
        const targetCity = e.target.elements[0].value;
        // clear the input field
        let city = targetCity;
        if (!city) {
            alert("Please enter a city.");
            return;
        }
        const date = new Date();
        let hours = date.getHours() > 12 ? date.getHours() - 12 : date.getHours();
        let minutes = date.getMinutes();
        // use proper formatting
        let suffix = hours > 11 ? "pm" : "am";
        const currentTime = `${hours}:${minutes < 10 ? "0" : ""}${minutes} ${suffix}`;
        getWeather(city, currentTime);
    }

    return (
        <div className="body">
            <div className="search">
            <h1>what's the weather like in </h1>
                <form onSubmit={handleSubmit}>
                    <input type="text" placeholder="City"/>
                </form>
            </div>

            <div className="tag">
                <h2>as of { time }, { city.toLocaleLowerCase() } is { weather.description.toLocaleLowerCase() }.</h2>
            </div>

            <div className="current">
                <h3>temp: {weather.temperature.replace(/\+/, "")}</h3>
                <h4>wind: {weather.wind}</h4>
            </div>

            <div className="day-list">
                {weather.forecast.map((day, index) => {
                    return (
                        <div className="day" key={index}>
                            <p>day {day.day}: {day.temperature.replace(/\+/, "")}, {day.wind}</p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
 
export default Body;