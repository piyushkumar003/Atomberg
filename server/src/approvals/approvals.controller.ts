import { Controller, Get, Post, Put, Body, Param, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApprovalsService } from './approvals.service';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '@prisma/client';
import type { Request } from 'express';

@Controller('approvals')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class ApprovalsController {
  constructor(private approvalsService: ApprovalsService) {}

  @Get('pending')
  @Roles(Role.MANAGER, Role.ADMIN)
  getPending(@Req() req: Request) {
    return this.approvalsService.getPendingApprovals((req.user as any).id);
  }

  @Post(':id/approve')
  @Roles(Role.MANAGER, Role.ADMIN)
  approve(@Param('id') id: string, @Req() req: Request) {
    return this.approvalsService.approveGoal(id, (req.user as any).id);
  }

  @Post(':id/return')
  @Roles(Role.MANAGER, Role.ADMIN)
  return(@Param('id') id: string, @Body('comment') comment: string, @Req() req: Request) {
    return this.approvalsService.returnGoal(id, (req.user as any).id, comment);
  }

  @Put(':id/review-edit')
  @Roles(Role.MANAGER, Role.ADMIN)
  reviewEdit(
    @Param('id') id: string, 
    @Body() data: { target_value?: number; weightage?: number },
    @Req() req: Request
  ) {
    return this.approvalsService.reviewEdit(id, (req.user as any).id, data);
  }
}
