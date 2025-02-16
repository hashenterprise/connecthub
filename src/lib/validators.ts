import { z } from 'zod';

export const signUpSchema = z.object({
  name: z.string().min(2).max(50),
  email: z.string().email(),
  password: z.string().min(8).max(100)
});

export const signInSchema = z.object({
  email: z.string().email(),
  password: z.string()
});

export const updateProfileSchema = z.object({
  name: z.string().min(2).max(50).optional(),
  bio: z.string().max(160).optional(),
  avatar: z.string().url().optional()
});

export const createPostSchema = z.object({
  content: z.string().min(1).max(500),
  media: z.array(z.string().url()).optional()
});

export const createCommentSchema = z.object({
  content: z.string().min(1).max(280),
  postId: z.string()
});
