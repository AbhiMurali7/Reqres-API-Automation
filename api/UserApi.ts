import { APIRequestContext } from '@playwright/test';

export class UserApi {
  constructor(private request: APIRequestContext) {}

  async getUsers(page = 1) {
    return this.request.get(`/api/users?page=${page}`);
  }

  async getUser(id: number) {
    return this.request.get(`/api/users/${id}`);
  }

  async createUser(name: string, job: string) {
    return this.request.post('/api/users', {
      data: { name, job },
    });
  }

  async updateUser(id: number, name: string, job: string) {
    return this.request.put(`/api/users/${id}`, {
      data: { name, job },
    });
  }

  async patchUser(id: number, data: Record<string, string>) {
    return this.request.patch(`/api/users/${id}`, { data });
  }

  async deleteUser(id: number) {
    return this.request.delete(`/api/users/${id}`);
  }

  async login(email: string, password: string) {
    return this.request.post('/api/login', {
      data: { email, password },
    });
  }

  async register(email: string, password: string) {
    return this.request.post('/api/register', {
      data: { email, password },
    });
  }
}