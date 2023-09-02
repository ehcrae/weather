export let city = "BANANAS";

const findCity = (e) => {
    // prevent page from loading
    e.preventDefault();
    const targetCity = e.target.elements[0].value;
    if (targetCity) {
        getWeather(targetCity);
        // strip whitespace and numeric characters
        city = targetCity.replace(/\s/g, "").replace(/[0-9]/g, "");
    }
}

const getWeather = async (city) => {
    const res = await fetch(`http://localhost:3000/weather/${city}`);
    const weather = await res.json();
    console.log(weather);
};

const Search = () => {
    return (
        <div className="search">
            <form onSubmit={findCity}>
                <input type="text" placeholder="City"/>
                <button type="submit">Search</button>
            </form>
        </div>
    );
}
 
export default Search;