import { Controller, Post, Body, Get } from '@nestjs/common';
import { Webhook } from 'src/schemas/webhook.schema';
import { EventService } from './event.service';
import { CreateEventRequest, RegisterWebhookRequest } from './types/webhook';

@Controller('event')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Post()
  create(
    @Body() createEventDto: CreateEventRequest,
  ): Promise<CreateEventRequest> {
    console.log('create event', createEventDto);
    return this.eventService.create(createEventDto);
  }

  // create new webhook event get endpoint
  @Post('webhook/subscribe')
  registerWebhook(
    @Body() registerWebhookRequest: RegisterWebhookRequest,
  ): Promise<Array<Webhook>> {
    console.log('Registering webhook', registerWebhookRequest);
    return this.eventService.registerWebhook(registerWebhookRequest);
  }
}
