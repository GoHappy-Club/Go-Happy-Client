export const loadDate = (time) => {
  var dt = new Date(parseInt(time));
  var months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  var month = months[dt.getMonth()];
  var day = dt.getDate();
  var hours = dt.getHours();
  var minutes = dt.getMinutes();
  var AmOrPm = hours >= 12 ? "PM" : "AM";

  hours = hours % 12 || 12;
  minutes = minutes < 10 ? "0" + minutes : minutes;

  var finalTime =
    month + " " + day + ", " + hours + ":" + minutes + " " + AmOrPm;

  return finalTime;
};
export const calculateDaysAndNights = (startTime, endTime) => {
  const millisecondsInADay = 24 * 60 * 60 * 1000; // Number of milliseconds in a day
  const days = Math.floor(
    (parseInt(endTime) - parseInt(startTime)) / millisecondsInADay
  );
  const nights = days; // Assuming nights are the same as days
  console.log(nights);
  const finalDuration = days + " days and " + nights - 1 + " nights";
  return finalDuration;
};
export const loadShortDate = (time) => {
  var dt = new Date(parseInt(time));
  var months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  var month = months[dt.getMonth()];
  var day = dt.getDate();
  var hours = dt.getHours();
  var minutes = dt.getMinutes();
  var AmOrPm = hours >= 12 ? "PM" : "AM";

  hours = hours % 12 || 12;
  minutes = minutes < 10 ? "0" + minutes : minutes;

  var finalTime = month + " " + day;

  return finalTime;
};

export const trimContent = (text, cut) => {
  if (text.length < cut) {
    return text;
  }
  return text.substring(0, cut) + "...";
};
