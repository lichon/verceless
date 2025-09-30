import { Hono } from 'hono';
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_KEY!)

const app = new Hono();

app.get('/api', (c) => c.text('Hello from Hono!'));

app.get('/api/test', (c) => c.text('Hello test path!'));

app.get('/api/rooms/:name/message', async (c) => {
  return c.text(`hello ${c.req.param('name')} ${process.env.SUPABASE_URL}`)
}).post('/api/rooms/:name/message', async (c) => {
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
  return c.json({ message: 'ok' })
});

export default app;