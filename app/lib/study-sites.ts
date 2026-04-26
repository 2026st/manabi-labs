export type StudySite = {
  id: string;
  label: string;
  url: string;
};

const STORAGE_KEY = "manabi-study-sites";

const DEFAULT_SITES: StudySite[] = [
  {
    id: "fe-kakomon",
    label: "基本情報技術者過去問道場",
    url: "https://www.fe-siken.com/fekakomon.php"
  }
];

function readFromStorage(): StudySite[] {
  if (typeof window === "undefined") return [];
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (site): site is StudySite =>
        typeof site === "object" &&
        site !== null &&
        typeof (site as StudySite).id === "string" &&
        typeof (site as StudySite).label === "string" &&
        typeof (site as StudySite).url === "string"
    );
  } catch {
    return [];
  }
}

function saveToStorage(sites: StudySite[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(sites));
}

export function listStudySites(): StudySite[] {
  return [...DEFAULT_SITES, ...readFromStorage()];
}

export function addStudySite(input: { label: string; url: string }): boolean {
  const trimmedLabel = input.label.trim();
  const trimmedUrl = input.url.trim();
  if (!trimmedLabel || !trimmedUrl) return false;

  let normalizedUrl = trimmedUrl;
  if (!/^https?:\/\//i.test(normalizedUrl)) {
    normalizedUrl = `https://${normalizedUrl}`;
  }

  try {
    const parsed = new URL(normalizedUrl);
    if (!["http:", "https:"].includes(parsed.protocol)) return false;
    const sites = readFromStorage();
    sites.push({
      id: crypto.randomUUID(),
      label: trimmedLabel,
      url: parsed.toString()
    });
    saveToStorage(sites);
    return true;
  } catch {
    return false;
  }
}
