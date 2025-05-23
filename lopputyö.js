/* My API keys for access to API requests*/
const API_key_openweather = '6e6585db52d9a23c22236394533cf25c'; 
const AccessKey = `U9zhefkoCEJjkAzC8fcHLYwMcz9BuPEqGN8bU30SF_g`;

/* We can also use LocalStorage for saving city, which indicated by user*/
function saveUserInput (user_city){
    localStorage.setItem('userinput', user_city);
}
/* Check the name of the city entered by the user. */
function checkUserInput(userCity) {
    const cleanInput = userCity.trim();
    let error = ''; // Message to display on error

    if (cleanInput === '') {
        error = 'Invalid input: empty value.';
    } else if (/^\d+$/.test(cleanInput)) {
        error = 'Invalid input: numbers are not allowed.';
    } else if (/[^a-zA-Z\s-]/.test(cleanInput)) {
        error = 'Invalid input: special characters are not allowed.';
    }

    if (error) {
        displayDataError(cleanInput, error);
        alert(error);
        return false;
    }

    return true;
}

/*Function for display errors on DOM HTML page*/
function displayDataError(userCity, error) {
    const resultContainer = document.getElementById('data_result');
    if (!resultContainer) return;

// Clear old data if necessary:
    resultContainer.innerHTML = '';

    const errorMessage = document.createElement('p');
    errorMessage.className = 'error-message'; // Можно использовать CSS-стиль
    errorMessage.textContent = `⚠️ Error: ${error}. "${userCity}" does not exist or could not be found.`;

    resultContainer.appendChild(errorMessage);
}

/*Display data about current weather in HTML*/
function displayData(userCity, temp, tempMax, feelsLike, weatherImgUrl, description, wind, humidity) {
    const resultContainer = document.getElementById('data_result');
    if (!resultContainer) return;

    // Clear old data
    resultContainer.innerHTML = '';

   // Header icon
    const headerIcon = document.createElement('img');
    headerIcon.src = 'img/icons8-rain-cloud-50.png';
    headerIcon.alt = 'Weather Icon';
    headerIcon.className = 'small_icon';

    //Heading
    const headerText = document.createElement('h3');
    headerText.textContent = `Current weather in ${userCity}`;

    const headerWrapper = document.createElement('div');
    headerWrapper.className = 'header_with_icon';
    headerWrapper.appendChild(headerIcon);
    headerWrapper.appendChild(headerText);

    // Weather icon
    const weatherIcon = document.createElement('img');
    weatherIcon.src = weatherImgUrl;
    weatherIcon.alt = description;

    // Main text
    const weatherInfo = document.createElement('p');
    weatherInfo.innerHTML = `
        <br><strong>${temp}°</strong><br>
        ${description}<br>
        💨 Wind: ${wind} m/s<br>
        🌡️ Max temperature: ${tempMax}°<br>
        🤗 Feels like: ${feelsLike}°<br>
        🌫️ Humidity: ${humidity}%
    `;

    // Adding to the DOM
    resultContainer.appendChild(headerWrapper);
    resultContainer.appendChild(weatherIcon);
    resultContainer.appendChild(weatherInfo);
}

/*For display forecast block about weather*/
function displayDataForecast(userCity, maxTemp, minTemp, iconUrl, descDay, descNight, humidity) {
    const forecastContainer = document.getElementById('forecast');
    if (!forecastContainer) return;

    
    forecastContainer.innerHTML = '';

    // Icon + title
    const headerIcon = document.createElement('img');
    headerIcon.src = 'img/icons8-dew-point-50.png';
    headerIcon.alt = 'Forecast Icon';
    headerIcon.className = 'small_icon';

    const headerText = document.createElement('h3');
    headerText.textContent = `Forecast for tomorrow in ${userCity}`;

    const headerWrapper = document.createElement('div');
    headerWrapper.className = 'header_with_icon_forecast';
    headerWrapper.appendChild(headerIcon);
    headerWrapper.appendChild(headerText);

    // Weather icon
    const forecastIcon = document.createElement('img');
    forecastIcon.src = iconUrl;
    forecastIcon.alt = `${descDay} icon`;

    // Text in Forecast
    const forecastText = document.createElement('p');
    forecastText.innerHTML = `
        <strong>${maxTemp}° / ${minTemp}°</strong><br>
        ${descDay} / ${descNight}<br>
        🌫️Humidity: ${humidity}%
    `;

    // Add to DOM
    forecastContainer.appendChild(headerWrapper);
    forecastContainer.appendChild(forecastIcon);
    forecastContainer.appendChild(forecastText);
}

