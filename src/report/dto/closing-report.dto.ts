// src/report/dto/closing-report.dto.ts
import { ApiProperty } from '@nestjs/swagger';

export class ClosingReportDto {
  @ApiProperty({
    type: String,
    description: 'ID de la entidad. Si no se pasa, se usa "Almacén" por defecto.',
    required: false,
  })
  entidadId?: string;      // <-- marca como opcional

  @ApiProperty({
    type: String,
    description: 'Fecha y hora de inicio (ISO)',
    example: '2025-07-27T06:00:00.000Z',
  })
  start: string;

  @ApiProperty({
    type: String,
    description: 'Fecha y hora de fin (ISO)',
    example: '2025-07-28T06:00:00.000Z',
  })
  end: string;
}
