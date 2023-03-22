import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { EventModule } from './event/event.module';
import { mongooseConfig } from './mongoose-config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(mongooseConfig.uri, { ...mongooseConfig }),
    EventModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