/*For display NEWS block about city*/
function displayNews(userCity, newsHeadline, newsDate, newsSource, newsImage, newsDescription, newsUrl, errorMessage) {
    const dataNews = document.getElementById('data_news');
    if (!dataNews) return;

    // Clearing previous news
    dataNews.innerHTML = '';

    // If error
    if (errorMessage) {
        const errorBlock = document.createElement('h3');
        errorBlock.textContent = errorMessage;
        dataNews.appendChild(errorBlock);
        return;
    }

    // Icon + title
    const iconImg = document.createElement('img');
    iconImg.src = 'img/news.png';
    iconImg.className = 'small_icon';

    const headerText = document.createElement('h3');
    headerText.textContent = `News about ${userCity}`;

    const headerContainer = document.createElement('div');
    headerContainer.className = 'header_with_icon';
    headerContainer.appendChild(iconImg);
    headerContainer.appendChild(headerText);

    // title
    const articleTitle = document.createElement('h4');
    articleTitle.innerHTML = `<a href="${newsUrl}" target="_blank" rel="noopener noreferrer">${newsHeadline}</a>`;
    articleTitle.style.marginBottom = '10px';

    // Image with preloader
    const imageWrapper = document.createElement('div');
    const loadingGif = document.createElement('img');
    loadingGif.src = 'loading.gif';
    loadingGif.alt = 'Loading...';

    const image = document.createElement('img');
    image.src = newsImage || 'default-news.jpg';
    image.alt = newsHeadline;
    image.style.display = 'none';

    image.onload = () => {
        image.style.display = 'block';
        loadingGif.remove();
    };

    imageWrapper.appendChild(loadingGif);
    imageWrapper.appendChild(image);

    // Source and date
    const sourceAndDate = document.createElement('p');
    const formattedDate = new Date(newsDate).toLocaleString();
    sourceAndDate.innerHTML = `<i>${newsSource}</i> | ${formattedDate}`;
    sourceAndDate.className = 'news-source-and-date';

    // Description
    const description = document.createElement('p');
    description.textContent = newsDescription;
    description.className = 'news-description';

    // Add to DOM
    dataNews.appendChild(headerContainer);
    dataNews.appendChild(imageWrapper);
    dataNews.appendChild(articleTitle);
    dataNews.appendChild(sourceAndDate);
    dataNews.appendChild(description);
}

