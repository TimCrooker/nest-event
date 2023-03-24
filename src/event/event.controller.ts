import { Controller, Post, Body, Get, Delete, Query, BadRequestException } from '@nestjs/common';
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
    // validate that the request is valid an has ownerId, webhookUrl, and eventType. Event type should not be empty string or null. WebhookUrl should be a valid url. if not send an error for bad request.
    const ownerId = registerWebhookRequest.ownerId;
    const webhookUrl = registerWebhookRequest.webhookUrl;
    const eventType = registerWebhookRequest.eventType;
    if (!ownerId || !webhookUrl || !eventType) {
      throw new BadRequestException(
        'ownerId, webhookUrl, and eventType are required',
      );
    }
    if (eventType === '') {
      throw new BadRequestException('eventType cannot be an empty string');
    }
    try {
      new URL(webhookUrl);
    } catch (e) {
      throw new BadRequestException('webhookUrl is not a valid URL');
    }

    console.log('Registering webhook', registerWebhookRequest);
    return this.eventService.registerWebhook(registerWebhookRequest);
  }

  @Get('webhook')
  getWebhooks(@Query('ownerId') ownerId: string): Promise<Webhook[]> {
    console.log('Getting webhooks for ownerId: ' + ownerId);
    return this.eventService.getWebhooks(ownerId);
  }

  @Delete('webhook/subscribe')
  removeWebhook(
    @Query('ownerId') ownerId: string,
    @Query('eventType') eventType: string,
  ): Promise<void> {
    console.log(
      'Removing webhook for ownerId: ' +
        ownerId +
        ' and eventType: ' +
        eventType,
    );
    return this.eventService.removeWebhook(ownerId, eventType);
  }
}
