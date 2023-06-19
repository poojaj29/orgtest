import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class CredDefDTO {
  @ApiProperty({ example: 'ThreadId' })
  @IsNotEmpty({ message: 'Please provide valid ThreadId' })
  @IsString({ message: 'ThreadId should be a string' })
  name: string;

  @ApiProperty({ example: 'tag' })
  @IsNotEmpty({ message: 'Please provide valid tag' })
  @IsString({ message: 'Tag should be a string' })
  tag: string;

  @ApiProperty({ example: 'schemaId' })
  schemaId: string;

  @ApiProperty({ example: 'credDefId' })
  @IsNotEmpty({ message: 'Please provide valid credDefId' })
  @IsString({ message: 'credDefId should be a string' })
  credDefId: string;

  @ApiProperty({ example: 'domainDID' })
  @IsNotEmpty({ message: 'Please provide valid domainDID' })
  @IsString({ message: 'DomainDID should be a string' })
  domainDID: string;

  @IsOptional()
  @Type(() => String)
  @ApiProperty({ example: ['name'] })
  @IsArray({ message: 'credentialAttributes should be an array' })
  credentialAttributes?: string[];
}
