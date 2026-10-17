'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'

interface WeatherData {
  current_weather: {
    temperature: number
    windspeed: number
  }
}

const CITIES = {
  Tokyo: { lat: 35.6762, lon: 139.6503 },
  'New York': { lat: 40.7128, lon: -74.0060 },
  London: { lat: 51.5074, lon: -0.1278 },
  Sydney: { lat: -33.8688, lon: 151.2091 },
} as const

type CityName = keyof typeof CITIES

export default function ClientWeatherWidget() {
  const [city, setCity] = useState<CityName>('Tokyo')
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchWeather = async () => {
      setLoading(true)
      setError(null)
      try {
        const { lat, lon } = CITIES[city]
        const response = await axios.get(
          `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`
        )
        setWeather(response.data)
      } catch {
        setError('No se pudo cargar el clima. Intenta de nuevo más tarde.')
        setWeather(null)
      } finally {
        setLoading(false)
      }
    }
    fetchWeather()
  }, [city])

  return (
    <div className="bg-white rounded-xl shadow-2xl border-4 border-black overflow-hidden">
      <div className="bg-green-400 text-center py-3 px-6 border-b-4 border-black">
        <h2 className="text-xl font-bold">🌐 Widget CSR</h2>
        <p className="text-sm">Cliente - datos dinámicos</p>
      </div>

      <div className="p-8">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Selecciona una ciudad:
        </label>
        <select
          value={city}
          onChange={(e) => setCity(e.target.value as CityName)}
          className="w-full border-2 border-gray-300 rounded-lg px-4 py-2 mb-6 focus:outline-none focus:border-green-500"
        >
          {Object.keys(CITIES).map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>

        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-green-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Cargando clima...</p>
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-4xl">⚠️</p>
            <p className="mt-2 text-red-600 font-semibold">{error}</p>
          </div>
        ) : weather ? (
          <div className="text-center">
            <p className="text-gray-700 text-2xl font-bold">{city}</p>
            <p className="text-5xl font-bold text-green-600 mt-2">
              {weather.current_weather.temperature}°C
            </p>
            <p className="text-gray-600 mt-2">
              💨 Viento: {weather.current_weather.windspeed} km/h
            </p>
          </div>
        ) : null}

        <div className="mt-8 p-4 bg-green-50 rounded-lg border-2 border-green-200">
          <p className="text-sm text-green-800">
            💡 <strong>CSR:</strong> Los datos se actualizan dinámicamente sin recargar la página.
          </p>
        </div>
      </div>
    </div>
  )
}
