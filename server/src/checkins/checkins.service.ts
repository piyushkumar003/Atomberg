import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CheckInStatus, UOMType } from '@prisma/client';

@Injectable()
export class CheckinsService {
  constructor(private prisma: PrismaService) {}

  async createUpdate(userId: string, data: { goal_id: string, quarter: number, actual_achievement: number }) {
    const goal = await this.prisma.goal.findUnique({
      where: { id: data.goal_id },
    });

    if (!goal || goal.employee_id !== userId) {
      throw new BadRequestException('Goal not found.');
    }

    // Calculate score
    const progressScore = this.calculateScore(goal.uom_type, goal.target_value, data.actual_achievement);

    return this.prisma.quarterlyUpdate.create({
      data: {
        goal_id: data.goal_id,
        quarter: data.quarter,
        planned_target: goal.target_value,
        actual_achievement: data.actual_achievement,
        progress_score: progressScore,
        status: progressScore >= 100 ? CheckInStatus.COMPLETED : CheckInStatus.ON_TRACK,
      },
    });
  }

  private calculateScore(uom: UOMType, target: number, actual: number): number {
    if (target === 0) return actual === 0 ? 100 : 0;
    
    // For MIN types (like cost) - target/actual. For MAX types (like revenue) - actual/target.
    // For now, let's assume standard MAX type logic for everything unless specified
    let score = (actual / target) * 100;
    
    return Math.min(Math.max(score, 0), 100); // Clamp between 0-100
  }

  async getMyCheckins(userId: string) {
    return this.prisma.quarterlyUpdate.findMany({
      where: { 
        goal: { employee_id: userId } 
      },
      include: { goal: true },
    });
  }
}
