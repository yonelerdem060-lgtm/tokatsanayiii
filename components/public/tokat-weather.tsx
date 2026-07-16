import { weatherLabel, type TokatWeather } from "@/lib/weather";
import { Cloud, CloudFog, CloudLightning, CloudRain, CloudSnow, Sun, Moon } from "lucide-react";

function WeatherIcon({ code, isDay }: { code: number; isDay: boolean }) {
  const className = "h-4 w-4 shrink-0 text-amber-300";

  if (code === 0) {
    return isDay ? <Sun className={className} /> : <Moon className={className} />;
  }
  if (code === 1 || code === 2 || code === 3) {
    return <Cloud className={className} />;
  }
  if (code === 45 || code === 48) {
    return <CloudFog className={className} />;
  }
  if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82)) {
    return <CloudRain className={className} />;
  }
  if ((code >= 71 && code <= 77) || (code >= 85 && code <= 86)) {
    return <CloudSnow className={className} />;
  }
  if (code >= 95) {
    return <CloudLightning className={className} />;
  }
  return <Cloud className={className} />;
}

export function TokatWeatherBadge({ weather }: { weather: TokatWeather | null }) {
  if (!weather) return null;

  return (
    <div
      className="inline-flex items-center gap-2 rounded-md border border-white/15 bg-white/10 px-2.5 py-1.5 text-sm text-white backdrop-blur-sm"
      title={`Tokat · ${weatherLabel(weather.weatherCode)}`}
    >
      <WeatherIcon code={weather.weatherCode} isDay={weather.isDay} />
      <span className="font-semibold tabular-nums">{weather.temperature}°C</span>
      <span className="hidden font-medium text-white/80 sm:inline">Tokat</span>
    </div>
  );
}
