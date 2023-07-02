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
  var offset = new Date().getTimezoneOffset();
  var sign = offset < 0 ? "+" : "-";
  offset = Math.abs(offset);
  return sign + z((offset / 60) | 0) + z(offset % 60);
}

export function getUTCDateTime(date = new Date()) {
  return date.toISOString().slice(0, 19).replace("T", " ");
}
