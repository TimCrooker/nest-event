import { Controller, Post, Body } from '@nestjs/common';
import { EventService } from './event.service';

@Controller('event')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Post()
  create(@Body() createEventDto: any): Promise<any> {
    return this.eventService.create(createEventDto);
  }

  // create new webhook event get endpoint
  @Post('register-webhook')
  registerWebhook(@Body() registerWebhookDto: any): Promise<any> {
    return this.eventService.registerWebhook(registerWebhookDto);
  }
}
