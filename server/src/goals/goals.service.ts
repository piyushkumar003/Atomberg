import { Injectable, BadRequestException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateGoalDto } from './dto/create-goal.dto';
import { GoalStatus, SubmissionStatus, UOMType } from '@prisma/client';

@Injectable()
export class GoalsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, createGoalDto: CreateGoalDto) {
    // Check if max goals reached (8)
    const goalCount = await this.prisma.goal.count({
      where: { employee_id: userId, cycle_id: createGoalDto.cycle_id, deleted_at: null },
    });

    if (goalCount >= 8) {
      throw new BadRequestException('Maximum of 8 goals allowed per cycle.');
    }

    // Check for duplicate title
    const duplicate = await this.prisma.goal.findFirst({
      where: { 
        employee_id: userId, 
        cycle_id: createGoalDto.cycle_id, 
        title: createGoalDto.title,
        deleted_at: null 
      },
    });

    if (duplicate) {
      throw new BadRequestException('A goal with this title already exists in the current cycle.');
    }

    return this.prisma.goal.create({
      data: {
        ...createGoalDto,
        employee_id: userId,
      },
    });
  }

  async findAllMyGoals(userId: string, cycleId?: string) {
    return this.prisma.goal.findMany({
      where: { 
        employee_id: userId, 
        ...(cycleId && { cycle_id: cycleId }),
        deleted_at: null 
      },
      include: { cycle: true },
      orderBy: { created_at: 'desc' },
    });
  }

  async submitGoalSheet(userId: string, cycleId: string) {
    const goals = await this.prisma.goal.findMany({
      where: { employee_id: userId, cycle_id: cycleId, deleted_at: null },
    });

    if (goals.length === 0) {
      throw new BadRequestException('No goals found to submit.');
    }

    const totalWeightage = goals.reduce((sum, g) => sum + g.weightage, 0);
    if (totalWeightage !== 100) {
      throw new BadRequestException(`Total weightage must be 100%. Current total: ${totalWeightage}%`);
    }

    // Update all goals to SUBMITTED
    await this.prisma.goal.updateMany({
      where: { employee_id: userId, cycle_id: cycleId, deleted_at: null },
      data: { 
        status: GoalStatus.SUBMITTED,
        submission_status: SubmissionStatus.SUBMITTED
      },
    });

    // Create Approval record
    // Find manager
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user?.manager_id) {
      throw new BadRequestException('No manager assigned. Contact HR.');
    }

    // Create one approval header for the whole sheet or per goal?
    // Requirement says "approve goal sheet", so we'll link goals to one approval flow
    // For simplicity in this enterprise model, we'll create approval entries for each goal
    for (const goal of goals) {
      await this.prisma.goalApproval.create({
        data: {
          goal_id: goal.id,
          manager_id: user.manager_id,
          status: GoalStatus.SUBMITTED,
        },
      });
    }

    return { message: 'Goal sheet submitted successfully.' };
  }

  async getActiveCycle() {
    const cycle = await this.prisma.goalCycle.findFirst({
      where: { is_active: true },
      orderBy: { start_date: 'desc' },
    });
    if (!cycle) throw new NotFoundException('No active goal cycle found.');
    return cycle;
  }
}
