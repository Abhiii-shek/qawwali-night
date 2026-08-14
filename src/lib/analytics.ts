import { track } from '@vercel/analytics';

export function trackPlayerEvent(
  eventName: string,
  properties?: Record<string, string | number | boolean>
) {
  try {
    track(eventName, properties);
    if (import.meta.env?.DEV || process.env.NODE_ENV === 'development') {
      console.log(`[Qawwali Analytics] Event: ${eventName}`, properties);
    }
  } catch (err) {
    console.warn(`[Analytics error] ${eventName}:`, err);
  }
}
