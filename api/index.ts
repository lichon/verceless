import { Hono } from 'hono';
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_KEY!)

const app = new Hono();

app.get('/api', (c) => c.text('Hello from Hono!'));

app.post('/api/rooms/:name/message', async (c) => {
  const name = c.req.param('name')
  if (!name?.length || name === 'null' || name === 'undefined') {
    return c.text('invalid request', 400)
  }
  const content = await c.req.json()
  const ch = supabase.channel(`room:${name}:messages`)
  await ch.send({
    type: 'broadcast',
    event: 'message',
    payload: {
      content,
      sender: 'channel',
      timestamp: new Date().toISOString(),
    },
  })
  c.json({ message: 'ok' })
});

export default app;