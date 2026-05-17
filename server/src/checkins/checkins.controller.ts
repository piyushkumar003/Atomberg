import { Controller, Post, Get, Body, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CheckinsService } from './checkins.service';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '@prisma/client';
import type { Request } from 'express';

@Controller('checkins')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class CheckinsController {
  constructor(private checkinsService: CheckinsService) {}

  @Post()
  @Roles(Role.EMPLOYEE)
  createUpdate(@Req() req: Request, @Body() data: { goal_id: string, quarter: number, actual_achievement: number }) {
    return this.checkinsService.createUpdate((req.user as any).id, data);
  }

  @Get('my')
  @Roles(Role.EMPLOYEE)
  getMyCheckins(@Req() req: Request) {
    return this.checkinsService.getMyCheckins((req.user as any).id);
  }
}
