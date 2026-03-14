import { NextRequest } from 'next/server';
import dbConnect from '@/lib/db';
import Task from '@/lib/models/Task';
import { withAuth } from '@/lib/middleware/auth';
import { taskUpdateSchema } from '@/lib/validation';
import { successResponse, errorResponse } from '@/lib/response';
import mongoose from 'mongoose';

// GET /api/tasks/[id]
export const GET = withAuth(async (request: NextRequest, context: { params?: Record<string, string> }, user) => {
  try {
    await dbConnect();
    const id = context.params?.id;

    if (!mongoose.Types.ObjectId.isValid(id || '')) {
      return errorResponse('Invalid task ID', 400);
    }

    const task = await Task.findOne({ _id: id, userId: user.userId });
    if (!task) return errorResponse('Task not found', 404);

    return successResponse({ task });
  } catch (error) {
    console.error('Get task error:', error);
    return errorResponse('Internal server error', 500);
  }
});

// PATCH /api/tasks/[id]
export const PATCH = withAuth(async (request: NextRequest, context: { params?: Record<string, string> }, user) => {
  try {
    await dbConnect();
    const id = context.params?.id;

    if (!mongoose.Types.ObjectId.isValid(id || '')) {
      return errorResponse('Invalid task ID', 400);
    }

    const body = await request.json();
    const parsed = taskUpdateSchema.safeParse(body);

    if (!parsed.success) {
      return errorResponse('Validation failed', 400, parsed.error.flatten().fieldErrors);
    }

    const task = await Task.findOneAndUpdate(
      { _id: id, userId: user.userId },
      { $set: parsed.data },
      { new: true, runValidators: true }
    );

    if (!task) return errorResponse('Task not found', 404);

    return successResponse({ task });
  } catch (error) {
    console.error('Update task error:', error);
    return errorResponse('Internal server error', 500);
  }
});

// DELETE /api/tasks/[id]
export const DELETE = withAuth(async (request: NextRequest, context: { params?: Record<string, string> }, user) => {
  try {
    await dbConnect();
    const id = context.params?.id;

    if (!mongoose.Types.ObjectId.isValid(id || '')) {
      return errorResponse('Invalid task ID', 400);
    }

    const task = await Task.findOneAndDelete({ _id: id, userId: user.userId });
    if (!task) return errorResponse('Task not found', 404);

    return successResponse({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Delete task error:', error);
    return errorResponse('Internal server error', 500);
  }
});
