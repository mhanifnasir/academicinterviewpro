export interface RateLimitOptions {
  windowMs: number; // Time window in milliseconds
  maxRequests: number; // Max requests allowed per window
}

interface RateLimitRecord {
  count: number;
  resetTime: number;
}

// In-memory sliding window cache (for production VPS with multi-worker or single Node process)
const rateLimitCache = new Map<string, RateLimitRecord>();

/**
 * Clean up expired rate limit entries periodically without keeping the process alive
 */
const cleanupInterval = setInterval(() => {
  const now = Date.now();
  for (const [key, record] of rateLimitCache.entries()) {
    if (now > record.resetTime) {
      rateLimitCache.delete(key);
    }
  }
}, 60000);

if (typeof cleanupInterval === "object" && typeof cleanupInterval.unref === "function") {
  cleanupInterval.unref();
}

export function checkRateLimit(
  identifier: string,
  options: RateLimitOptions = { windowMs: 60000, maxRequests: 60 }
): {
  success: boolean;
  limit: number;
  remaining: number;
  resetMs: number;
} {
  const now = Date.now();
  const existing = rateLimitCache.get(identifier);

  if (!existing || now > existing.resetTime) {
    // New window
    rateLimitCache.set(identifier, {
      count: 1,
      resetTime: now + options.windowMs,
    });

    return {
      success: true,
      limit: options.maxRequests,
      remaining: options.maxRequests - 1,
      resetMs: options.windowMs,
    };
  }

  if (existing.count >= options.maxRequests) {
    // Limit exceeded
    return {
      success: false,
      limit: options.maxRequests,
      remaining: 0,
      resetMs: Math.max(0, existing.resetTime - now),
    };
  }

  existing.count += 1;
  return {
    success: true,
    limit: options.maxRequests,
    remaining: options.maxRequests - existing.count,
    resetMs: Math.max(0, existing.resetTime - now),
  };
}
