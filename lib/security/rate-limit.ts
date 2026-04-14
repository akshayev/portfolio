type RateLimitOptions = {
  key: string;
  limit: number;
  windowMs: number;
};

type Bucket = {
  count: number;
  resetAt: number;
};

type RateLimitResult = {
  ok: boolean;
  remaining: number;
  resetAt: number;
  retryAfterSeconds: number;
};

const bucketStore = new Map<string, Bucket>();

function cleanupExpiredBuckets(now: number) {
  for (const [key, bucket] of bucketStore.entries()) {
    if (bucket.resetAt <= now) {
      bucketStore.delete(key);
    }
  }
}

export function checkRateLimit(options: RateLimitOptions): RateLimitResult {
  const now = Date.now();
  const currentBucket = bucketStore.get(options.key);

  if (!currentBucket || currentBucket.resetAt <= now) {
    const resetAt = now + options.windowMs;
    bucketStore.set(options.key, { count: 1, resetAt });
    cleanupExpiredBuckets(now);

    return {
      ok: true,
      remaining: options.limit - 1,
      resetAt,
      retryAfterSeconds: 0,
    };
  }

  if (currentBucket.count >= options.limit) {
    return {
      ok: false,
      remaining: 0,
      resetAt: currentBucket.resetAt,
      retryAfterSeconds: Math.max(1, Math.ceil((currentBucket.resetAt - now) / 1000)),
    };
  }

  currentBucket.count += 1;

  return {
    ok: true,
    remaining: options.limit - currentBucket.count,
    resetAt: currentBucket.resetAt,
    retryAfterSeconds: 0,
  };
}
