import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { MongooseModule } from '@nestjs/mongoose';
import { EventModule } from './event/event.module';

@Module({
  imports: [
    BullModule.forRoot({
      redis: {
        host: 'localhost',
        port: 6379,
      },
    }),
    MongooseModule.forRoot('mongodb://localhost/event-manager'),
    EventModule,
  ],
})
export class AppModule {}
