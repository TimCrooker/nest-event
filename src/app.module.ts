import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EventModule } from './event/event.module';
import { mongooseConfig } from './mongoose.config';

@Module({
  imports: [
    MongooseModule.forRoot(mongooseConfig.uri, mongooseConfig),
    EventModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
