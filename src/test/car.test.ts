import request from 'supertest';
import jwt from 'jsonwebtoken';
import { app, server } from '../shared/server';
import mongoose from 'mongoose';
import { User } from '../modules/users/models/User';
import { Car } from '../modules/cars/models/Car';
import { Reserve } from '../modules/reserves/models/Reserve';

const MAIN_ROUTE = '/api/v1/car';
let token: string;

beforeAll(async () => {
  await mongoose.connect(process.env.MONGODB_URI as string);

  await User.deleteMany({});
  await Car.deleteMany({});
  await Reserve.deleteMany({});

  const user = { id: new mongoose.Types.ObjectId().toString() };
  token = jwt.sign(user, process.env.JWT_SECRET as string);

  const carData = {
    model: 'Initial Test Model',
    color: 'Black',
    year: 2019,
    value_per_day: 120,
    accessories: [{ description: 'Sunroof' }],
    number_of_passengers: 5,
  };
  await request(app)
    .post(MAIN_ROUTE)
    .send(carData)
    .set('authorization', `bearer ${token}`);
});

afterAll(async () => {
  await mongoose.connection.close();
  server.close();
});

describe('Car Tests', () => {
  const createCar = async (carData: any) => {
    return await request(app)
      .post(MAIN_ROUTE)
      .send(carData)
      .set('authorization', `bearer ${token}`);
  };

  it('should list all cars', async () => {
    const response = await request(app)
      .get(MAIN_ROUTE)
      .set('authorization', `bearer ${token}`);
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body.cars)).toBe(true);
    expect(response.body.cars.length).toBeGreaterThan(0);
  }, 10000);

  it('should list cars with filters', async () => {
    const carData = {
      model: 'Filtered Model',
      color: 'Green',
      year: 2021,
      value_per_day: 150,
      accessories: [{ description: 'Heated Seats' }],
      number_of_passengers: 4,
    };

    await createCar(carData);

    const response = await request(app)
      .get(MAIN_ROUTE)
      .query({ model: 'Filtered Model' })
      .set('authorization', `bearer ${token}`);
    expect(response.status).toBe(200);
    expect(response.body.cars.length).toBeGreaterThan(0);
    expect(response.body.cars[0].model).toBe('Filtered Model');
  }, 10000);

  it('should create a car', async () => {
    const carData = {
      model: 'Test Model',
      color: 'Blue',
      year: 2020,
      value_per_day: 100,
      accessories: [{ description: 'Air Conditioning' }],
      number_of_passengers: 4,
    };
    const response = await createCar(carData);
    expect(response.status).toBe(201);
    expect(response.body.model).toBe('Test Model');
  }, 10000);

  it('should not create a car without model', async () => {
    const carData = {
      color: 'Blue',
      year: 2020,
      value_per_day: 100,
      accessories: [{ description: 'Air Conditioning' }],
      number_of_passengers: 4,
    };
    const response = await createCar(carData);
    expect(response.status).toBe(400);
    expect(response.body.message).toContain('Validation failed');
  });

  it('should delete a car', async () => {
    const carData = {
      model: 'Test Model',
      color: 'Blue',
      year: 2020,
      value_per_day: 100,
      accessories: [{ description: 'Air Conditioning' }],
      number_of_passengers: 4,
    };

    const createResponse = await createCar(carData);

    expect(createResponse.status).toBe(201);
    const carId = createResponse.body._id;

    const deleteResponse = await request(app)
      .delete(`${MAIN_ROUTE}/${carId}`)
      .set('authorization', `bearer ${token}`);

    expect(deleteResponse.status).toBe(204);

    const checkResponse = await request(app)
      .get(`${MAIN_ROUTE}/${carId}`)
      .set('authorization', `bearer ${token}`);
    expect(checkResponse.status).toBe(404);
  }, 10000);

  it('should not delete a car with invalid ID', async () => {
    const invalidId = '1234';
    const response = await request(app)
      .delete(`${MAIN_ROUTE}/${invalidId}`)
      .set('authorization', `bearer ${token}`);
    expect(response.status).toBe(400);
    expect(response.body.message).toContain('Validation failed');
  });

  it('should modify an accessory', async () => {
    const carData = {
      model: 'Test Model',
      color: 'Blue',
      year: 2020,
      value_per_day: 100,
      accessories: [{ description: 'Air Conditioning' }],
      number_of_passengers: 4,
    };

    const createResponse = await createCar(carData);

    expect(createResponse.status).toBe(201);
    const carId = createResponse.body._id;
    const accessoryId = createResponse.body.accessories[0]._id;

    const modifyResponse = await request(app)
      .patch(`${MAIN_ROUTE}/${carId}/accessories/${accessoryId}`)
      .send({ description: 'Heated Seats' })
      .set('authorization', `bearer ${token}`);

    expect(modifyResponse.status).toBe(200);
    expect(modifyResponse.body.accessories[0].description).toBe('Heated Seats');
  }, 10000);

  it('should update an existing accessory', async () => {
    const carData = {
      model: 'Test Model',
      color: 'Blue',
      year: 2020,
      value_per_day: 100,
      accessories: [{ description: 'Air Conditioning' }],
      number_of_passengers: 4,
    };

    const createResponse = await createCar(carData);

    expect(createResponse.status).toBe(201);
    const carId = createResponse.body._id;
    const accessoryId = createResponse.body.accessories[0]._id;

    const updateData = { description: 'Updated Air Conditioning' };

    const updateResponse = await request(app)
      .patch(`${MAIN_ROUTE}/${carId}/accessories/${accessoryId}`)
      .send(updateData)
      .set('authorization', `bearer ${token}`);

    expect(updateResponse.status).toBe(200);
    expect(updateResponse.body.accessories[0].description).toBe(
      'Updated Air Conditioning',
    );
  }, 10000);

  it('should not modify an accessory with invalid ID', async () => {
    const carData = {
      model: 'Test Model',
      color: 'Blue',
      year: 2020,
      value_per_day: 100,
      accessories: [{ description: 'Air Conditioning' }],
      number_of_passengers: 4,
    };

    const createResponse = await createCar(carData);

    expect(createResponse.status).toBe(201);
    const carId = createResponse.body._id;
    const invalidAccessoryId = '1234';

    const modifyResponse = await request(app)
      .patch(`${MAIN_ROUTE}/${carId}/accessories/${invalidAccessoryId}`)
      .send({ description: 'Heated Seats' })
      .set('authorization', `bearer ${token}`);

    expect(modifyResponse.status).toBe(400);
    expect(modifyResponse.body.message).toContain('Validation failed');
  }, 10000);

  it('should show a car', async () => {
    const carData = {
      model: 'Test Model',
      color: 'Blue',
      year: 2020,
      value_per_day: 100,
      accessories: [{ description: 'Air Conditioning' }],
      number_of_passengers: 4,
    };

    const createResponse = await createCar(carData);

    expect(createResponse.status).toBe(201);
    const carId = createResponse.body._id;

    const showResponse = await request(app)
      .get(`${MAIN_ROUTE}/${carId}`)
      .set('authorization', `bearer ${token}`);

    expect(showResponse.status).toBe(200);
    expect(showResponse.body.model).toBe('Test Model');
  }, 10000);

  it('should not show a car with invalid ID', async () => {
    const invalidId = '1234';
    const response = await request(app)
      .get(`${MAIN_ROUTE}/${invalidId}`)
      .set('authorization', `bearer ${token}`);
    expect(response.status).toBe(400);
    expect(response.body.message).toContain('Validation failed');
  });

  it('should update a car', async () => {
    const carData = {
      model: 'Test Model',
      color: 'Blue',
      year: 2020,
      value_per_day: 100,
      accessories: [{ description: 'Air Conditioning' }],
      number_of_passengers: 4,
    };

    const createResponse = await createCar(carData);

    expect(createResponse.status).toBe(201);
    const carId = createResponse.body._id;

    const updateData = {
      model: 'Updated Model',
      color: 'Red',
    };

    const updateResponse = await request(app)
      .put(`${MAIN_ROUTE}/${carId}`)
      .send(updateData)
      .set('authorization', `bearer ${token}`);

    expect(updateResponse.status).toBe(200);
    expect(updateResponse.body.model).toBe('Updated Model');
    expect(updateResponse.body.color).toBe('Red');
  }, 10000);

  it('should not update a car with invalid ID', async () => {
    const invalidId = '1234';
    const updateData = {
      model: 'Updated Model',
      color: 'Red',
    };

    const response = await request(app)
      .put(`${MAIN_ROUTE}/${invalidId}`)
      .send(updateData)
      .set('authorization', `bearer ${token}`);

    expect(response.status).toBe(400);
    expect(response.body.message).toContain('Validation failed');
  });

  it('should not create a car with a year out of range', async () => {
    const carData = {
      model: 'Test Model',
      color: 'Blue',
      year: 2040,
      value_per_day: 100,
      accessories: [{ description: 'Air Conditioning' }],
      number_of_passengers: 4,
    };
    const response = await createCar(carData);
    expect(response.status).toBe(400);
    expect(response.body.message).toContain('Validation failed');
  });

  it('should not create a car without accessories', async () => {
    const carData = {
      model: 'Test Model',
      color: 'Blue',
      year: 2020,
      value_per_day: 100,
      accessories: [],
      number_of_passengers: 4,
    };
    const response = await createCar(carData);
    expect(response.status).toBe(400);
    expect(response.body.message).toContain('Validation failed');
  });

  it('should not create a car with duplicate accessories', async () => {
    const carData = {
      model: 'Test Model',
      color: 'Blue',
      year: 2020,
      value_per_day: 100,
      accessories: [
        { description: 'Air Conditioning' },
        { description: 'Air Conditioning' },
      ],
      number_of_passengers: 4,
    };
    const response = await createCar(carData);
    expect(response.status).toBe(400);
    expect(response.body.message).toContain(
      'Accessories must be unique and there must be at least one accessory.',
    );
  });

  it('should not create a car with invalid data', async () => {
    const carData = {
      model: 12345,
      color: 'Blue',
      year: 'invalidYear',
      value_per_day: 'invalidValue',
      accessories: [{ description: 'Air Conditioning' }],
      number_of_passengers: 'invalidPassengers',
    };
    const response = await createCar(carData);
    expect(response.status).toBe(400);
    expect(response.body.message).toContain('Validation failed');
  });
});
