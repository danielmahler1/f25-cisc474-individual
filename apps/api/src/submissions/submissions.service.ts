import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class SubmissionsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.submission.findMany({
      include: {
        assignment: true,
        user: true,
      },
    });
  }

  async findOne(id: string) {
    return this.prisma.submission.findUnique({
      where: { id },
      include: {
        assignment: true,
        user: true,
      },
    });
  }
}
