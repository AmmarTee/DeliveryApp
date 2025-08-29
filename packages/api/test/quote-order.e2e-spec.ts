import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module.js';

describe('Quote to Order flow', () => {
  let app: INestApplication;
  let listId: string;
  let quoteId: string;
  let orderId: string;

  beforeAll(async () => {
    const module = await Test.createTestingModule({ imports: [AppModule] }).compile();
    app = module.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('creates list', async () => {
    const res = await request(app.getHttpServer()).post('/lists').send({ userId: 'user', raw_text: 'item' });
    listId = res.body.id;
    expect(res.status).toBe(201);
  });

  it('requests quotes', async () => {
    const res = await request(app.getHttpServer()).post(`/lists/${listId}/request-quotes`).send({ merchant_ids: ['m1'] });
    quoteId = res.body[0].id;
    expect(res.status).toBe(201);
  });

  it('merchant submits quote', async () => {
    const res = await request(app.getHttpServer()).post(`/merchant/quotes/${quoteId}`).send({ total: 100 });
    expect(res.status).toBe(200);
  });

  it('accepts quote to create order', async () => {
    const res = await request(app.getHttpServer()).post(`/quotes/${quoteId}/accept`).send();
    orderId = res.body.id;
    expect(res.status).toBe(201);
  });
});
