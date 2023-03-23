import { ConfigService } from '@nestjs/config';
import { MongooseModuleOptions } from '@nestjs/mongoose';

export const getMongoConfig = async (
  configService: ConfigService,
): Promise<MongooseModuleOptions> => {
  return {
    uri: getMongoUri(configService),
    ...getMongoOptions,
  };
};

const getMongoUri = (configService: ConfigService) => {
  const userString = configService.get('MONGO_USERNAME')
    ? configService.get('MONGO_USERNAME') +
      ':' +
      configService.get('MONGO_PASSWORD') +
      '@'
    : '';

  const mongoUri =
    'mongodb://' +
    userString +
    configService.get('MONGO_HOST') +
    ':' +
    configService.get('MONGO_PORT') +
    '/' +
    configService.get('MONGO_NAME');

  return mongoUri;
};

const getMongoOptions = () => ({});
