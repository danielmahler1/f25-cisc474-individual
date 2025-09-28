import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class EnrollmentsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.enrollment.findMany({
      include: {
        user: true,
        course: true,
      },
    });
  }

  async findOne(id: string) {
    return this.prisma.enrollment.findUnique({
      where: { id },
      include: {
        user: true,
        course: true,
      },
    });
  }
}
