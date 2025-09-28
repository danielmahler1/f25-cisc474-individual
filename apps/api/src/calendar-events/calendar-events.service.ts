import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class CalendarEventsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.calendarEvent.findMany({
      include: {
        user: true,
        assignment: true,
      },
    });
  }

  async findOne(id: string) {
    return this.prisma.calendarEvent.findUnique({
      where: { id },
      include: {
        user: true,
        assignment: true,
      },
    });
  }
}
