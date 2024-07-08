import request from 'supertest';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { app, server } from '../shared/server';
import { User } from '../modules/users/models/User';
import { Car } from '../modules/cars/models/Car';
import { Reserve } from '../modules/reserves/models/Reserve';

const MAIN_ROUTE = '/api/v1/reserve';
let token: string;
let userId: string;
let carId: string;
let reserveId1: string;
let reserveId2: string;

const createUserAndCar = async () => {
  await User.deleteMany({});
  await Car.deleteMany({});
  await Reserve.deleteMany({});

  const user = { id: new mongoose.Types.ObjectId().toString() };
  token = jwt.sign(user, process.env.JWT_SECRET as string, { expiresIn: '12h' });

  await mongoose.connect(process.env.MONGODB_URI as string);

  const userResponse = await request(app)
    .post('/api/v1/user')
    .send({
      name: 'Test User',
      cpf: '123.456.789-00',
      birth: '01/01/1990',
      email: 'testuser@example.com',
      password: '123456',
      cep: '12345678',
      qualified: 'sim',
    })
    .set('Authorization', `Bearer ${token}`);
  userId = userResponse.body._id;

  const carResponse = await request(app)
    .post('/api/v1/car')
    .send({
      model: 'Test Car',
      year: 2020,
      color: 'Red',
      value_per_day: 50,
      accessories: [{ description: 'Air Conditioning' }],
      number_of_passengers: 5,
    })
    .set('Authorization', `Bearer ${token}`);
  carId = carResponse.body._id;

  const reserveResponse1 = await request(app)
    .post(MAIN_ROUTE)
    .send({
      id_user: userId,
      id_car: carId,
      start_date: '01/01/2022',
      end_date: '10/01/2022',
    })
    .set('Authorization', `Bearer ${token}`);
  reserveId1 = reserveResponse1.body._id;

  const reserveResponse2 = await request(app)
    .post(MAIN_ROUTE)
    .send({
      id_user: userId,
      id_car: carId,
      start_date: '11/01/2022',
      end_date: '20/01/2022',
    })
    .set('Authorization', `Bearer ${token}`);
  reserveId2 = reserveResponse2.body._id;
};

beforeAll(async () => {
  await createUserAndCar();
});

afterAll(async () => {
  await mongoose.connection.close();
  server.close();
});

describe('Reserve Tests', () => {
  it('should list all reserves', async () => {
    const listResponse = await request(app)
      .get(MAIN_ROUTE)
      .set('Authorization', `Bearer ${token}`);
    expect(listResponse.status).toBe(200);
    expect(listResponse.body.reserves.length).toBeGreaterThan(1);
  });

  it('should create a reserve', async () => {
    const reserveData = {
      id_user: userId,
      id_car: carId,
      start_date: '21/01/2022',
      end_date: '30/01/2022',
    };
    const response = await request(app)
      .post(MAIN_ROUTE)
      .send(reserveData)
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(201);
    expect(response.body.start_date).toBe('21/01/2022');
    reserveId1 = response.body._id;
  });

  it('should not create a reserve without start_date', async () => {
    const reserveData = {
      id_user: userId,
      id_car: carId,
      end_date: '10/01/2022',
    };
    const response = await request(app)
      .post(MAIN_ROUTE)
      .send(reserveData)
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(400);
    expect(response.body.message).toContain('Validation failed');
  });

  it('should not create a reserve with invalid date format', async () => {
    const reserveData = {
      id_user: userId,
      id_car: carId,
      start_date: 'invalid-date',
      end_date: '10/01/2022',
    };
    const response = await request(app)
      .post(MAIN_ROUTE)
      .send(reserveData)
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(400);
    expect(response.body.message).toContain('Validation failed');
  });

  it('should show a reserve', async () => {
    const response = await request(app)
      .get(`${MAIN_ROUTE}/${reserveId1}`)
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(200);
    expect(response.body._id).toBe(reserveId1);
  });

  it('should update a reserve', async () => {
    const updatedData = {
      id_user: userId,
      id_car: carId,
      start_date: '01/02/2022',
      end_date: '10/02/2022',
    };
    const response = await request(app)
      .put(`${MAIN_ROUTE}/${reserveId1}`)
      .send(updatedData)
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(200);
    expect(response.body.end_date).toBe('10/02/2022');
  });

  it('should delete a reserve', async () => {
    const response = await request(app)
      .delete(`${MAIN_ROUTE}/${reserveId1}`)
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(204);

    const checkResponse = await request(app)
      .get(`${MAIN_ROUTE}/${reserveId1}`)
      .set('Authorization', `Bearer ${token}`);
    expect(checkResponse.status).toBe(404);
  });

  it('should not create a reserve with overlapping dates for the same car', async () => {
    const reserveData = {
      id_user: userId,
      id_car: carId,
      start_date: '01/03/2022',
      end_date: '10/03/2022',
    };
    await request(app)
      .post(MAIN_ROUTE)
      .send(reserveData)
      .set('Authorization', `Bearer ${token}`);
    const overlappingReserveData = {
      ...reserveData,
      start_date: '05/03/2022',
      end_date: '15/03/2022',
    };
    const response = await request(app)
      .post(MAIN_ROUTE)
      .send(overlappingReserveData)
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(400);
    expect(response.body.message).toContain(
      'Car is already reserved for the selected dates',
    );
  });

  it('should not create a reserve with overlapping dates for the same user', async () => {
    const reserveData = {
      id_user: userId,
      id_car: carId,
      start_date: '01/04/2022',
      end_date: '10/04/2022',
    };
    await request(app)
      .post(MAIN_ROUTE)
      .send(reserveData)
      .set('Authorization', `Bearer ${token}`);
    const overlappingReserveData = {
      ...reserveData,
      start_date: '05/04/2022',
      end_date: '15/04/2022',
    };
    const response = await request(app)
      .post(MAIN_ROUTE)
      .send(overlappingReserveData)
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(400);
    expect(response.body.message).toContain(
      'Car is already reserved for the selected dates',
    );
  });

  it('should not create a reserve for a non-existing car', async () => {
    const invalidReserveData = {
      id_user: userId,
      id_car: 'nonexistentcarid',
      start_date: '01/05/2022',
      end_date: '10/05/2022',
    };
    const response = await request(app)
      .post(MAIN_ROUTE)
      .send(invalidReserveData)
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(400);
    expect(response.body.message).toContain('Validation failed');
  });

  it('should not create a reserve for a non-existing user', async () => {
    const invalidReserveData = {
      id_user: 'nonexistentuserid',
      id_car: carId,
      start_date: '01/06/2022',
      end_date: '10/06/2022',
    };
    const response = await request(app)
      .post(MAIN_ROUTE)
      .send(invalidReserveData)
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(400);
    expect(response.body.message).toContain('Validation failed');
  });
});
