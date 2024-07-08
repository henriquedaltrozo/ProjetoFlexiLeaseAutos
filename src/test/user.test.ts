import request from 'supertest';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { app, server } from '../shared/server';
import { User } from '../modules/users/models/User';
import { Car } from '../modules/cars/models/Car';
import { Reserve } from '../modules/reserves/models/Reserve';

const MAIN_ROUTE = '/api/v1/user';
let token: string;

beforeAll(async () => {
  await mongoose.connect(process.env.MONGODB_URI as string);

  await User.deleteMany({});
  await Car.deleteMany({});
  await Reserve.deleteMany({});

  const user = { id: new mongoose.Types.ObjectId().toString() };
  token = jwt.sign(user, process.env.JWT_SECRET as string, { expiresIn: '12h' });
});

afterAll(async () => {
  await mongoose.connection.close();
  server.close();
});

describe('User Tests', () => {
  const userData = {
    name: 'Henrique',
    cpf: '100.000.000-00',
    birth: '02/10/2000',
    email: 'henrique1@email.com',
    password: '12345678',
    cep: '01001000',
    qualified: 'sim',
  };

  const createUser = async (data: any) => {
    return await request(app)
      .post(MAIN_ROUTE)
      .send(data)
      .set('Authorization', `Bearer ${token}`);
  };

  it('should create a user', async () => {
    const response = await createUser(userData);
    expect(response.status).toBe(201);
    expect(response.body.email).toBe(userData.email);
    expect(response.body).toHaveProperty('_id');
    expect(response.body).toHaveProperty('password');
  }, 10000);

  it('should not create a user with an existing email', async () => {
    await createUser(userData);
    const response = await createUser(userData);
    expect(response.status).toBe(400);
    expect(response.body.message).toContain('duplicate key error');
  });

  it('should list all users', async () => {
    const response = await request(app)
      .get(MAIN_ROUTE)
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
  }, 10000);

  it('should show a user', async () => {
    const userResponse = await createUser({
      name: 'Test User',
      cpf: '200.000.000-00',
      birth: '02/10/2000',
      email: 'testuser@email.com',
      password: '12345678',
      cep: '01001000',
      qualified: 'sim',
    });
    const userId = userResponse.body._id;

    const response = await request(app)
      .get(`${MAIN_ROUTE}/${userId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(200);
    expect(response.body.email).toBe('testuser@email.com');
    expect(response.body).toHaveProperty('_id');
    expect(response.body).toHaveProperty('password');
  }, 10000);

  it('should update a user', async () => {
    const userResponse = await createUser({
      name: 'User To Update',
      cpf: '300.000.000-00',
      birth: '02/10/2000',
      email: 'usertoupdate@email.com',
      password: '12345678',
      cep: '01001000',
      qualified: 'sim',
    });
    const userId = userResponse.body._id;

    const updateData = {
      name: 'Updated User',
      email: 'updateduser@email.com',
    };

    const response = await request(app)
      .put(`${MAIN_ROUTE}/${userId}`)
      .send(updateData)
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(200);
    expect(response.body.name).toBe('Updated User');
    expect(response.body.email).toBe('updateduser@email.com');
  }, 10000);

  it('should delete a user', async () => {
    const userResponse = await createUser({
      name: 'User To Delete',
      cpf: '400.000.000-00',
      birth: '02/10/2000',
      email: 'usertodelete@email.com',
      password: '12345678',
      cep: '01001000',
      qualified: 'sim',
    });
    const userId = userResponse.body._id;

    const response = await request(app)
      .delete(`${MAIN_ROUTE}/${userId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(204);

    const checkResponse = await request(app)
      .get(`${MAIN_ROUTE}/${userId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(checkResponse.status).toBe(404);
  }, 10000);

  it('should not create a user with an invalid birth date', async () => {
    const invalidUserData = {
      ...userData,
      birth: 'invalid-date',
    };
    const response = await createUser(invalidUserData);
    expect(response.status).toBe(400);
    expect(response.body.message).toContain('Validation failed');
  });

  it('should not create a user under 18 years old', async () => {
    const underageUserData = {
      ...userData,
      birth: '02/10/2010',
    };
    const response = await createUser(underageUserData);
    expect(response.status).toBe(400);
    expect(response.body.message).toContain(
      'User must be at least 18 years old',
    );
  });

  it('should authenticate a user with correct credentials', async () => {
    await createUser(userData);
    const response = await request(app).post('/api/v1/authenticate').send({
      email: userData.email,
      password: userData.password,
    });
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token');
  }, 10000);

  it('should not authenticate a user with incorrect credentials', async () => {
    const response = await request(app).post('/api/v1/authenticate').send({
      email: userData.email,
      password: 'wrongpassword',
    });
    expect(response.status).toBe(400);
    expect(response.body.message).toContain(
      'Incorrect email/password combination',
    );
  });

  it('should not delete a user with invalid ID', async () => {
    const invalidId = '1234';
    const response = await request(app)
      .delete(`${MAIN_ROUTE}/${invalidId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(400);
    expect(response.body.message).toContain('Validation failed');
  });

  it('should not update a user with invalid ID', async () => {
    const invalidId = '1234';
    const updateData = {
      name: 'Invalid Update',
    };
    const response = await request(app)
      .put(`${MAIN_ROUTE}/${invalidId}`)
      .send(updateData)
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(400);
    expect(response.body.message).toContain('Invalid ID format');
  });

  it('should not show a user with invalid ID', async () => {
    const invalidId = '1234';
    const response = await request(app)
      .get(`${MAIN_ROUTE}/${invalidId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(400);
    expect(response.body.message).toContain('Validation failed');
  });
});
