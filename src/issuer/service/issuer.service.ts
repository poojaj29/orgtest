import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v4 as uuid } from 'uuid';
import { IssuerDtos } from '../dto/issuer.dto';
import NATSClientService from 'src/common/NATSClientService';
import RestClientService from 'src/common/rest.client';
import { TrustRegistryService } from 'src/common/constants';
import { UpdateConfigDTO } from 'src/issuer/dto/update-config.dto';
import { CreateIssuer, FindIssuer, UpdateConfig } from 'src/common/response.interface';

@Injectable()
export class IssuerService {
  private readonly logger = new Logger('IssuerService');
  constructor(
    private configService: ConfigService,
    private readonly restClient: RestClientService,
    private natsCientService: NATSClientService
  ) {}

  public async updateConfiguration(issuerDtos: IssuerDtos): Promise<UpdateConfig> {
    const updateConfigMessage = {
      configs: [
        {
          name: 'logoUrl',
          value: issuerDtos.logoUrl
        },
        {
          name: 'name',
          value: issuerDtos.issuerName
        }
      ]
    };

    const updateConfigThreadId = uuid();

    await this.natsCientService.updateOrganizationConfig(updateConfigThreadId, updateConfigMessage);

    const updateConfig = await this.natsCientService.natsListener(updateConfigThreadId);

    const updateConfigDto = {
      domainDID: updateConfig.domainDID,
      orgName: issuerDtos.issuerName,
      logoUrl: issuerDtos.logoUrl
    };

    await this.updateOrgConfigTrustRegistry(updateConfigDto);

    const response: UpdateConfig = updateConfig.configs;

    return response;
  }

  public async findIssuer(): Promise<FindIssuer> {
    const getIssuerKeysMsg = {};
    const getIssuerKeysThreadId = uuid();

    await this.natsCientService.findIssuer(getIssuerKeysThreadId, getIssuerKeysMsg);

    return this.natsCientService.natsListener(getIssuerKeysThreadId);
  }

  public async issuerSetup(): Promise<CreateIssuer> {
    const getIssuerKeysMsg = {};
    const getIssuerKeysThreadId = uuid();

    await this.natsCientService.createIssuer(getIssuerKeysThreadId, getIssuerKeysMsg);
    const issuerSetup = await this.natsCientService.natsListener(getIssuerKeysThreadId);
    return issuerSetup;
  }

  public async updateOrgConfigTrustRegistry(updateConfigDto: UpdateConfigDTO): Promise<ResponseType> {
    const TRUST_REGISTRY_SERVICE_URL = this.configService.get('TRUST_REGISTRY_SERVICE_URL');
    const login = await this.restClient.trustRegistryLogin();
    const requestConfig = {
      headers: {
        'content-type': 'application/json',
        Authorization: `Bearer ${login.accessToken}`
      }
    };
    const body = {
      orgName: updateConfigDto.orgName,
      orgLogo: updateConfigDto.logoUrl
    };

    this.logger.log('Updating Org Config in Trust Registry');
    this.logger.log(
      `${TRUST_REGISTRY_SERVICE_URL}/${TrustRegistryService.ORGANIZATION}?publicDid=${
        updateConfigDto.domainDID
      } ${JSON.stringify(body)}`
    );
    const orgDTORes = await this.restClient.put(
      `${TRUST_REGISTRY_SERVICE_URL}/${TrustRegistryService.ORGANIZATION}?publicDid=${updateConfigDto.domainDID}`,
      body,
      requestConfig
    );

    this.logger.log(`orgDTORes ${orgDTORes}`);
    return orgDTORes;
  }
}
