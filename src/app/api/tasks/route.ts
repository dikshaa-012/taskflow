import { NextRequest } from 'next/server';
import dbConnect from '@/lib/db';
import Task from '@/lib/models/Task';
import { withAuth } from '@/lib/middleware/auth';
import { taskSchema, taskQuerySchema } from '@/lib/validation';
import { successResponse, errorResponse, paginatedResponse } from '@/lib/response';

// GET /api/tasks - List tasks with pagination, filter, search
export const GET = withAuth(async (request: NextRequest, context, user) => {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const queryParsed = taskQuerySchema.safeParse({
      page: searchParams.get('page') || 1,
      limit: searchParams.get('limit') || 10,
      status: searchParams.get('status') || 'all',
      search: searchParams.get('search') || '',
    });

    if (!queryParsed.success) {
      return errorResponse('Invalid query parameters', 400);
    }

    const { page, limit, status, search } = queryParsed.data;

    // Build query
    const query: Record<string, unknown> = { userId: user.userId };

    if (status && status !== 'all') {
      query.status = status;
    }

    if (search) {
      // Use regex for search (case-insensitive) - safe against injection via Mongoose
      query.title = { $regex: search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), $options: 'i' };
    }

    const skip = (page - 1) * limit;

    const [tasks, total] = await Promise.all([
      Task.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      Task.countDocuments(query),
    ]);

    return paginatedResponse(tasks, total, page, limit);
  } catch (error) {
    console.error('Get tasks error:', error);
    return errorResponse('Internal server error', 500);
  }
});

// POST /api/tasks - Create a task
export const POST = withAuth(async (request: NextRequest, context, user) => {
  try {
    await dbConnect();

    const body = await request.json();
    const parsed = taskSchema.safeParse(body);

    if (!parsed.success) {
      return errorResponse('Validation failed', 400, parsed.error.flatten().fieldErrors);
    }

    const task = await Task.create({
      ...parsed.data,
      userId: user.userId,
    });

    return successResponse({ task }, 201);
  } catch (error) {
    console.error('Create task error:', error);
    return errorResponse('Internal server error', 500);
  }
});
