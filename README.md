# weather-app
Weather Dashboard App

A full-stack weather dashboard application built with Node.js, Express, and Vite (React/TypeScript) that allows users to search for current weather and a 5-day forecast for any city. Searches are saved in a history list for quick access.

Features

Search for a city's current weather (temperature, humidity, description)

View a 5-day weather forecast

Persistent search history with options to re-run or delete entries

Responsive, modern UI styled with CSS variables and flexbox

Proxy setup via Vite to route API calls to the Express server

Tech Stack

Server: Node.js, Express, TypeScript

Client: Vite, React, TypeScript, plain CSS

Data Source: OpenWeatherMap API

Persistence: In-memory (easily replaceable with a database)

Prerequisites

Node.js v16 or newer

npm or Yarn

OpenWeatherMap API key (free tier available)