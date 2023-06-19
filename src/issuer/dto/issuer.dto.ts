import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class IssuerDtos {
  // id: string;
  @ApiProperty({ example: 'DHI' })
  @IsNotEmpty()
  @IsString()
  issuerName: string;

  @ApiProperty({ example: 'http://119.2.117.161/logo/dhi.jpg' })
  @IsNotEmpty()
  @IsString()
  logoUrl: string;

  issuerId: string;

  verkey: string;

  // inviteUrl: string;
}
