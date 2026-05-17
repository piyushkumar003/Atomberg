import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { NotificationsService } from './notifications.service';
import { EscalationService } from './escalation.service';

@Module({
  imports: [ScheduleModule.forRoot()],
  providers: [NotificationsService, EscalationService],
  exports: [NotificationsService],
})
export class NotificationsModule {}
