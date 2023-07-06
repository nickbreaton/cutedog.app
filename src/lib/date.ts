import { Timezone } from "./types";

/**
 * Stored so we can display UTC date in correct local time,
 * regardless of user's current timezone.
 *
 * @source https://stackoverflow.com/a/24500441
 */
export function getLocalOffset(date = new Date()) {
  function z(n: any) {
    return (n < 10 ? "0" : "") + n;
  }
  var offset = date.getTimezoneOffset();
  var sign = offset < 0 ? "+" : "-";
  offset = Math.abs(offset);
  return sign + z((offset / 60) | 0) + z(offset % 60);
}

export function getDateFromTimezoneOffset(utc: string, offset: Timezone) {
  const direction = offset[0] === "-" ? -1 : 1;
  const hours = parseInt(offset[1] + offset[2]);
  const minutes = parseInt(offset[3] + offset[4]);

  // -0400 === 240
  // (4 hours, 0 minutes) === (4 * 60)

  // 0100 === -60
  // (1 hours, 0 minutes) === (1 * 60)

  const totalMinutes = hours * minutes * direction * -1;
  return new Date(new Date(`${utc}+0000`).getTime() + totalMinutes * 60 * 1000);
}

export function getUTCDateTime(date = new Date()) {
  return date.toISOString().slice(0, 19).replace("T", " ");
}

export function getDateOneYearFromNow() {
  const currentDate = new Date();
  const oneYearFromNow = new Date(currentDate.getFullYear() + 1, currentDate.getMonth(), currentDate.getDate());
  return oneYearFromNow;
}
