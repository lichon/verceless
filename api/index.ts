import { Hono } from 'hono';

const app = new Hono();

app.all('/api', (c) => c.text(`hello ${process.env.SUPABASE_URL}`));

app.post('/api/rooms/:name/message', async (c) => {
  const name = c.req.param('name')
  if (!name?.length) {
    return c.text('invalid request', 400)
  }

  const body = await c.req.json()
  return fetch(`${process.env.SUPABASE_URL}/realtime/v1/api/broadcast`, {
    method: 'POST',
    headers: {
      'apikey': process.env.SUPABASE_KEY!,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      private: false,
      messages: [
        {
          topic: `room:${name}:messages`,
          event: 'message',
          payload: {
            id: crypto.randomUUID(),
            content: body.content,
            sender: 'vercel',
            timestamp: new Date().toISOString()
          }
        }
      ]
    })
  });
});

export default app;