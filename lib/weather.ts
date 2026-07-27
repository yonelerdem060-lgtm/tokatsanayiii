export type TokatWeather = {
  temperature: number;
  weatherCode: number;
  isDay: boolean;
};

/** Tokat merkez yaklaşık koordinatları */
const TOKAT_LAT = 40.3235;
const TOKAT_LON = 36.5522;

export async function getTokatWeather(): Promise<TokatWeather | null> {
  try {
    const url = new URL("https://api.open-meteo.com/v1/forecast");
    url.searchParams.set("latitude", String(TOKAT_LAT));
    url.searchParams.set("longitude", String(TOKAT_LON));
    url.searchParams.set("current", "temperature_2m,weather_code,is_day");
    url.searchParams.set("timezone", "Europe/Istanbul");

    const response = await fetch(url.toString(), {
      next: { revalidate: 1800 },
      signal: AbortSignal.timeout(1500),
    });

    if (!response.ok) return null;

    const data = (await response.json()) as {
      current?: {
        temperature_2m?: number;
        weather_code?: number;
        is_day?: number;
      };
    };

    const temperature = data.current?.temperature_2m;
    const weatherCode = data.current?.weather_code;
    if (typeof temperature !== "number" || typeof weatherCode !== "number") {
      return null;
    }

    return {
      temperature: Math.round(temperature),
      weatherCode,
      isDay: data.current?.is_day === 1,
    };
  } catch {
    return null;
  }
}

export function weatherLabel(code: number): string {
  if (code === 0) return "Açık";
  if (code === 1 || code === 2) return "Parçalı bulutlu";
  if (code === 3) return "Bulutlu";
  if (code === 45 || code === 48) return "Sisli";
  if (code >= 51 && code <= 67) return "Yağmurlu";
  if (code >= 71 && code <= 77) return "Karlı";
  if (code >= 80 && code <= 82) return "Sağanak";
  if (code >= 85 && code <= 86) return "Kar sağanağı";
  if (code >= 95) return "Fırtınalı";
  return "Değişken";
}
