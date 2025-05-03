// src/main.ts
import "./styles/jass.css"

interface Coordinates {
  lat: number;
  lon: number;
}

interface ForecastItem {
  date: string;
  temp: number;
  description: string;
}

interface Weather {
  city: string;
  coordinates: Coordinates;
  currentTemp: number;
  currentHumidity: number;
  currentDescription: string;
  forecast: ForecastItem[];
}

// grab your DOM elements
const form = document.getElementById('search-form') as HTMLFormElement;
const input = document.getElementById('city-input') as HTMLInputElement;
const currentEl = document.getElementById('current-weather')!;
const forecastEl = document.getElementById('forecast-container')!;

async function fetchWeather(city: string): Promise<Weather> {
  const res = await fetch('/api/weather', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ city }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to fetch weather');
  }

  return (await res.json()) as Weather;
}

function renderCurrentWeather(w: Weather) {
  // now 'w' is guaranteed non-undefined
  const { city, currentTemp, currentHumidity, currentDescription } = w;

  currentEl.innerHTML = `
    <h2>${city}</h2>
    <p>Temperature: ${currentTemp}°C</p>
    <p>Humidity: ${currentHumidity}%</p>
    <p>${currentDescription}</p>
  `;
}

function renderForecast(items: ForecastItem[]) {
  forecastEl.innerHTML = items
    .map(
      (day) => `
    <div class="forecast-item">
      <h3>${day.date}</h3>
      <p>${day.temp}°C</p>
      <p>${day.description}</p>
    </div>
  `
    )
    .join('');
}

async function handleSearchFormSubmit(e: Event) {
  e.preventDefault();

  const city = input.value.trim();
  if (!city) {
    alert('City cannot be blank');
    return;
  }

  try {
    const weather = await fetchWeather(city);
    renderCurrentWeather(weather);
    renderForecast(weather.forecast);
  } catch (err: unknown) {
    console.error(err);
    const msg = err instanceof Error ? err.message : 'Unknown error';
    alert(msg);
  }
}

form.addEventListener('submit', handleSearchFormSubmit);
