import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type EventDocument = Event & Document;

@Schema()
export class Event {
  @Prop()
  name: string;

  @Prop()
  payload: Record<string, unknown>;
}

export const EventSchema = SchemaFactory.createForClass(Event);
