export function dateFormatter(dateString: string) {
  // Parse the date string into a Date object
  const date = new Date(dateString);

  // Array of month names
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  // Get the components of the date
  const day = date.getDate(); // Day of the month (1-31)
  const monthIndex = date.getMonth(); // Month (0-11)
  const year = date.getFullYear(); // Full year (e.g., 2025)

  // Format the result
  const formattedDate = `${monthNames[monthIndex]} ${day}, ${year}`;

  return formattedDate;
}

export function to12HourFormat(time: string) {
  const [hourStr, minuteStr,secondStr] = time.split(":");
  let hour = parseInt(hourStr, 10);
  const minute = minuteStr.padStart(2, "0");
  const period = hour >= 12 ? "PM" : "AM";

  hour = hour % 12 || 12; // Convert 0 -> 12, 13 -> 1, etc.

  return `${hour}:${minute}:${secondStr} ${period}`;
}
