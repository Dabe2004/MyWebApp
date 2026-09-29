require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static('public'));

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

// CREATE - magdagdag ng bagong message
app.post('/api/messages', async (req, res) => {
  const { text } = req.body;

  const { data, error } = await supabase
    .from('messages')
    .insert([{ text }])
    .select();

  if (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }

  res.json(data[0]);
});

// READ - kunin lahat ng messages
app.get('/api/messages', async (req, res) => {
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .order('id', { ascending: true });

  if (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }

  res.json(data);
});

// UPDATE - baguhin ang message base sa id
app.put('/api/messages/:id', async (req, res) => {
  const id = req.params.id;
  const { text } = req.body;

  const { data, error } = await supabase
    .from('messages')
    .update({ text })
    .eq('id', id)
    .select();

  if (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }

  if (data.length === 0) {
    return res.status(404).json({ error: 'Message not found' });
  }

  res.json(data[0]);
});

// DELETE - alisin ang message base sa id
app.delete('/api/messages/:id', async (req, res) => {
  const id = req.params.id;

  const { data, error } = await supabase
    .from('messages')
    .delete()
    .eq('id', id)
    .select();

  if (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }

  if (data.length === 0) {
    return res.status(404).json({ error: 'Message not found' });
  }

  res.json({ success: true, deleted: data[0] });
});

const PORT = process.env.PORT || 3000;

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

module.exports = app;