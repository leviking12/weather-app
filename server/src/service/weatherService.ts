import fetch from 'node-fetch'
import { URL } from 'url'
import 'dotenv/config'

interface Coordinates { lat: number; lon: number }
interface ForecastItem { date: string; temp: number; description: string }

export class Weather {
  constructor(
    public city: string,
    public coordinates: Coordinates,
    public currentTemp: number,
    public currentHumidity: number,
    public currentDescription: string,
    public forecast: ForecastItem[]
  ) {}
}

class WeatherService {
  private readonly baseUrl = process.env.API_BASE_URL!
  private readonly apiKey  = process.env.API_KEY!

  private buildGeocodeQuery(city: string): string {
    const url = new URL('/geo/1.0/direct', this.baseUrl)
    url.searchParams.set('q', city)
    url.searchParams.set('limit', '1')
    url.searchParams.set('appid', this.apiKey)
    const fullUrl = url.toString()
    console.log('Geocode URL →', fullUrl)
    return fullUrl
  }

  private async fetchLocationData(city: string): Promise<any> {
    const res = await fetch(this.buildGeocodeQuery(city))
    if (!res.ok) throw new Error(`Geocoding API error: ${res.status}`)
    return res.json()
  }

  private destructureLocationData(data: any): Coordinates {
    if (!Array.isArray(data) || data.length === 0) {
      throw new Error('Location not found')
    }
    const { lat, lon } = data[0]
    return { lat, lon }
  }

  private buildCurrentWeatherQuery(coords: Coordinates): string {
    const url = new URL('/data/2.5/weather', this.baseUrl)
    url.searchParams.set('lat', coords.lat.toString())
    url.searchParams.set('lon', coords.lon.toString())
    url.searchParams.set('units', 'metric')
    url.searchParams.set('appid', this.apiKey)
    const fullUrl = url.toString()
    console.log('Current Weather URL →', fullUrl)
    return fullUrl
  }

  private async fetchCurrentWeather(coords: Coordinates): Promise<any> {
    const res = await fetch(this.buildCurrentWeatherQuery(coords))
    if (!res.ok) {
      const txt = await res.text()
      throw new Error(`Current weather API ${res.status}: ${txt}`)
    }
    return res.json()
  }

  private buildForecastQuery(coords: Coordinates): string {
    const url = new URL('/data/2.5/forecast', this.baseUrl)
    url.searchParams.set('lat', coords.lat.toString())
    url.searchParams.set('lon', coords.lon.toString())
    url.searchParams.set('units', 'metric')
    url.searchParams.set('appid', this.apiKey)
    const fullUrl = url.toString()
    console.log('Forecast URL →', fullUrl)
    return fullUrl
  }

  private async fetchForecastData(coords: Coordinates): Promise<any> {
    const res = await fetch(this.buildForecastQuery(coords))
    if (!res.ok) {
      const txt = await res.text()
      throw new Error(`Forecast API ${res.status}: ${txt}`)
    }
    return res.json()
  }

  private parseCurrentWeather(data: any) {
    const temp = data.main.temp
    const humidity = data.main.humidity
    const description = data.weather?.[0]?.description ?? ''
    return { temp, humidity, description }
  }

  private buildForecastArray(data: any): ForecastItem[] {
    const byDate: Record<string, any[]> = {}
    data.list.forEach((item: any) => {
      const date = item.dt_txt.split(' ')[0]
      if (!byDate[date]) byDate[date] = []
      byDate[date].push(item)
    })
    const today = new Date().toISOString().split('T')[0]
    const dates = Object.keys(byDate).sort()
    const result: ForecastItem[] = []
    for (const date of dates) {
      if (date === today) continue
      const items = byDate[date]
      const chosen =
        items.find((i: any) => i.dt_txt.endsWith('12:00:00')) || items[0]
      result.push({
        date,
        temp: chosen.main.temp,
        description: chosen.weather?.[0]?.description ?? ''
      })
      if (result.length >= 5) break
    }
    return result
  }

  public async getWeatherForCity(city: string): Promise<Weather> {
    const coords = this.destructureLocationData(
      await this.fetchLocationData(city)
    )
    const currentData = await this.fetchCurrentWeather(coords)
    const forecastData = await this.fetchForecastData(coords)
    const curr = this.parseCurrentWeather(currentData)
    const forecast = this.buildForecastArray(forecastData)
    return new Weather(city, coords, curr.temp, curr.humidity, curr.description, forecast)
  }
}

export default new WeatherService()
