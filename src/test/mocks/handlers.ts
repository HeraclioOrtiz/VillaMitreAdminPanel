import { http, HttpResponse } from 'msw';
import { mockUsers, mockExercises, mockTemplates } from './data';
import type { User } from '@/types/user';
import type { Exercise } from '@/types/exercise';

export const handlers = [
  // Users API
  http.get('/api/admin/users', ({ request }) => {
    const url = new URL(request.url);
    const page = Number(url.searchParams.get('page')) || 1;
    const perPage = Number(url.searchParams.get('per_page')) || 20;
    const search = url.searchParams.get('search') || '';
    
    let filteredUsers = mockUsers;
    
    // Apply search filter
    if (search) {
      filteredUsers = mockUsers.filter(user => 
        user.first_name.toLowerCase().includes(search.toLowerCase()) ||
        user.last_name.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    const startIndex = (page - 1) * perPage;
    const endIndex = startIndex + perPage;
    const paginatedUsers = filteredUsers.slice(startIndex, endIndex);
    
    return HttpResponse.json({
      data: paginatedUsers,
      meta: {
        current_page: page,
        per_page: perPage,
        total: filteredUsers.length,
        last_page: Math.ceil(filteredUsers.length / perPage),
        from: startIndex + 1,
        to: Math.min(endIndex, filteredUsers.length)
      }
    });
  }),

  http.get('/api/admin/users/:id', ({ params }) => {
    const user = mockUsers.find(u => u.id === Number(params.id));
    if (!user) {
      return new HttpResponse(null, { status: 404 });
    }
    return HttpResponse.json(user);
  }),

  http.post('/api/admin/users', async ({ request }) => {
    const userData = await request.json() as Partial<User>;
    const newUser = {
      id: Date.now(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      ...userData
    } as User;
    return HttpResponse.json(newUser, { status: 201 });
  }),

  http.put('/api/admin/users/:id', async ({ params, request }) => {
    const userData = await request.json() as Partial<User>;
    const user = mockUsers.find((u: User) => u.id === Number(params.id));
    if (!user) {
      return new HttpResponse(null, { status: 404 });
    }
    const updatedUser = { ...user, ...userData, updated_at: new Date().toISOString() } as User;
    return HttpResponse.json(updatedUser);
  }),

  http.delete('/api/admin/users/:id', ({ params }) => {
    const userIndex = mockUsers.findIndex(u => u.id === Number(params.id));
    if (userIndex === -1) {
      return new HttpResponse(null, { status: 404 });
    }
    mockUsers.splice(userIndex, 1);
    return new HttpResponse(null, { status: 204 });
  }),

  // Exercises API
  http.get('/api/gym/exercises', ({ request }) => {
    const url = new URL(request.url);
    const page = Number(url.searchParams.get('page')) || 1;
    const perPage = Number(url.searchParams.get('per_page')) || 20;
    const search = url.searchParams.get('search') || '';
    const muscleGroup = url.searchParams.get('muscle_group');
    
    let filteredExercises = mockExercises;
    
    // Apply filters
    if (search) {
      filteredExercises = filteredExercises.filter(exercise => 
        exercise.name.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    if (muscleGroup) {
      filteredExercises = filteredExercises.filter(exercise => 
        exercise.muscle_group.includes(muscleGroup)
      );
    }
    
    const startIndex = (page - 1) * perPage;
    const endIndex = startIndex + perPage;
    const paginatedExercises = filteredExercises.slice(startIndex, endIndex);
    
    return HttpResponse.json({
      data: paginatedExercises,
      meta: {
        current_page: page,
        per_page: perPage,
        total: filteredExercises.length,
        last_page: Math.ceil(filteredExercises.length / perPage)
      }
    });
  }),

  http.get('/api/gym/exercises/:id', ({ params }) => {
    const exercise = mockExercises.find(e => e.id === Number(params.id));
    if (!exercise) {
      return new HttpResponse(null, { status: 404 });
    }
    return HttpResponse.json(exercise);
  }),

  http.post('/api/gym/exercises', async ({ request }) => {
    const exerciseData = await request.json() as Partial<Exercise>;
    const newExercise = {
      id: Date.now(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      ...exerciseData
    } as Exercise;
    return HttpResponse.json(newExercise, { status: 201 });
  }),

  // Templates API
  http.get('/api/gym/daily-templates', () => {
    return HttpResponse.json({
      data: mockTemplates,
      meta: { total: mockTemplates.length }
    });
  }),

  // Error scenarios for testing
  http.get('/api/error-test', () => {
    return HttpResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    );
  }),

  http.get('/api/network-error', () => {
    return HttpResponse.error();
  })
];
