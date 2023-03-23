import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Event, EventDocument } from '../schemas/event.schema';
import { Webhook, WebhookDocument } from '../schemas/webhook.schema';
import { HttpService } from '@nestjs/axios';
import { InjectQueue } from '@nestjs/bull';
import { jobNames, queueNames } from './constants/queue.constants';

@Injectable()
export class EventService {
  constructor(
    @InjectModel(Event.name) private eventModel: Model<EventDocument>,
    @InjectModel(Webhook.name) private webhookModel: Model<WebhookDocument>,
    @InjectQueue(queueNames.EVENT_QUEUE) private eventQueue: Queue,
    private httpService: HttpService,
  ) {}

  async create(createEventDto: any): Promise<Event> {
    await this.eventQueue.add(jobNames.CREATE, createEventDto);
    return createEventDto;
  }

  async registerWebhook(webhookDto: any): Promise<Webhook> {
    const createdWebhook = new this.webhookModel(webhookDto);
    return createdWebhook.save();
  }

  async processEvent(eventData: any): Promise<Event> {
    const createdEvent = new this.eventModel(eventData);
    createdEvent.save();

    const webhooks = await this.webhookModel
      .find({ eventType: eventData.name })
      .exec();
    webhooks.forEach(async (webhook) => {
      this.httpService.post(webhook.url, eventData);
    });

    return createdEvent;
  }
}
