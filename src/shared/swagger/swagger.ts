const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Documentation',
      version: '1.0.0',
      description: 'API Documentation for the FlexiLease Autos project',
    },
    servers: [
      {
        url: 'http://localhost:3000/api-docs',
      },
    ],
    components: {
      schemas: {
        Car: {
          type: 'object',
          required: [
            'model',
            'color',
            'year',
            'value_per_day',
            'accessories',
            'number_of_passengers',
          ],
          properties: {
            model: {
              type: 'string',
            },
            color: {
              type: 'string',
            },
            year: {
              type: 'number',
            },
            value_per_day: {
              type: 'number',
            },
            accessories: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/Accessory',
              },
            },
            number_of_passengers: {
              type: 'number',
            },
          },
        },
        Accessory: {
          type: 'object',
          required: ['description'],
          properties: {
            description: {
              type: 'string',
            },
          },
        },
        User: {
          type: 'object',
          required: [
            'name',
            'cpf',
            'birth',
            'email',
            'password',
            'cep',
            'qualified',
          ],
          properties: {
            name: {
              type: 'string',
            },
            cpf: {
              type: 'string',
            },
            birth: {
              type: 'string',
              format: 'date',
            },
            email: {
              type: 'string',
              format: 'email',
            },
            password: {
              type: 'string',
            },
            cep: {
              type: 'string',
            },
            qualified: {
              type: 'string',
              enum: ['sim', 'não'],
            },
            patio: {
              type: 'string',
            },
            complement: {
              type: 'string',
            },
            neighborhood: {
              type: 'string',
            },
            locality: {
              type: 'string',
            },
            uf: {
              type: 'string',
            },
          },
        },
        Reserve: {
          type: 'object',
          required: ['start_date', 'end_date', 'id_car', 'id_user'],
          properties: {
            start_date: {
              type: 'string',
              format: 'date',
            },
            end_date: {
              type: 'string',
              format: 'date',
            },
            id_car: {
              type: 'string',
            },
            id_user: {
              type: 'string',
            },
            final_value: {
              type: 'number',
            },
          },
        },
      },
    },
  },
  apis: ['./src/modules/**/routes/*.ts', './src/modules/**/controllers/*.ts'],
};
