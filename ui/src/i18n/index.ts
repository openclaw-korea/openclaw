/**
 * OpenClaw Control UI - Internationalization (i18n) Module
 *
 * A lightweight i18n system for Lit web components.
 * Supports dynamic locale switching and nested translation keys.
 *
 * Based on superssr's i18n implementation:
 * https://github.com/superssr/moltbot/tree/feat/i18n-chinese-support
 */

import en from "./locales/en.json" with { type: "json" };
import zh from "./locales/zh.json" with { type: "json" };
import ja from "./locales/ja.json" with { type: "json" };
import ko from "./locales/ko.json" with { type: "json" };
import es from "./locales/es.json" with { type: "json" };
import fr from "./locales/fr.json" with { type: "json" };
import de from "./locales/de.json" with { type: "json" };
import pt from "./locales/pt.json" with { type: "json" };
import ru from "./locales/ru.json" with { type: "json" };

export type Locale = "en" | "zh" | "ja" | "ko" | "es" | "fr" | "de" | "pt" | "ru";

export type TranslationDict = Record<string, string | TranslationDict>;

const locales: Record<Locale, TranslationDict> = { en, zh, ja, ko, es, fr, de, pt, ru };

// Current locale state
let currentLocale: Locale = "en";

// Subscribers for locale changes
const subscribers = new Set<() => void>();

/**
 * Get the current locale
 */
export function getLocale(): Locale {
  return currentLocale;
}

/**
 * Set the current locale and notify subscribers
 */
export function setLocale(locale: Locale): void {
  if (locale === currentLocale) return;
  if (!locales[locale]) {
    console.warn(`[i18n] Unknown locale: ${locale}, falling back to 'en'`);
    locale = "en";
  }
  currentLocale = locale;
  localStorage.setItem("openclaw-locale", locale);
  subscribers.forEach((cb) => cb());
}

/**
 * Initialize locale from localStorage or browser preference
 */
export function initLocale(): void {
  const saved = localStorage.getItem("openclaw-locale") as Locale | null;
  if (saved && locales[saved]) {
    currentLocale = saved;
    return;
  }

  // Auto-detect from browser
  const browserLang = navigator.language.toLowerCase();
  const langCode = browserLang.split("-")[0];
  
  const langMap: Record<string, Locale> = {
    zh: "zh",
    ja: "ja",
    ko: "ko",
    es: "es",
    fr: "fr",
    de: "de",
    pt: "pt",
    ru: "ru",
  };
  
  currentLocale = langMap[langCode] ?? "en";
}

/**
 * Subscribe to locale changes (for Lit component updates)
 */
export function subscribeLocale(callback: () => void): () => void {
  subscribers.add(callback);
  return () => subscribers.delete(callback);
}

/**
 * Get a translation by key (supports nested keys with dot notation)
 * Example: t("nav.chat") or t("common.save")
 */
export function t(key: string, fallback?: string): string {
  const dict = locales[currentLocale] ?? locales.en;
  const keys = key.split(".");
  let value: string | TranslationDict | undefined = dict;

  for (const k of keys) {
    if (typeof value === "object" && value !== null) {
      value = value[k];
    } else {
      value = undefined;
      break;
    }
  }

  if (typeof value === "string") return value;

  // Fallback to English if not found in current locale
  if (currentLocale !== "en") {
    let enValue: string | TranslationDict | undefined = locales.en;
    for (const k of keys) {
      if (typeof enValue === "object" && enValue !== null) {
        enValue = enValue[k];
      } else {
        enValue = undefined;
        break;
      }
    }
    if (typeof enValue === "string") return enValue;
  }

  return fallback ?? key;
}

/**
 * Template literal tag for translations
 * Usage: i18n`nav.chat` or i18n`common.save`
 */
export function i18n(
  strings: TemplateStringsArray,
  ...values: unknown[]
): string {
  const key = strings.reduce(
    (acc, str, i) => acc + str + (values[i] ?? ""),
    "",
  );
  return t(key);
}

/**
 * Get all available locales with display names
 */
export function getAvailableLocales(): Array<{ code: Locale; name: string }> {
  return [
    { code: "en", name: "English" },
    { code: "zh", name: "中文" },
    { code: "ja", name: "日本語" },
    { code: "ko", name: "한국어" },
    { code: "es", name: "Español" },
    { code: "fr", name: "Français" },
    { code: "de", name: "Deutsch" },
    { code: "pt", name: "Português" },
    { code: "ru", name: "Русский" },
  ];
}

// Initialize on load
initLocale();
