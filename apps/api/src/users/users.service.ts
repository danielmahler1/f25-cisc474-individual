import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.user.findMany({
      include: {
        courses: true,
        submissions: true,
        enrollments: true,
        calendarEvents: true,
      },
    });
  }

  async findOne(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      include: {
        courses: true,
        submissions: true,
        enrollments: true,
        calendarEvents: true,
      },
    });
  }
}
