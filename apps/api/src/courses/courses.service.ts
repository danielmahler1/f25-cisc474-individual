import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import {
  Course,
  CreateCourse,
  UpdateCourse,
} from '@repo/api';

@Injectable()
export class CoursesService {
  constructor(private prisma: PrismaService) {}

  /**
   * Transform a Prisma Course model to a Course DTO
   */
  private transformToDto(course: any): Course {
    return {
      id: course.id,
      code: course.code,
      title: course.title,
      term: course.term,
      userId: course.userId,
      createdAt: course.createdAt,
      owner: course.owner
        ? {
            id: course.owner.id,
            name: course.owner.name,
            email: course.owner.email,
          }
        : undefined,
    };
  }

  async findAll(): Promise<Course[]> {
    const courses = await this.prisma.course.findMany({
      include: {
        owner: true,
      },
    });

    return courses.map((course) => this.transformToDto(course));
  }

  async findOne(id: string): Promise<Course> {
    const course = await this.prisma.course.findUnique({
      where: { id },
      include: {
        owner: true,
      },
    });

    if (!course) {
      throw new NotFoundException(`Course with ID ${id} not found`);
    }

    return this.transformToDto(course);
  }

  async create(createCourseDto: CreateCourse): Promise<Course> {
    const course = await this.prisma.course.create({
      data: {
        code: createCourseDto.code,
        title: createCourseDto.title,
        term: createCourseDto.term,
        userId: createCourseDto.userId,
      },
      include: {
        owner: true,
      },
    });

    return this.transformToDto(course);
  }

  async update(id: string, updateCourseDto: UpdateCourse): Promise<Course> {
    // Check if course exists
    const existingCourse = await this.prisma.course.findUnique({
      where: { id },
    });

    if (!existingCourse) {
      throw new NotFoundException(`Course with ID ${id} not found`);
    }

    // Update the course
    const course = await this.prisma.course.update({
      where: { id },
      data: updateCourseDto,
      include: {
        owner: true,
      },
    });

    return this.transformToDto(course);
  }

  async remove(id: string): Promise<Course> {
    // Check if course exists
    const existingCourse = await this.prisma.course.findUnique({
      where: { id },
      include: {
        owner: true,
      },
    });

    if (!existingCourse) {
      throw new NotFoundException(`Course with ID ${id} not found`);
    }

    // Delete the course
    const course = await this.prisma.course.delete({
      where: { id },
      include: {
        owner: true,
      },
    });

    return this.transformToDto(course);
  }
}
