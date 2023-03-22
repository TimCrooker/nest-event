import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue, Job } from 'bull';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Event, EventDocument } from '../schemas/event.schema';
import { Webhook, WebhookDocument } from '../schemas/webhook.schema';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class EventService {
  constructor(
    @InjectModel(Event.name) private eventModel: Model<EventDocument>,
    @InjectModel(Webhook.name) private webhookModel: Model<WebhookDocument>,
    private httpService: HttpService,
  ) {
    this.eventQueue.process(async (job: Job) => {
      await this.processEvent(job.data);
    });
  }

  async create(createEventDto: any): Promise<Event> {
    const createdEvent = new this.eventModel(createEventDto);
    await this.eventQueue.add('save', createEventDto);
    return createdEvent.save();
  }

  async registerWebhook(webhookDto: any): Promise<Webhook> {
    const createdWebhook = new this.webhookModel(webhookDto);
    return createdWebhook.save();
  }

  private async processEvent(eventData: any): Promise<void> {
    const webhooks = await this.webhookModel
      .find({ eventType: eventData.name })
      .exec();
    webhooks.forEach(async (webhook) => {
      await this.httpService.post(webhook.url, eventData).toPromise();
    });
  }
}
