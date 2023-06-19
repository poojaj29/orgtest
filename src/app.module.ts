import { APP_FILTER } from '@nestjs/core';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TerminusModule } from '@nestjs/terminus';
import { config } from 'config/config';
import { validationSchema } from 'config/validation';
import { ExceptionHandler } from './common/exception.handler';
import { ResponseModule, ResponseService } from './response/src';
import { OrganizationModule } from './organization/organization.module';
import { IssuerModule } from './issuer/issuer.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    TerminusModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
      envFilePath: `${process.cwd()}/.env`,
      validationSchema
    }),
    IssuerModule,
    ResponseModule,
    OrganizationModule,
    AuthModule
  ],
  controllers: [],
  providers: [
    {
      provide: APP_FILTER,
      useClass: ExceptionHandler
    },
    ResponseService
  ]
})
export class AppModule {}
