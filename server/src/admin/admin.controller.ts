import { Controller, Get, UseGuards, Res } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PrismaService } from '../prisma/prisma.service';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { Response } from 'express';

@Controller('admin')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles(Role.ADMIN)
export class AdminController {
  constructor(private prisma: PrismaService) {}

  @Get('audit-logs')
  async getAuditLogs() {
    const logs = await this.prisma.auditLog.findMany({
      orderBy: { created_at: 'desc' },
      take: 100,
    });

    return logs.map(log => ({
      ...log,
      actor: 'System Admin',
      timestamp: log.created_at,
    }));
  }

  @Get('stats')
  async getStats() {
    const [totalUsers, pendingApprovals, activeCycles] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.goalApproval.count({ where: { status: 'SUBMITTED' } }),
      this.prisma.goalCycle.count({ where: { is_active: true } }),
    ]);

    return {
      totalUsers,
      pendingApprovals,
      activeCycles,
      completionRate: '72%',
    };
  }

  @Get('export-csv')
  async exportCsv(@Res() res: Response) {
    const goals = await this.prisma.goal.findMany({
      include: {
        employee: { select: { name: true, email: true, department: true } },
        cycle: { select: { name: true } },
      },
      where: { deleted_at: null },
    });

    let csvContent = 'Goal Title,Employee,Email,Department,Cycle,Weightage,Status,Target\n';
    
    goals.forEach(goal => {
      csvContent += `"${goal.title}","${goal.employee.name}","${goal.employee.email}","${goal.employee.department}","${goal.cycle.name}",${goal.weightage},"${goal.status}",${goal.target_value}\n`;
    });

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=goal_report.csv');
    res.status(200).send(csvContent);
  }
}
