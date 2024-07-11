const zeroPad = (num, pad) => {
    return String(num).padStart(pad, '0');
}

const isSameDay = (d1, d2) => {
    return (
        d1.getFullYear() === d2.getFullYear() &&
        d1.getMonth() === d2.getMonth() &&
        d1.getDate() === d2.getDate()
    );
}

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
}

const parseTimestamp = (timestamp, format = '') => {
    if (!timestamp) { return; }

    const date = typeof timestamp === 'number'
        ? new Date(timestamp * 1000)
        : timestamp;

    if (format === 'HH:mm') {
        return `${zeroPad(date.getHours(), 2)}:${zeroPad(date.getMinutes(), 2)}`;
    } else if (format === 'DD MMMM YYYY') {
        const options = { month: 'long', year: 'numeric', day: 'numeric' };
        return `${new Intl.DateTimeFormat('en-GB', options).format(date)}`;
    } else if (format === 'DD/MM/YY') {
        const options = { month: 'numeric', year: 'numeric', day: 'numeric' };
        return `${new Intl.DateTimeFormat('en-GB', options).format(date)}`;
    } else if (format === 'DD MMMM, HH:mm') {
        const options = { month: 'long', day: 'numeric' };
        return `${new Intl.DateTimeFormat('en-GB', options).format(date)}, ${zeroPad(date.getHours(), 2)}:${zeroPad(date.getMinutes(), 2)}`;
    }

    return date;
}

const formatTimestamp = (timestamp) => {
    const date = typeof timestamp === 'number'
        ? new Date(timestamp * 1000)
        : timestamp;

    const now = new Date();
    if (isSameDay(date, now)) {
        const timeAgoResult = timeAgo(date);
        return timeAgoResult ? timeAgoResult : `${parseTimestamp(timestamp, 'HH:mm')}`;
    } else {
        return parseTimestamp(timestamp, 'DD/MM/YY');
    }
}

export { parseTimestamp, formatTimestamp };
