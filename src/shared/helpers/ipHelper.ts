import { Request } from "express";

/**
 * Extract real client IP — handles proxies & load balancers
 */
export const getClientIp = (req: Request): string => {
  const forwarded = req.headers["x-forwarded-for"];
  if (forwarded) {
    const forwardedStr = Array.isArray(forwarded) ? forwarded[0] : forwarded;
    return forwardedStr.split(",")[0].trim();
  }
  return (req.headers["x-real-ip"] as string) || req.socket?.remoteAddress || "0.0.0.0";
};

export default { getClientIp };
