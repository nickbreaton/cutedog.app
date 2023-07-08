import { Timezone } from "./types";

/**
 * Stored so we can display UTC date in correct local time,
 * regardless of user's current timezone.
 *
 * @source https://stackoverflow.com/a/24500441
 */
export function getLocalOffset(date = new Date()): Timezone {
  function z(n: any) {
    return (n < 10 ? "0" : "") + n;
  }
  var offset = date.getTimezoneOffset();
  var sign = offset < 0 ? "+" : "-";
  offset = Math.abs(offset);
  return (sign + z((offset / 60) | 0) + z(offset % 60)) as Timezone;
}

export function getTimeZoneForIntl(offset: Timezone) {
  const [sign, h, hh] = offset;
  return `Etc/GMT${sign === "-" ? "+" : "-"}${parseInt(h + hh)}`;
}

export function getUTCDateTime(date = new Date()) {
  return date.toISOString().slice(0, 19).replace("T", " ");
}

export function getDateOneYearFromNow() {
  const currentDate = new Date();
  const oneYearFromNow = new Date(currentDate.getFullYear() + 1, currentDate.getMonth(), currentDate.getDate());
  return oneYearFromNow;
}
