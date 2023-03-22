import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { MongooseModule } from '@nestjs/mongoose';
import { HttpModule } from '@nestjs/axios';
import { EventController } from './event.controller';
import { EventService } from './event.service';
import { Event, EventSchema } from '../event.schema';
import { Webhook, WebhookSchema } from '../webhook.schema';
import { bullConfig } from '../bull-config';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'event',
      ...bullConfig,
    }),
    MongooseModule.forFeature([
      { name: Event.name, schema: EventSchema },
      { name: Webhook.name, schema: WebhookSchema },
    ]),
    HttpModule,
  ],
  controllers: [EventController],
  providers: [EventService],
})
export class EventModule {}
