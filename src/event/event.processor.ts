import { Processor, Process, OnQueueActive } from '@nestjs/bull';
import { Job } from 'bull';
import { EventService } from './event.service';

@Processor('event')
export class EventProcessor {
  constructor(private readonly eventService: EventService) {}

  @OnQueueActive()
  onActive(job: Job) {
    console.log(
      `Processing job ${job.id} of type ${job.name} with data ${JSON.stringify(job.data)}...`,
    );
  }

  @Process('create')
  async handleCreate(job: Job) {
    const { data } = job;
    try {
      const createdEvent = await this.eventService.create(data);
      console.log(`Created event: ${JSON.stringify(createdEvent)}`);
      return createdEvent;
    } catch (error) {
      console.error(`Error creating event: ${error.message}`);
      throw error;
    }
  }
}
