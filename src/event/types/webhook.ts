import { Event } from 'src/schemas/event.schema';

export type RegisterWebhookRequest = {
  ownerId: string;
  webhookUrl: string;
  eventType: string;
};

export type CreateEventRequest = Event;
