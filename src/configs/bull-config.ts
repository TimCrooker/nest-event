import { ConfigService } from '@nestjs/config';
import { QueueOptions } from 'bull';

export const getBullConfig = async (
  configService: ConfigService,
): Promise<QueueOptions> => ({
  redis: {
    host: configService.get('REDIS_HOST'),
    port: configService.get('REDIS_PORT'),
  },
  limiter: {
    max: 2,
    duration: 1000,
  },
  defaultJobOptions: {
    removeOnComplete: true,
    attempts: 10,
  },
  settings: {
    stalledInterval: 5000,
    maxStalledCount: 5,
  },
});
