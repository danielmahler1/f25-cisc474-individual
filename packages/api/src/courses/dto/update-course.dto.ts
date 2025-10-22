import { z } from 'zod';

// Schema for updating an existing course
// All fields are optional - only update what's provided
export const UpdateCourseSchema = z.object({
  code: z.string().min(1).optional(),
  title: z.string().min(1).optional(),
  term: z.string().min(1).optional(),
  userId: z.uuid().optional(),
}).strict(); // strict() ensures no extra fields are allowed

// TypeScript type inferred from the schema
export type UpdateCourse = z.infer<typeof UpdateCourseSchema>;
