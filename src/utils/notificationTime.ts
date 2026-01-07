export const normalizeDate = (createdAt: any): Date | null => {
  if (!createdAt) return null;

  // ISO string
  if (typeof createdAt === 'string') {
    const d = new Date(createdAt);
    return isNaN(d.getTime()) ? null : d;
  }

  // Java LocalDateTime array
  if (Array.isArray(createdAt)) {
    const [year, month, day, hour = 0, minute = 0, second = 0, nano = 0] =
      createdAt;

    return new Date(
      year,
      month - 1,
      day,
      hour,
      minute,
      second,
      Math.floor(nano / 1_000_000),
    );
  }

  return null;
};

export const formatNotificationTime = (createdAt: any) => {
  const date = normalizeDate(createdAt);
  if (!date) return 'Just now';

  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);

  if (diffMin < 1) return 'Just now';
  if (diffMin < 60) return `${diffMin} min ago`;

  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr} hr ago`;

  return date.toLocaleDateString();
};
