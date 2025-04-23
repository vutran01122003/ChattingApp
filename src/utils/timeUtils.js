export const formatMessageTime = timestamp => {
  if (!timestamp) return '';

  const messageTime = new Date(timestamp);
  const now = new Date();
  const timeDiff = now - messageTime;

  const secondsDiff = Math.floor(timeDiff / 1000);
  const minutesDiff = Math.floor(secondsDiff / 60);
  const hoursDiff = Math.floor(minutesDiff / 60);
  const daysDiff = Math.floor(hoursDiff / 24);

  if (secondsDiff < 60) {
    return 'Vừa xong';
  } else if (minutesDiff < 60) {
    return `${minutesDiff} phút`;
  } else if (hoursDiff < 24) {
    return `${hoursDiff} giờ`;
  } else if (daysDiff === 1) {
    return 'Hôm qua';
  } else if (daysDiff < 7) {
    return `${daysDiff} ngày`;
  } else {
    // Format as date if older than 1 week
    return messageTime.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  }
};

export const isSameDay = (date1, date2) => {
  if (!date1 || !date2) return false;

  const d1 = new Date(date1);
  const d2 = new Date(date2);

  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
};

export const formatFullDateTime = timestamp => {
  if (!timestamp) return '';

  const date = new Date(timestamp);
  return date.toLocaleString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};
