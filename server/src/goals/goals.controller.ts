import { Controller, Post, Get, Body, UseGuards, Req, Query, HttpStatus, HttpCode } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GoalsService } from './goals.service';
import { CreateGoalDto } from './dto/create-goal.dto';
import type { Request } from 'express';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('goals')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class GoalsController {
  constructor(private goalsService: GoalsService) {}

  @Post()
  @Roles(Role.EMPLOYEE)
  create(@Req() req: Request, @Body() createGoalDto: CreateGoalDto) {
    return this.goalsService.create((req.user as any).id, createGoalDto);
  }

  @Get('my')
  @Roles(Role.EMPLOYEE)
  getMyGoals(@Req() req: Request, @Query('cycleId') cycleId?: string) {
    return this.goalsService.findAllMyGoals((req.user as any).id, cycleId);
  }

  @Post('submit')
  @HttpCode(HttpStatus.OK)
  @Roles(Role.EMPLOYEE)
  submit(@Req() req: Request, @Body('cycleId') cycleId: string) {
    return this.goalsService.submitGoalSheet((req.user as any).id, cycleId);
  }

  @Get('cycles/active')
  getActiveCycle() {
    return this.goalsService.getActiveCycle();
  }
}
