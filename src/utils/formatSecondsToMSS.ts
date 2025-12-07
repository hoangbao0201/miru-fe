export default function formatSeconds(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return '0:00';

  const s = Math.floor(seconds);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;

  const mm = String(m).padStart(2, '0');
  const ss = String(sec).padStart(2, '0');

  return h > 0 ? `${h}:${mm}:${ss}` : `${m}:${ss}`;
}