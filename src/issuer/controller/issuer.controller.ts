import { Body, Controller, Get, Post, Logger, HttpStatus, UseGuards } from '@nestjs/common';
import { CreateIssuer, FindIssuer, ResponseType } from 'src/common/response.interface';
import { IssuerService } from '../service/issuer.service';
import { statusCode } from 'src/common/status.codes';
import { IssuerDtos } from '../dto/issuer.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { CommonConstants } from 'src/common/constants';
import { RpcException } from '@nestjs/microservices';

@Controller()
@ApiTags('Organization')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
export class IssuerController {
  private readonly logger = new Logger('issuerController');
  constructor(private readonly issuerService: IssuerService) {}

  @ApiOperation({
    summary: 'Get Issuer.',
    description: `Get the Issuer DID and VerKey of the registered Issuer.`
  })
  @ApiResponse({
    status: 201,
    description: 'Returns the issuerDid and issuerVerkey.'
  })
  @Get('findIssuer')
  async findIssuer(): Promise<ResponseType> {
    this.logger.log('Fetching Issuer');
    const response: FindIssuer | false = await Promise.race([
      this.issuerService.findIssuer(),
      new Promise<false>((resolve) => {
        setTimeout(resolve, CommonConstants.REQUEST_TIMEOUT, false);
      })
    ]);

    if (!response) {
      throw new RpcException({ message: 'Request timed out', code: HttpStatus.REQUEST_TIMEOUT });
    }
    //@Tshendu and @Kinzang in which scenario we are getting response.message?
    const resData = response.did ? { issuerDid: response.did, issuerVerkey: response.verKey } : response.message || {};

    const msg = response.did ? 'Issuer fetch successfully' : '';

    const res: ResponseType = {
      statusCode: statusCode.OK,
      message: msg,
      data: resData
    };

    return res;
  }

  @ApiOperation({
    summary: 'Setup Issuer.',
    description: `Creates Issuer DID and public/private key pair that are going to be used to issue credentials. This DID and public key (VerKy) needs to be endorsed before creating Schemas and Credential Definition.`
  })
  @ApiResponse({
    status: 201,
    description: 'Returns the issuerDid and issuerVerkey.'
  })
  @Post('createIssuer')
  async createIssuer(): Promise<ResponseType> {
    this.logger.log('Creating Issuer');
    const response: false | CreateIssuer = await Promise.race([
      this.issuerService.issuerSetup(),
      new Promise<false>((resolve) => {
        setTimeout(resolve, CommonConstants.REQUEST_TIMEOUT, false);
      })
    ]);

    if (!response) {
      throw new RpcException({ message: 'Request timed out', code: HttpStatus.REQUEST_TIMEOUT });
    }
    const msg = response.identifier && response.identifier.did ? 'Issuer created successfully' : response.message || '';

    const resData =
      response.identifier && response.identifier.did
        ? {
            did: response.identifier.did,
            verKey: response.identifier.verKey
          }
        : {};

    const res: ResponseType = {
      statusCode: statusCode.OK,
      message: msg,
      data: resData
    };
    return res;
  }

  @ApiOperation({
    summary: 'Updates name and logo for the organization.',
    description: `Name and logo are used when Connection protocol is used and when connection invite is showed in the digital wallet apps.`
  })
  @ApiResponse({
    status: 201,
    description: 'Returns the issuerDid and issuerVerkey.'
  })
  @Post('update_config')
  async updateConfiguration(@Body() issuerDtos: IssuerDtos): Promise<ResponseType> {
    const response = await Promise.race([
      this.issuerService.updateConfiguration(issuerDtos),
      new Promise<false>((resolve) => {
        setTimeout(resolve, CommonConstants.REQUEST_TIMEOUT, false);
      })
    ]);

    if (!response) {
      throw new RpcException({ message: 'Request timed out', code: HttpStatus.REQUEST_TIMEOUT });
    }

    const res: ResponseType = {
      statusCode: statusCode.OK,
      message: 'Config updated successfully',
      data: response
    };
    return res;
  }
}
