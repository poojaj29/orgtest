import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayMaxSize,
  ArrayUnique,
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested
} from 'class-validator';
import { Transform, TransformFnParams, Type } from 'class-transformer';

export enum OrganizationStatus {
  TERMINATED = 'TERMINATED',
  CURRENT = 'CURRENT'
}

class CredentialMap {
  @ApiProperty({ example: 'Schema Name' })
  @IsNotEmpty({ message: 'Please provide valid schema name' })
  @IsString({ message: 'Schema name should be a string' })
  name: string;

  @ApiProperty({ example: 'Credential type' })
  @IsNotEmpty({ message: 'Please provide valid credential type' })
  @IsString({ message: 'Credential type should be a string' })
  credentialType: string;

  @ApiProperty({ example: true })
  canIssue = true;

  @ApiProperty({ example: true })
  canVerify = true;

  @IsOptional()
  @Type(() => String)
  @ApiProperty({ example: ['name'] })
  @IsArray({ message: 'credentialAttributes should be an array' })
  credentialAttributes?: string[];
}
export class OrganizationDTO {
  @ApiProperty({ example: 'Organization Name' })
  @IsNotEmpty({ message: 'Please provide valid organization name' })
  @IsString({ message: 'Organization name should be a string' })
  @Transform(({ value }: TransformFnParams) => ('string' === typeof value ? value.trim() : value))
  orgName: string;

  @ApiProperty({ example: 'Organization logo URL' })
  orgLogo: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Please provide valid publicDid' })
  @IsString({ message: 'publicDid should be a string' })
  @Transform(({ value }: TransformFnParams) => ('string' === typeof value ? value.trim() : value))
  publicDid: string;

  @IsString({ message: 'vLEI' })
  @ApiProperty({ example: 'vLEI number of an organization' })
  @IsOptional()
  vLEI?: string;

  @ApiProperty()
  validFrom: Date;

  @ApiProperty({ example: OrganizationStatus.CURRENT })
  @IsEnum(OrganizationStatus)
  status: OrganizationStatus;

  @ApiProperty({
    example: [
      {
        name: 'Credential Name',
        credentialType: 'credentialType',
        canIssue: true,
        canVerify: true,
        credentialAttributes: ['name']
      }
    ]
  })
  @ValidateNested()
  @Type(() => CredentialMap)
  @ArrayMaxSize(10)
  @IsArray({ message: 'CredentialMap should be an array' })
  @ArrayUnique((o) => o.credentialType)
  CredentialMap: CredentialMap[];
}
