import { Hono } from 'hono';

const app = new Hono();

app.get('/api', (c) => c.text('Hello from Hono!'));

app.get('/api/json', (c) => c.json({ message: 'This is a JSON response.' }));

export default app;