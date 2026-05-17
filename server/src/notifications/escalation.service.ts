import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationsService } from './notifications.service';
import { GoalStatus } from '@prisma/client';

@Injectable()
export class EscalationService {
  private readonly logger = new Logger(EscalationService.name);

  constructor(
    private prisma: PrismaService,
    private notifications: NotificationsService
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleEscalations() {
    this.logger.log('🚀 Running Escalation Engine...');

    // 1. Find pending approvals older than 3 days
    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

    const delayedApprovals = await this.prisma.goalApproval.findMany({
      where: {
        status: GoalStatus.SUBMITTED,
        submitted_at: { lt: threeDaysAgo },
      },
      include: { 
        manager: true, 
        goal: { 
          include: { 
            employee: true 
          } 
        } 
      },
    });

    for (const approval of delayedApprovals) {
      this.logger.warn(`Escalating delayed approval for ${approval.goal.employee.name} to manager ${approval.manager.name}`);
      await this.notifications.sendEmail(
        approval.manager.email,
        'URGENT: Delayed Goal Approval',
        `Hi ${approval.manager.name}, the goal sheet for ${approval.goal.employee.name} has been pending for over 3 days. Please review it immediately.`
      );
    }
  }
}
