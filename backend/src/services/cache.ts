/**
 * @file: cache.ts
 * @description: Простий in-memory cache з підтримкою TTL для backend
 * @dependencies: none
 * @created: 2025-11-07
 */

type CacheRecord<T> = {
  value: T;
  expiresAt?: number;
};

export class InMemoryCache {
  private store = new Map<string, CacheRecord<unknown>>();

  set<T>(key: string, value: T, ttlMs?: number): void {
    const record: CacheRecord<T> = { value };
    if (ttlMs && ttlMs > 0) {
      record.expiresAt = Date.now() + ttlMs;
    }
    this.store.set(key, record);
  }

  get<T>(key: string): T | undefined {
    const record = this.store.get(key);
    if (!record) {
      return undefined;
    }

    if (record.expiresAt && Date.now() > record.expiresAt) {
      this.store.delete(key);
      return undefined;
    }

    return record.value as T;
  }

  delete(key: string): void {
    this.store.delete(key);
  }

  clear(): void {
    this.store.clear();
  }
}

const cache = new InMemoryCache();

export default cache;


