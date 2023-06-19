import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { CommonConstants } from './constants';
import { AgentService } from 'src/common/constants';
import { TrustRegistryService } from './constants';
import { OrganizationDTO } from 'src/organization/dto/organization.dto';
import { ConfigService } from '@nestjs/config';
import { FindIssuer, ResponseType } from './response.interface';
import { UpdateConfigRequest } from './update-config.interface';
import { StringCodec, connect, nkeyAuthenticator } from 'nats';

@Injectable()
export default class NATSClientService {
  private readonly logger = new Logger('NATSClientService');
  constructor(
    @Inject(CommonConstants.NATS_CLIENT)
    private readonly natsClient: ClientProxy,
    private configService: ConfigService
  ) {}

  async findIssuer(issuerThreadId: string, issuerMessage: Record<string, unknown>): Promise<FindIssuer> {
    this.logger.debug(issuerThreadId);
    const pattern = {
      endpoint: `${AgentService.NATS_ENDPOINT}/${AgentService.FIND_ISSUER}`
    };
    const payload = {
      issuerThreadId,
      issuerMessage
    };
    this.logger.log(`payload id payload : ${JSON.stringify(payload)} `);
    return lastValueFrom(this.natsClient.send(pattern, payload));
  }

  createIssuer(issuerThreadId: string, issuerMessage: Record<string, never>): Promise<ResponseType> {
    this.logger.debug(issuerThreadId);
    const pattern = {
      endpoint: `${AgentService.NATS_ENDPOINT}/${AgentService.CREATE_ISSUER}`
    };
    const payload = {
      issuerThreadId,
      issuerMessage
    };
    this.logger.log(`payload id payload : ${JSON.stringify(payload)} `);
    return lastValueFrom(this.natsClient.send(pattern, payload));
  }

  createOrganization(orgDTO: OrganizationDTO): Promise<ResponseType> {
    const pattern = {
      endpoint: `${TrustRegistryService.NATS_CLIENT}/${TrustRegistryService.CREATE_ORG}`
    };
    this.logger.log(`payload is : ${JSON.stringify(orgDTO)} `);
    return lastValueFrom(this.natsClient.send(pattern, orgDTO));
  }

  // Tshendu : Please call this message from wherever required to call agent service
  updateOrganizationConfig(
    updateConfigThreadId: string,
    updateConfigMessage: UpdateConfigRequest
  ): Promise<ResponseType> {
    const pattern = {
      endpoint: `${AgentService.NATS_ENDPOINT}/${AgentService.UPDATE_ORG_CONFIG}`
    };
    const payload = {
      updateConfigThreadId,
      updateConfigMessage
    };
    this.logger.log(`payload: ${JSON.stringify(payload)} `);
    return lastValueFrom(this.natsClient.send(pattern, payload));
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async natsListener(threadId: string): Promise<any> {
    this.logger.log(`connecting to nats url `);
    const nc = await connect({
      servers: [`${this.configService.get('NATS_URL')}`],
      authenticator: nkeyAuthenticator(new TextEncoder().encode(this.configService.get('NKEY_SEED')))
    });
    this.logger.log('Connected to NATS server');
    const sc = StringCodec();
    const sub = nc.subscribe(threadId);
    this.logger.log(`listening on threadid ${threadId}`);
    let natsResponseResolve;
    const natsResponse = new Promise(function (resolve) {
      natsResponseResolve = resolve;
    });

    (async (): Promise<void> => {
      for await (const m of sub) {
        const { data } = JSON.parse(sc.decode(m.data));
        this.logger.log(`[${sub.getProcessed()}]: ${sc.decode(m.data)}`);
        natsResponseResolve(data);
      }
      this.logger.log('subscription closed');
    })();
    const responseData = await natsResponse;
    nc.close();
    return responseData;
  }
}
