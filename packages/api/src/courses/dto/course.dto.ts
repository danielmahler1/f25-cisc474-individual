import { z } from 'zod';

// Schema for the owner/user info (simplified - no sensitive data)
export const CourseOwnerSchema = z.object({
  id: z.uuid(),
  name: z.string(),
  email: z.email(),
});

// Main Course DTO Schema - what gets returned from the API
export const CourseSchema = z.object({
  id: z.uuid(),
  code: z.string(),
  title: z.string(),
  term: z.string(),
  userId: z.uuid(),
  createdAt: z.coerce.date(), // Converts ISO string to Date object
  owner: CourseOwnerSchema.optional(), // Optional because we might not always include it
});

// TypeScript type inferred from the schema
export type Course = z.infer<typeof CourseSchema>;
export type CourseOwner = z.infer<typeof CourseOwnerSchema>;
