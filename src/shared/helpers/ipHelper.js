/**
 * Extract real client IP — handles proxies & load balancers
 */
const getClientIp = (req) => {
  const forwarded = req.headers['x-forwarded-for'];
  if (forwarded) return forwarded.split(',')[0].trim();
  return req.headers['x-real-ip'] || req.socket?.remoteAddress || '0.0.0.0';
};

module.exports = { getClientIp };
