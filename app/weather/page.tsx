import { Suspense } from 'react'
import { connection } from 'next/server'
import axios from 'axios'
import ClientWeatherWidget from './ClientWeatherWidget'

interface WeatherData {
  current_weather: {
    temperature: number
    windspeed: number
  }
}

const FALLBACK_WEATHER: WeatherData = {
  current_weather: {
    temperature: 24.8,
    windspeed: 10.1,
  },
}

async function getLimaWeather(): Promise<WeatherData> {
  await connection()
  try {
    const response = await axios.get(
      'https://api.open-meteo.com/v1/forecast?latitude=-12.04&longitude=-77.03&current_weather=true'
    )
    return response.data
  } catch {
    return FALLBACK_WEATHER
  }
}

async function LimaWeatherCard() {
  const weather = await getLimaWeather()

  return (
    <div className="text-center">
      <p className="text-gray-700 text-2xl font-bold">Lima, Perú</p>
      <p className="text-5xl font-bold text-blue-600 mt-2">
        {weather.current_weather.temperature}°C
      </p>
      <p className="text-gray-600 mt-2">
        💨 Viento: {weather.current_weather.windspeed} km/h
      </p>
    </div>
  )
}

function LoadingSpinner() {
  return (
    <div className="text-center py-8">
      <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-500 mx-auto"></div>
      <p className="mt-4 text-gray-600">Cargando clima...</p>
    </div>
  )
}

const comparison = [
  { feature: 'SEO', ssr: 'Excelente', csr: 'Limitado' },
  { feature: 'Tiempo inicial', ssr: 'Rápido', csr: 'Más lento' },
  { feature: 'Interactividad', ssr: 'Recarga página', csr: 'Dinámica' },
  { feature: 'Carga del servidor', ssr: 'Alta', csr: 'Baja' },
]

export default function WeatherPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-500 to-indigo-600 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-yellow-400 text-center py-3 px-6 rounded-xl border-4 border-black mb-8">
          <h1 className="text-3xl font-bold">🌤️ Dashboard Híbrido</h1>
          <p className="text-sm mt-1">SSR + CSR</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-2xl border-4 border-black overflow-hidden">
            <div className="bg-blue-400 text-center py-3 px-6 border-b-4 border-black">
              <h2 className="text-xl font-bold">🌍 Servidor (SSR)</h2>
              <p className="text-sm">Lima, Perú - renderizado en el servidor</p>
            </div>
            <div className="p-8">
              <Suspense fallback={<LoadingSpinner />}>
                <LimaWeatherCard />
              </Suspense>

              <div className="mt-8 p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
                <p className="text-sm text-blue-800">
                  💡 <strong>SSR:</strong> Datos obtenidos en el servidor - SEO friendly
                </p>
              </div>
            </div>
          </div>

          <ClientWeatherWidget />
        </div>

        <div className="mt-8 bg-white rounded-xl shadow-2xl border-4 border-black overflow-hidden">
          <div className="bg-gray-200 text-center py-3 px-6 border-b-4 border-black">
            <h2 className="text-xl font-bold">📊 Comparativa SSR vs CSR</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-100 border-b-2 border-gray-300">
                  <th className="px-6 py-3 font-bold text-gray-700">Característica</th>
                  <th className="px-6 py-3 font-bold text-blue-600">SSR</th>
                  <th className="px-6 py-3 font-bold text-green-600">CSR</th>
                </tr>
              </thead>
              <tbody>
                {comparison.map((row) => (
                  <tr key={row.feature} className="border-b border-gray-200">
                    <td className="px-6 py-3 text-gray-700 font-semibold">{row.feature}</td>
                    <td className="px-6 py-3 text-gray-600">{row.ssr}</td>
                    <td className="px-6 py-3 text-gray-600">{row.csr}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
