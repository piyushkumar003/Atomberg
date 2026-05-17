import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { GoalStatus } from '@prisma/client';

@Injectable()
export class ApprovalsService {
  constructor(private prisma: PrismaService) {}

  async getPendingApprovals(managerId: string) {
    return this.prisma.goalApproval.findMany({
      where: { 
        manager_id: managerId, 
        status: GoalStatus.SUBMITTED 
      },
      include: { 
        goal: { 
          include: { employee: true } 
        } 
      },
    });
  }

  async approveGoal(approvalId: string, managerId: string) {
    const approval = await this.prisma.goalApproval.findUnique({
      where: { id: approvalId },
      include: { goal: true },
    });

    if (!approval || approval.manager_id !== managerId) {
      throw new NotFoundException('Approval request not found.');
    }

    if (approval.status !== GoalStatus.SUBMITTED) {
      throw new BadRequestException('Only submitted goals can be approved.');
    }

    // Update approval record
    await this.prisma.goalApproval.update({
      where: { id: approvalId },
      data: { 
        status: GoalStatus.APPROVED,
        approved_at: new Date(),
        reviewed_at: new Date(),
      },
    });

    // Update goal status
    return this.prisma.goal.update({
      where: { id: approval.goal_id },
      data: { status: GoalStatus.APPROVED },
    });
  }

  async returnGoal(approvalId: string, managerId: string, comment: string) {
    const approval = await this.prisma.goalApproval.findUnique({
      where: { id: approvalId },
      include: { goal: true },
    });

    if (!approval || approval.manager_id !== managerId) {
      throw new NotFoundException('Approval request not found.');
    }

    // Add comment
    await this.prisma.approvalComment.create({
      data: {
        approval_id: approvalId,
        author_id: managerId,
        content: comment,
      },
    });

    // Update approval
    await this.prisma.goalApproval.update({
      where: { id: approvalId },
      data: { 
        status: GoalStatus.RETURNED,
        returned_at: new Date(),
        reviewed_at: new Date(),
      },
    });

    // Update goal back to DRAFT for employee to edit
    return this.prisma.goal.update({
      where: { id: approval.goal_id },
      data: { status: GoalStatus.RETURNED },
    });
  }

  async reviewEdit(approvalId: string, managerId: string, data: { target_value?: number; weightage?: number }) {
    const approval = await this.prisma.goalApproval.findUnique({
      where: { id: approvalId },
      include: { goal: true },
    });

    if (!approval || approval.manager_id !== managerId) {
      throw new NotFoundException('Approval request not found.');
    }

    // Managers can only edit during review (SUBMITTED status)
    if (approval.status !== GoalStatus.SUBMITTED) {
      throw new BadRequestException('Cannot edit goal after review.');
    }

    return this.prisma.goal.update({
      where: { id: approval.goal_id },
      data: {
        ...(data.target_value !== undefined && { target_value: data.target_value }),
        ...(data.weightage !== undefined && { weightage: data.weightage }),
      },
    });
  }
}
