import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BullModule } from '@nestjs/bull';
import { Event, EventSchema } from '../schemas/event.schema';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EventController } from './event.controller';
import { EventService } from './event.service';
import { EventProcessor } from './event.processor';
import { getBullConfig } from '../configs/bull-config';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Event.name, schema: EventSchema }]),
    BullModule.registerQueueAsync({
      name: 'event',
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: getBullConfig,
    }),
  ],
  controllers: [EventController],
  providers: [EventService, EventProcessor],
})
export class EventModule {}
