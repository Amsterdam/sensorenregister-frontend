function formatEmail(email: string) {
  if (!email) return '';
  const parts = email.split('@');

  const localPart = parts[0];
  const domainPart = parts[1];

  const visibleLocal = `${localPart[0]}${'.'.repeat(localPart.length - 1)}`;
  const visibleDomain = `${domainPart[0]}${'.'.repeat(domainPart.length - 2)}${domainPart.slice(-2)}`;

  return `${visibleLocal}@${visibleDomain}`;
};

export { formatEmail };
