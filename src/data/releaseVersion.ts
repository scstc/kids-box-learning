export function parseReleaseVersion(value: string) {
  const match = /^v?(\d{2})\.([1-4])\.([1-9]\d{0,3})$/.exec(value);
  if (!match) return null;
  const [, year, quarter, release] = match;
  return { version: `${year}.${quarter}.${Number(release)}`, versionCode: Number(year) * 100000 + Number(quarter) * 10000 + Number(release) };
}

export function nextReleaseVersion(current: string, date = new Date()) {
  const china = new Date(date.getTime() + 8 * 60 * 60 * 1000);
  const year = String(china.getUTCFullYear()).slice(-2);
  const quarter = Math.floor(china.getUTCMonth() / 3) + 1;
  const prefix = `${year}.${quarter}.`;
  return prefix + (current.startsWith(prefix) ? Number(current.split(".")[2]) + 1 : 1);
}
