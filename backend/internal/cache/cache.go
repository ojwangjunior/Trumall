package cache

import (
	"sync"
	"time"
)

type CacheItem struct {
	Value      interface{}
	Expiration time.Time
}

type InMemoryCache struct {
	items map[string]CacheItem
	mu    sync.RWMutex
}

func NewInMemoryCache() *InMemoryCache {
	cache := &InMemoryCache{
		items: make(map[string]CacheItem),
	}
	// Start cleanup goroutine
	go cache.cleanup()
	return cache
}

func (c *InMemoryCache) Set(key string, value interface{}, duration time.Duration) {
	c.mu.Lock()
	defer c.mu.Unlock()

	c.items[key] = CacheItem{
		Value:      value,
		Expiration: time.Now().Add(duration),
	}
}

func (c *InMemoryCache) Get(key string) (interface{}, bool) {
	c.mu.RLock()
	defer c.mu.RUnlock()

	item, exists := c.items[key]
	if !exists {
		return nil, false
	}

	// Check if expired
	if time.Now().After(item.Expiration) {
		return nil, false
	}

	return item.Value, true
}

func (c *InMemoryCache) Delete(key string) {
	c.mu.Lock()
	defer c.mu.Unlock()

	delete(c.items, key)
}

func (c *InMemoryCache) Clear() {
	c.mu.Lock()
	defer c.mu.Unlock()

	c.items = make(map[string]CacheItem)
}

// cleanup runs periodically to remove expired items
func (c *InMemoryCache) cleanup() {
	ticker := time.NewTicker(5 * time.Minute)
	defer ticker.Stop()

	for range ticker.C {
		c.mu.Lock()
		now := time.Now()
		for key, item := range c.items {
			if now.After(item.Expiration) {
				delete(c.items, key)
			}
		}
		c.mu.Unlock()
	}
}

// Global cache instance
var ShippingCache = NewInMemoryCache()
