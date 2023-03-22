import { BullModuleOptions } from '@nestjs/bull';

export const bullConfig: BullModuleOptions = {
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT, 10) || 6379,
  },
};
