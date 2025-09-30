import { Hono } from 'hono';
import { createClient } from '@supabase/supabase-js'

const app = new Hono();

app.all('/api', (c) => c.text(`hello ${c.req.path}`));

app.get('/api/rooms/:name/message', async (c) => {
  return c.text(`hello ${c.req.param('name')} ${process.env.SUPABASE_URL}`)
}).post('/api/rooms/:name/message', async (c) => {
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
          topic: "room:asa123:messages",
          event: "message",
          payload: {
            id: crypto.randomUUID(),
            content: body.content,
            sender: "nickname",
            timestamp: new Date().toISOString()
          }
        }
      ]
    })
  });
});

export default app;