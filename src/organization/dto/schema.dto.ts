import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class SchemaDTO {
  @ApiProperty({ example: 'ThreadId' })
  @IsNotEmpty({ message: 'Please provide valid ThreadId' })
  @IsString({ message: 'ThreadId should be a string' })
  threadId: string;

  @ApiProperty({ example: 'schemaId' })
  @IsNotEmpty({ message: 'Please provide valid schemaId' })
  @IsString({ message: 'SchemaId should be a string' })
  schemaId: string;

  @ApiProperty({ example: 'domainDID' })
  @IsNotEmpty({ message: 'Please provide valid domainDID' })
  @IsString({ message: 'DomainDID should be a string' })
  domainDID: string;

  @ApiProperty()
  connectionDate: Date;
}
