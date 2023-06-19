import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { IssuerService } from './service/issuer.service';
import { IssuerController } from './controller/issuer.controller';
import { HttpModule } from '@nestjs/axios';
import NATSClientService from 'src/common/NATSClientService';
import { CommonConstants } from 'src/common/constants';
import RestClientService from 'src/common/rest.client';
import { nkeyAuthenticator } from 'nats';

@Module({
  imports: [
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
    ]),
    HttpModule
  ],
  controllers: [IssuerController],
  providers: [IssuerService, NATSClientService, RestClientService]
})
export class IssuerModule {}
