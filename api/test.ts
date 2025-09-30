import { Hono } from 'hono';

const app = new Hono();

app.all('*', (c) => c.text('Hello test!'));

export default app;