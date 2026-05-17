import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  async sendEmail(to: string, subject: string, body: string) {
    this.logger.log(`📧 Sending Email to: ${to}`);
    this.logger.log(`Subject: ${subject}`);
    this.logger.log(`Body: ${body}`);
    // In production, integrate with NodeMailer, SendGrid, or AWS SES
    return true;
  }

  async notifySubmission(employeeName: string, managerEmail: string) {
    const subject = `Goal Sheet Submitted: ${employeeName}`;
    const body = `Hi, ${employeeName} has submitted their goal sheet for review. Please log in to the portal to take action.`;
    return this.sendEmail(managerEmail, subject, body);
  }

  async notifyApproval(employeeEmail: string, status: string) {
    const subject = `Goal Status Update: ${status}`;
    const body = `Hi, your recent goal submission has been ${status}. Please log in to view details.`;
    return this.sendEmail(employeeEmail, subject, body);
  }
}
