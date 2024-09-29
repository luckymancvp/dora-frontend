const zeroPad = (num, pad) => {
  return String(num).padStart(pad, "0");
};

const isSameDay = (d1, d2) => {
  return d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth() && d1.getDate() === d2.getDate();
};

const timeAgo = (date) => {
  const now = new Date();
  const secondsAgo = Math.floor((now - date) / 1000);
  const minutesAgo = Math.floor(secondsAgo / 60);
  const hoursAgo = Math.floor(minutesAgo / 60);

  if (secondsAgo < 60) {
    return `${secondsAgo} seconds ago`;
  } else if (minutesAgo < 60) {
    return `${minutesAgo} minutes ago`;
  } else if (hoursAgo < 24) {
    return `${hoursAgo} hours ago`;
  } else {
    return null;
  }
};

const daysAgo = (date) => {
  const now = new Date();
  const timeDiff = now - date;
  const daysAgo = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
  return daysAgo;
};

const parseTimestamp = (timestamp, format = "") => {
  if (!timestamp) {
    return;
  }

  const date = typeof timestamp === "number" ? new Date(timestamp * 1000) : timestamp;

  if (format === "HH:mm") {
    return `${zeroPad(date.getHours(), 2)}:${zeroPad(date.getMinutes(), 2)}`;
  } else if (format === "DD MMMM YYYY") {
    const options = { month: "long", year: "numeric", day: "numeric" };
    return `${new Intl.DateTimeFormat("en-GB", options).format(date)}`;
  } else if (format === "DD/MM/YY") {
    const options = { month: "numeric", year: "numeric", day: "numeric" };
    return `${new Intl.DateTimeFormat("en-GB", options).format(date)}`;
  } else if (format === "DD MMMM, HH:mm") {
    const options = { month: "long", day: "numeric" };
    return `${new Intl.DateTimeFormat("en-GB", options).format(date)}, ${zeroPad(date.getHours(), 2)}:${zeroPad(
      date.getMinutes(),
      2
    )}`;
  } else if (format === "DD/MM/YY, HH:mm") {
    const options = { day: "2-digit", month: "2-digit", year: "2-digit" };
    return `${new Intl.DateTimeFormat("en-GB", options).format(date)}, ${zeroPad(date.getHours(), 2)}:${zeroPad(
      date.getMinutes(),
      2
    )}`;
  }

  return date;
};

const formatTimestamp = (timestamp, showTime = false) => {
  const date = typeof timestamp === "number" ? new Date(timestamp * 1000) : new Date(timestamp);

  const now = new Date();
  if (isSameDay(date, now)) {
    const timeAgoResult = timeAgo(date);
    return timeAgoResult ? timeAgoResult : `${parseTimestamp(timestamp, "HH:mm")}`;
  } else {
    const dayDiff = daysAgo(date);
    if (dayDiff <= 7) {
      return `${dayDiff} day${dayDiff > 1 ? "s" : ""} ago`;
    } else {
      return parseTimestamp(timestamp, showTime ? "DD/MM/YY, HH:mm" : "DD/MM/YY");
    }
  }
};

const formatDateString = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();

  const optionsTime = { hour: "2-digit", minute: "2-digit", hour12: true };
  const optionsDate = { day: "2-digit", month: "2-digit", year: "numeric" };

  if (isSameDay(date, now)) {
    return date.toLocaleString("en-GB", optionsTime); // Format time with AM/PM
  } else {
    return date.toLocaleString("en-GB", optionsDate); // Format date as DD/MM/YYYY
  }
};

const formatDateTimestamp = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); 
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

export { parseTimestamp, formatTimestamp, formatDateString, formatDateTimestamp };
