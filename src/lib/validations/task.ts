import { z } from "zod";
import type { Task } from "@/src/types/task";

export const taskSchema = z.object({
  id: z.string(),
  title: z.string().trim().min(1),
  completed: z.boolean(),
  priority: z.enum(["low", "medium", "high"]),
  dueDate: z.iso.datetime({ offset: true }).optional(),
  tags: z.array(z.string()),
  archived: z.boolean(),
});

export function parseTasks(data: unknown): Task[] {
  if (!Array.isArray(data)) return [];

  return data.flatMap((candidate) => {
    const result = taskSchema.safeParse(candidate);
    return result.success ? [result.data] : [];
  });
}
