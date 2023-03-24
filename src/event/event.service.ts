import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Event, EventDocument } from '../schemas/event.schema';
import { Webhook, WebhookDocument } from '../schemas/webhook.schema';
import { HttpService } from '@nestjs/axios';
import { InjectQueue } from '@nestjs/bull';
import { jobNames, queueNames } from './constants/queue.constants';
import { RegisterWebhookRequest } from './types/webhook';
import { firstValueFrom } from 'rxjs';

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

  /**
   * get all of the webhooks registered in the database for the provided ownerId
   */
  async getWebhooks(ownerId: string): Promise<WebhookDocument[]> {
    const ownerWebhooks = await this.webhookModel.find({ ownerId }).exec();

    console.log('Found webhooks for ownerId: ' + ownerId, ownerWebhooks);

    return ownerWebhooks;
  }

  async registerWebhook(
    webhookDto: RegisterWebhookRequest,
  ): Promise<Webhook[]> {
		

    // get all of the webhooks for the provided ownerId
    const webhooks = await this.getWebhooks(webhookDto.ownerId);

    const newWebhooks: Array<Webhook> = [];

    // for each eventType in the eventTypes array, check if the webhook is already registered. if it is then just update the webhookUrl. if not then create a new webhook in the database and return all of the updated and created webhooks.

    const webhook = webhooks.find(
      (webhook) => webhook.eventType === webhookDto.eventType,
    );
    if (webhook) {
      webhook.webhookUrl = webhookDto.webhookUrl;
      const updatedWebhook = await webhook.save();
      newWebhooks.push(updatedWebhook);
    } else {
      const createdWebhook = new this.webhookModel(webhookDto);
      const newWebhook = await createdWebhook.save();
      newWebhooks.push(newWebhook);
    }

    return newWebhooks;
  }

  async processEvent(eventData: any): Promise<Event> {
    const createdEvent = new this.eventModel({
      ...eventData,
      timestamp: new Date().toISOString(),
    });
    createdEvent.save();

    console.log('Saved event: ' + JSON.stringify(createdEvent));

    const webhooks = await this.webhookModel
      .find({ eventType: eventData.eventType })
      .exec();
    webhooks.forEach(async (webhook) => {
      console.log('Sending event to webhook: ' + webhook.webhookUrl);
      const webhookUrl = webhook.webhookUrl.replace(
        /(127\.0\.0\.1|localhost)/,
        'host.docker.internal',
      );

      const config = {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      };

      const response = await firstValueFrom(
        this.httpService.post(webhookUrl, eventData, config),
      );

      console.log('Webhook response: ' + JSON.stringify(response.data));
    });

    return createdEvent;
  }

  async removeWebhook(ownerId: string, eventType: string): Promise<void> {
    await this.webhookModel.deleteMany({ ownerId, eventType }).exec();
    console.log(
      'Removed webhooks for ownerId: ' +
        ownerId +
        ' and eventType: ' +
        eventType,
    );
  }
}
