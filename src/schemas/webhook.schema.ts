import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type WebhookDocument = Webhook & Document;

@Schema()
export class Webhook {
  @Prop()
  ownerId: string;

  @Prop()
  webhookUrl: string;

  @Prop()
  eventType: string;
}

export const WebhookSchema = SchemaFactory.createForClass(Webhook);
