import { SchemaDTO } from './dto/schema.dto';
import { Body, Controller, Logger, Post, UseGuards } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { NATSService } from 'src/common/constants';
import { OrganizationDTO } from './dto/organization.dto';
import { OrganizationService } from './organization.service';
import { CredDefDTO } from './dto/creddef.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

@Controller('Organization')
@ApiTags('Organization')
export class OrganizationController {
  constructor(private readonly orgService: OrganizationService) {}
  private readonly logger = new Logger('Organization Controller');

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Post()
  @ApiOperation({
    summary: 'Registers organization.',
    description: `Registers organization in the Trust Registry so that the organization can be recognized as trusted or not before verifying or issuing the credentials.`
  })
  @ApiResponse({
    status: 201,
    description: 'Returns organization details.'
  })
 
  async createOrganization(@Body() orgnaization: OrganizationDTO): Promise<ResponseType> {
    return this.orgService.createOrganization(orgnaization);
  }

  @EventPattern({
    endpoint: `${NATSService.NATS_ENDPOINT}/${NATSService.PROOF_SCHEMA_TEMPLATE}`
  })
  async proofSchemaTemplate(body: { schemaTemplate: Record<string, unknown> }): Promise<void> {
    this.logger.log(`Received message on Organization Service`);
    this.logger.log(`Data: ${JSON.stringify(body.schemaTemplate)}`);
    return this.orgService.proofSchemaTemplate(body.schemaTemplate);
  }

  @EventPattern({
    endpoint: `${NATSService.NATS_ENDPOINT}/${NATSService.WRITE_SHEMA}`
  })
  async writeSchemaToTrustRegistry(@Body() body: SchemaDTO): Promise<ResponseType> {
    this.logger.log(`Received message on Organization Service`);
    this.logger.log(`Data: ${JSON.stringify(body)}`);
    return this.orgService.writeSchemaToTrustRegistry(body);
  }

  @EventPattern({
    endpoint: `${NATSService.NATS_ENDPOINT}/${NATSService.WRITE_CRED_DEF}`
  })
  async writeCredDefToTrustRegistry(body: { credDef: CredDefDTO }): Promise<ResponseType> {
    this.logger.log(`Received message on Organization Service`);
    this.logger.log(`Data: ${JSON.stringify(body.credDef)}`);
    return this.orgService.writeCredDefToTrustRegistry(body.credDef);
  }
}