/*Set the background of page to the city requested by the user*/
function displayBackground(image_for_background){
    const body_background = document.querySelector('body');
    body_background.style.backgroundImage = `url(${image_for_background})`;

}
/*Getting data about weather in requested city*/
async function checkWeather(user_city) {
    try {
        const request = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${user_city}&units=metric&appid=${API_key_openweather}`);
        if (request.ok){
            const data = await request.json(); /*getting json for find there information*/
            let city_temp = Math.round(data.main.temp); /*using Math.round() for rounding degrees*/
            let city_temp_max = Math.round(data.main.temp_max);
            let city_feels_like = Math.round(data.main.feels_like);
            let city_weather_img = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`; /*icon of current weather*/
            let description = data.weather[0].description.charAt(0).toUpperCase() + data.weather[0].description.slice(1); /*need to make first letter big*/
            let wind = data.wind.speed;
            let city_humidity = data.main.humidity;
            
            
            console.log(`Current temperature in ${user_city}: ${city_temp}°`);
            displayData(user_city, city_temp, city_temp_max, city_feels_like, city_weather_img, description, wind, city_humidity);
            
        } else {
            displayDataError(user_city, request.status);
        }
    } catch(error){
        console.log(error); 
    }
    
}
/* Weather forecast for tomorrow */
async function forecastWeather(userCity) {
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(userCity)}&cnt=24&units=metric&appid=${API_key_openweather}`;

    try {
        const response = await fetch(url);

        if (!response.ok) {
            const errorData = await response.json();
            console.error(`Forecast error (${response.status}): ${errorData.message}`);
            displayDataError(userCity, errorData.message);
            return;
        }

        const data = await response.json();

        const dayIndex = 9;   // about 12:00
        const nightIndex = 5; // about 03:00–06:00

        const day = data.list[dayIndex];
        const night = data.list[nightIndex];

        const tempMax = Math.round(day.main.temp_max);
        const tempMin = Math.round(night.main.temp_min);
        const humidity = day.main.humidity;
        const iconUrl = `https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`;

        const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);

        const descriptionDay = capitalize(day.weather[0].description);
        const descriptionNight = capitalize(night.weather[0].description);

        displayDataForecast(userCity, tempMax, tempMin, iconUrl, descriptionDay, descriptionNight, humidity);
        
    } catch (error) {
        console.error('Request failed:', error.message);
        displayDataError(userCity, error.message);
    }
}
// Fetch news by city tag. This doesn't work exactly as intended — the API only provides news from the past day that mentions the specified city.
// More flexible filtering and advanced options would require a paid API subscription.
async function getNews(userCity) {
    const apiKey = 'a47539b9e67e4541b6e0f5714243707c';
    const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(userCity)}&pageSize=15&sortBy=publishedAt&apiKey=${apiKey}`;

    try {
        const response = await fetch(url);

        if (!response.ok) {
            const errorData = await response.json();
            console.error(`Error ${response.status}: ${errorData.message}`);
            displayNews(null, null, null, null, null, null, null, errorData.message);
            return;
        }

        const data = await response.json();
        const articles = data.articles;

        if (!articles || articles.length === 0) {
            displayNews(null, null, null, null, null, null, null, 'No articles found.');
            return;
        }

        const randomIndex = Math.floor(Math.random() * articles.length);
        const article = articles[randomIndex];

        displayNews(
            userCity,
            article.title,
            article.publishedAt,
            article.source?.name || 'Unknown Source',
            article.urlToImage,
            article.description,
            article.url,
            null
        );

    } catch (error) {
        console.error('Fetch error:', error.message);
        alert(`Request failed: ${error.message}`);
    }
}

/* Here we get an image of the city, which we use for the background*/
async function getCityImage(userCity) {
    const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(userCity + ' downtown')}&client_id=${AccessKey}&orientation=landscape&order_by=popular`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        if (data.results.length > 3) {
            const imageForBackground = data.results[3].urls.full;
            displayBackground(imageForBackground);
        } else if (data.results.length > 0) {
            const imageForBackground = data.results[0].urls.full;
            displayBackground(imageForBackground);
        } else {
            console.warn('No images found for the specified city.');
        }

    } catch (error) {
        console.error('Failed to fetch image:', error);
    }
}


/* Start all code*/
window.onload = function(){

/*Checking, if we have already users city in localStorage, and if yes we put this value to input: */
   const savedUserInput = localStorage.getItem('userinput');

    if (savedUserInput !== null) {
        console.log(`Saved data: ${savedUserInput}`);
        const cityInput = document.getElementById('city');
        if (cityInput) {
            cityInput.value = savedUserInput;
        }
}
    const form_input = document.getElementById('userinput')
    const data_forecast = document.getElementById('forecast')

    let input_line = document.getElementById('city');
    input_line.focus();    

    form_input.addEventListener('submit', function(e) {
    e.preventDefault();

    const city = document.getElementById('city').value.trim();
    input_line.focus();

    if (!checkUserInput(city)) return;

    // Clear blocks inner and making it visible
    [data_result, data_forecast, data_news].forEach(section => {
        section.innerHTML = "";
        section.style.display = "block";
    });

    saveUserInput(city);
    getCityImage(city);
    checkWeather(city);
    forecastWeather(city);
    getNews(city);
});
    
}