import { Redis } from 'ioredis'


declare module 'egg' {
  interface Application {
    redis: Redis
  }
}
