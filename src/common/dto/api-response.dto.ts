import { ApiProperty } from '@nestjs/swagger';

export class ApiResponseDto<T> {
  @ApiProperty({ description: 'Status da operação' })
  success: boolean;

  @ApiProperty({ description: 'Dados retornados' })
  data?: T;

  @ApiProperty({ description: 'Mensagem de erro' })
  message?: string;

  @ApiProperty({ description: 'Código do status HTTP' })
  statusCode: number;

  constructor(data?: T, message?: string, statusCode = 200) {
    this.success = statusCode >= 200 && statusCode < 300;
    this.data = data;
    this.message = message;
    this.statusCode = statusCode;
  }
}
