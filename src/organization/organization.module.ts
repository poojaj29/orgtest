import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { CommonConstants } from 'src/common/constants';
import NATSClientService from 'src/common/NATSClientService';
import RestClientService from 'src/common/rest.client';
import { OrganizationController } from './organization.controller';
import { OrganizationService } from './organization.service';
import { HttpModule } from '@nestjs/axios';
import { nkeyAuthenticator } from 'nats';

@Module({
  imports: [
    HttpModule,
    ConfigModule.forRoot({
      envFilePath: `${process.cwd()}/.env`
    }),
    ClientsModule.register([
      {
        name: `${CommonConstants.NATS_CLIENT}`,
        transport: Transport.NATS,
        options: {
          servers: [`${process.env.NATS_URL}` as string],
          authenticator: nkeyAuthenticator(new TextEncoder().encode(process.env.NKEY_SEED))
        }
      }
    ])
  ],
  controllers: [OrganizationController],
  providers: [OrganizationService, NATSClientService, RestClientService]
})
export class OrganizationModule {}
