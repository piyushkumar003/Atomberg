import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      throw new Error('DATABASE_URL environment variable is not set');
    }
    const pool = new Pool({
      connectionString,
      ssl: {
        rejectUnauthorized: false,
      },
    });
    pool.on('error', (err) => {
      console.error('Unexpected error on idle pg pool client', err);
    });
    const adapter = new PrismaPg(pool);
    super({ adapter } as any);
  }

  async onModuleInit() {
    try {
      await this.$connect();
      console.log('Successfully connected to the database.');
    } catch (error) {
      console.error('Database connection failed on startup:', error);
      throw error;
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
