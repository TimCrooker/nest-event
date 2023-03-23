import { queueNames } from './constants/queue.constants';
import { CacheModule, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BullModule } from '@nestjs/bull';
import { Event, EventSchema } from '../schemas/event.schema';
import { EventController } from './event.controller';
import { EventService } from './event.service';
import { EventProcessor } from './event.processor';
import { getCacheConfig } from 'src/configs/cache.config';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule,
    MongooseModule.forFeature([{ name: Event.name, schema: EventSchema }]),
    BullModule.registerQueue({
      name: queueNames.EVENT_QUEUE,
    }),
    CacheModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: getCacheConfig,
    }),
  ],
  controllers: [EventController],
  providers: [EventService, EventProcessor],
})
export class EventModule {}
