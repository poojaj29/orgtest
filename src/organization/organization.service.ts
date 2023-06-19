import { SchemaDTO } from './dto/schema.dto';
import { Injectable, Logger } from '@nestjs/common';
import { TrustRegistryService } from 'src/common/constants';
import NATSClientService from 'src/common/NATSClientService';
import RestClientService from 'src/common/rest.client';
import { OrganizationDTO } from './dto/organization.dto';
import { CredDefDTO } from './dto/creddef.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class OrganizationService {
  constructor(
    private readonly proxyClient: NATSClientService,
    private readonly restClient: RestClientService,
    private configService: ConfigService
  ) {}
  private readonly logger = new Logger('OrganizationService');

  async createOrganization(organization: OrganizationDTO): Promise<ResponseType> {
    const TRUST_REGISTRY_SERVICE_URL = this.configService.get('TRUST_REGISTRY_SERVICE_URL');
    const login = await this.restClient.trustRegistryLogin();
    const requestConfig = {
      headers: {
        'content-type': 'application/json',
        Authorization: `Bearer ${login.accessToken}`
      }
    };
    const orgDTORes = await this.restClient.post(
      `${TRUST_REGISTRY_SERVICE_URL}/${TrustRegistryService.ORGANIZATION}`,
      organization,
      requestConfig
    );
    this.logger.log(`orgDTORes ${orgDTORes}`);
    return orgDTORes;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  proofSchemaTemplate(proofSchemaTemplate: Record<string, unknown>): void {
    // call the nats service to write to Trust Registry
  }

  async writeSchemaToTrustRegistry(schema: SchemaDTO): Promise<ResponseType> {
    const TRUST_REGISTRY_SERVICE_URL = this.configService.get('TRUST_REGISTRY_SERVICE_URL');
    this.logger.log(schema);

    const schemaDto: SchemaDTO = {
      threadId: schema.threadId,
      schemaId: schema.schemaId,
      domainDID: schema.domainDID,
      connectionDate: schema.connectionDate
    };

    const body = {
      CredentialMap: [
        {
          credentialType: schemaDto.schemaId,
          canIssue: true,
          canVerify: true
        }
      ]
    };

    this.logger.log(
      `${TRUST_REGISTRY_SERVICE_URL}/${TrustRegistryService.ORGANIZATION}?publicDid=${schemaDto.domainDID} ${body}`
    );
    const login = await this.restClient.trustRegistryLogin();
    const requestConfig = {
      headers: {
        'content-type': 'application/json',
        Authorization: `Bearer ${login.accessToken}`
      }
    };
    const credentialMap = await this.restClient.put(
      `${TRUST_REGISTRY_SERVICE_URL}/${TrustRegistryService.ORGANIZATION}?publicDid=${schemaDto.domainDID}`,
      body,
      requestConfig
    );
    return credentialMap;
  }

  async writeCredDefToTrustRegistry(credDef: CredDefDTO): Promise<ResponseType> {
    const TRUST_REGISTRY_SERVICE_URL = this.configService.get('TRUST_REGISTRY_SERVICE_URL');
    this.logger.log(credDef);

    const body = {
      CredentialMap: [
        {
          name: credDef.name,
          credentialType: credDef.credDefId,
          canIssue: true,
          canVerify: true
        }
      ]
    };

    const login = await this.restClient.trustRegistryLogin();
    const requestConfig = {
      headers: {
        'content-type': 'application/json',
        Authorization: `Bearer ${login.accessToken}`
      }
    };
    const credentialMap = await this.restClient.put(
      `${TRUST_REGISTRY_SERVICE_URL}/${TrustRegistryService.ORGANIZATION}?publicDid=${credDef.domainDID}`,
      body,
      requestConfig
    );
    return credentialMap;
  }
}
