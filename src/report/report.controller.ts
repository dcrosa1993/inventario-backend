// src/report/report.controller.ts
import { Controller, Post, Body, Request, UseGuards } from '@nestjs/common';
import { ReportService } from './report.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiBody, ApiResponse } from '@nestjs/swagger';
import { ClosingReportDto } from './dto/closing-report.dto';
import { ClosingReportResponseDto } from './dto/closing-report-response.dto';

@ApiTags('reports')
@ApiBearerAuth('jwt')
@UseGuards(JwtAuthGuard)
@Controller('reports')
export class ReportController {
  constructor(private reportService: ReportService) {}

  @ApiOperation({ summary: 'Reporte de cierre por entidad y rango' })
  @ApiBody({ type: ClosingReportResponseDto })
  @ApiResponse({ status: 200, type: ClosingReportResponseDto })
  @Post('closing')
  closing(@Request() req, @Body() dto: ClosingReportDto): Promise<ClosingReportResponseDto> {
    // Rango por defecto últimas 24h
    if (!dto.start || !dto.end) {
      const now = new Date();
      dto.end = now.toISOString();
      dto.start = new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString();
    }
    return this.reportService.closingReport(req.user.id, dto);
  }
}

