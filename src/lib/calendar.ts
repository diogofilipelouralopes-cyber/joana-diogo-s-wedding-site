import { toast } from "sonner";

/**
 * Generate and download a .ics file for the wedding, then show a toast.
 * Compatible with Google Calendar, Apple Calendar, and Outlook.
 *
 * Event: 19 September 2026, 14:00 — 23:00 (Europe/Lisbon)
 */
export function downloadWeddingICS() {
  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Joana & Diogo//Wedding//PT",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    "UID:joana-diogo-2026-09-19@wedding",
    `DTSTAMP:${new Date()
      .toISOString()
      .replace(/[-:]/g, "")
      .replace(/\.\d{3}/, "")}`,
    "SUMMARY:Casamento Joana & Diogo",
    "DTSTART:20260919T140000",
    "DTEND:20260919T230000",
    "LOCATION:Glicínia Wedding House\\, Freamunde\\, Paços de Ferreira",
    "DESCRIPTION:A nossa maior viagem começa agora.",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");

  const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "Casamento-Joana-Diogo-19-09-2026.ics";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 1000);

  // Read current language (set by i18n provider) for the toast text.
  let added = "Adicionado ao teu calendário! 📅";
  try {
    const lang = localStorage.getItem("lang");
    if (lang === "en") added = "Added to your calendar! 📅";
  } catch {}

  toast(added, {
    style: {
      background: "var(--gold)",
      color: "var(--ivory)",
      border: "1px solid var(--gold)",
      fontFamily: "Cinzel, serif",
      letterSpacing: "0.15em",
      fontSize: "0.8rem",
      textTransform: "uppercase",
    },
  });
}
