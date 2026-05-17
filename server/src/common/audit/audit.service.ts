import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AuditService {
  constructor(private prisma: PrismaService) {}

  async log(
    actorId: string,
    entity: string,
    entityId: string,
    action: string,
    details?: any,
  ) {
    return this.prisma.auditLog.create({
      data: {
        actor_id: actorId,
        entity,
        entity_id: entityId,
        action,
        details: details ? JSON.stringify(details) : undefined,
      },
    });
  }
}
