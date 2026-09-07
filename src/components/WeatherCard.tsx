import { useEffect, useState } from "react";
import {
  Cloud,
  CloudDrizzle,
  CloudFog,
  CloudLightning,
  CloudRain,
  CloudSnow,
  CloudSun,
  Droplets,
  Sun,
} from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { TARGET, DAY } from "@/lib/countdown";

/** Freamunde — Glicínia Wedding House */
const LAT = 41.28;
const LON = -8.35;
const WEDDING_DAY = "2026-09-19";

/** Alcance fiável de qualquer previsão. */
const JANELA = 14 * DAY;

type Previsao = {
  code: number;
  max: number;
  min: number;
  rain: number;
};

async function fetchPrevisao(): Promise<Previsao | null> {
  const url =
    `https://api.open-meteo.com/v1/forecast?latitude=${LAT}&longitude=${LON}` +
    `&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max` +
    `&timezone=Europe%2FLisbon&start_date=${WEDDING_DAY}&end_date=${WEDDING_DAY}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("weather");
  const json = (await res.json()) as {
    daily?: {
      weather_code?: number[];
      temperature_2m_max?: number[];
      temperature_2m_min?: number[];
      precipitation_probability_max?: (number | null)[];
    };
  };
  const d = json.daily;
  if (!d?.weather_code?.length) return null;
  return {
    code: d.weather_code[0],
    max: Math.round(d.temperature_2m_max?.[0] ?? 0),
    min: Math.round(d.temperature_2m_min?.[0] ?? 0),
    rain: Math.round(d.precipitation_probability_max?.[0] ?? 0),
  };
}

/** Códigos WMO → ícone + descrição curta. */
function descrever(code: number, lang: "pt" | "en") {
  const en = lang === "en";
  if (code === 0) return { Icon: Sun, label: en ? "Clear sky" : "Céu limpo" };
  if (code <= 2) return { Icon: CloudSun, label: en ? "Partly cloudy" : "Parcialmente nublado" };
  if (code === 3) return { Icon: Cloud, label: en ? "Cloudy" : "Nublado" };
  if (code <= 48) return { Icon: CloudFog, label: en ? "Fog" : "Nevoeiro" };
  if (code <= 57) return { Icon: CloudDrizzle, label: en ? "Drizzle" : "Chuvisco" };
  if (code <= 67) return { Icon: CloudRain, label: en ? "Rain" : "Chuva" };
  if (code <= 77) return { Icon: CloudSnow, label: en ? "Snow" : "Neve" };
  if (code <= 82) return { Icon: CloudRain, label: en ? "Showers" : "Aguaceiros" };
  if (code <= 86) return { Icon: CloudSnow, label: en ? "Snow showers" : "Aguaceiros de neve" };
  return { Icon: CloudLightning, label: en ? "Thunderstorm" : "Trovoada" };
}

/**
 * Previsão do tempo para o dia do casamento.
 *
 * Antes de faltarem 14 dias não há previsão nenhuma que valha a pena mostrar,
 * por isso o cartão limita-se a dizer quando é que aparece.
 */
export function WeatherCard() {
  const { lang } = useI18n();
  const en = lang === "en";

  const dentroDaJanela = TARGET - Date.now() <= JANELA;

  const [data, setData] = useState<Previsao | null>(null);

  useEffect(() => {
    if (!dentroDaJanela) return;
    let vivo = true;
    fetchPrevisao()
      .then((p) => {
        if (vivo) setData(p);
      })
      .catch(() => {
        /* sem previsão: o cartão simplesmente não aparece */
      });
    return () => {
      vivo = false;
    };
  }, [dentroDaJanela]);

  const titulo = en ? "Weather on the day" : "O tempo no dia";

  if (!dentroDaJanela) {
    return (
      <Moldura titulo={titulo}>
        <p className="text-xs sm:text-sm" style={{ color: "var(--foreground)", opacity: 0.75 }}>
          {en
            ? "The forecast shows up here from 5 September."
            : "A previsão aparece aqui a partir de 5 de setembro."}
        </p>
      </Moldura>
    );
  }

  // Sem dados (ainda a carregar ou falhou): não se mostra nada.
  if (!data) return null;

  const { Icon, label } = descrever(data.code, lang);

  return (
    <Moldura titulo={titulo}>
      <div className="flex items-center justify-center gap-4 sm:gap-6 flex-wrap">
        <Icon
          size={38}
          strokeWidth={1.1}
          aria-hidden
          style={{ color: "var(--olive)" }}
        />
        <div className="text-left">
          <p
            className="font-display text-2xl sm:text-3xl leading-none"
            style={{ color: "var(--primary)" }}
          >
            {data.max}°<span className="text-base sm:text-lg opacity-60"> / {data.min}°</span>
          </p>
          <p className="text-xs sm:text-sm mt-1" style={{ color: "var(--foreground)", opacity: 0.8 }}>
            {label}
          </p>
        </div>
        <span
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm"
          style={{ color: "var(--foreground)", opacity: 0.75 }}
        >
          <Droplets size={15} strokeWidth={1.5} style={{ color: "var(--olive)" }} />
          {data.rain}% {en ? "chance of rain" : "de chuva"}
        </span>
      </div>
    </Moldura>
  );
}

function Moldura({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <div
      className="mx-auto mt-4 sm:mt-6 px-5 py-5 sm:py-6 text-center"
      style={{
        maxWidth: 900,
        background: "var(--ivory)",
        border: "1px solid var(--gold)",
        borderRadius: "var(--card-radius)",
      }}
    >
      <p
        className="uppercase text-xs sm:text-sm mb-3"
        style={{
          fontFamily: "Cinzel, serif",
          color: "var(--olive)",
          letterSpacing: "0.3em",
          fontWeight: 500,
        }}
      >
        {titulo}
      </p>
      {children}
    </div>
  );
}
