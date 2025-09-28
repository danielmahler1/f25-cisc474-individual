import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class AssignmentsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.assignment.findMany({
      include: {
        course: true,
        submissions: true,
        calendarEvents: true,
      },
    });
  }

  async findOne(id: string) {
    return this.prisma.assignment.findUnique({
      where: { id },
      include: {
        course: true,
        submissions: true,
        calendarEvents: true,
      },
    });
  }
}
