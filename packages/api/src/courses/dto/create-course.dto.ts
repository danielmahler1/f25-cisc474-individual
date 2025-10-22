import { z } from 'zod';

// Schema for creating a new course
export const CreateCourseSchema = z.object({
  code: z.string().min(1, 'Course code is required'),
  title: z.string().min(1, 'Course title is required'),
  term: z.string().min(1, 'Term is required'),
  userId: z.uuid('User ID must be a valid UUID'),
});

// TypeScript type inferred from the schema
export type CreateCourse = z.infer<typeof CreateCourseSchema>;
