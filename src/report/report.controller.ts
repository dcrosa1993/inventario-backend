// src/report/report.controller.ts
import { Controller, Get, Query, Request, UseGuards } from '@nestjs/common';
import { ReportService } from './report.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';
import { ClosingReportResponseDto } from './dto/closing-report-response.dto';

@ApiTags('reports')
@ApiBearerAuth('jwt')
@UseGuards(JwtAuthGuard)
@Controller('reports')
export class ReportController {
  constructor(private reportService: ReportService) {}

  @ApiOperation({ summary: 'Reporte de cierre por entidad y rango (GET)' })
  @ApiQuery({
    name: 'entidadId',
    required: false,
    description:
      'UUID de la entidad. Si no se pasa, usa “Almacén” por defecto.',
  })
  @ApiQuery({
    name: 'start',
    required: false,
    description: 'Fecha/hora inicio ISO. Por defecto: ahora - 24 h.',
  })
  @ApiQuery({
    name: 'end',
    required: false,
    description: 'Fecha/hora fin ISO. Por defecto: ahora.',
  })
  @ApiResponse({ status: 200, type: ClosingReportResponseDto })
  @Get('closing')
  async closing(
    @Request() req,
    @Query('entidadId') entidadId?: string,
    @Query('start') start?: string,
    @Query('end') end?: string,
  ): Promise<ClosingReportResponseDto> {
    const now = new Date();
    const dto = {
      entidadId: entidadId ?? undefined,
      start:
        start ?? new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString(),
      end: end ?? now.toISOString(),
    };

    return this.reportService.closingReport(req.user.id, dto);
  }
}
