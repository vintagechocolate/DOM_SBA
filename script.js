// Cache DOM elements
const searchForm = document.querySelector('#search-form');
const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');
const weatherDisplay = document.getElementById('weather-display');

// Retrieve previous search queries from localStorage
const previousSearches = JSON.parse(localStorage.getItem('previousSearches')) || [];
previousSearches.forEach(location => {
  const searchItem = document.createElement('div');
  searchItem.textContent = location;
  searchItem.classList.add('search-item');
  searchItem.addEventListener('click', handlePreviousSearch);
  weatherDisplay.appendChild(searchItem);
});

// Event listener for form submission
searchForm.addEventListener('submit', handleSearch);

// Event listener for search button click
searchBtn.addEventListener('click', handleSearch);

// Event listener for search input validation
searchInput.addEventListener('keyup', validateSearchInput);

// Function to handle search form submission
async function handleSearch(event) {
  event.preventDefault();
  const location = searchInput.value.trim();

  if (location) {
    try {
      const weatherData = await fetchWeatherData(location);
      displayWeatherData(weatherData);

      // Save the search query to localStorage
      saveSearchToHistory(location);
    } catch (error) {
      displayErrorMessage('Error fetching weather data. Please try again.');
    }

    // Clear the search input
    searchInput.value = '';
  }
}

// Function to fetch weather data from an API
async function fetchWeatherData(location) {
  const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=14cd57c29966663b0e86e147ec9a974a&units=metric`);
  const data = await response.json();
  return data;
}

// Function to display weather data
function displayWeatherData(data) {
  weatherDisplay.innerHTML = '';

  const weatherInfo = document.createElement('div');
  weatherInfo.classList.add('weather-info');

  const cityName = document.createElement('h2');
  cityName.textContent = data.name;

  const temperature = document.createElement('p');
  temperature.textContent = `Temperature: ${data.main.temp}°C`;

  const description = document.createElement('p');
  description.textContent = `Description: ${data.weather[0].description}`;

  weatherInfo.appendChild(cityName);
  weatherInfo.appendChild(temperature);
  weatherInfo.appendChild(description);
  weatherDisplay.appendChild(weatherInfo);
}

// Function to save search query to localStorage
function saveSearchToHistory(location) {
  let previousSearches = JSON.parse(localStorage.getItem('previousSearches')) || [];

  // Check if the location is already in the history
  if (!previousSearches.includes(location)) {
    previousSearches.push(location);
    localStorage.setItem('previousSearches', JSON.stringify(previousSearches));

    // Create a new search item element
    const searchItem = document.createElement('div');
    searchItem.textContent = location;
    searchItem.classList.add('search-item');
    searchItem.addEventListener('click', handlePreviousSearch);
    weatherDisplay.appendChild(searchItem);
  }
}

// Function to handle clicking on a previous search item
function handlePreviousSearch(event) {
  const location = event.target.textContent;
  searchInput.value = location;
  handleSearch(event);
}

// Function to validate search input
function validateSearchInput(event) {
  const input = event.target;
  const errorMessage = document.createElement('div');
  errorMessage.classList.add('error-message');

  if (!input.checkValidity()) {
    errorMessage.textContent = 'Please enter a valid location.';
    input.parentNode.appendChild(errorMessage);
  } else {
    const errorElement = input.parentNode.querySelector('.error-message');
    if (errorElement) {
      errorElement.remove();
    }
  }
}

// Function to display an error message
function displayErrorMessage(message) {
  const errorMessage = document.createElement('div');
  errorMessage.classList.add('error-message');
  errorMessage.textContent = message;
  weatherDisplay.appendChild(errorMessage);
}
