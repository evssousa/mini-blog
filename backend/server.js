const express = require('express')
const cors = require('cors')
const db = require('./db')
const PostModel = require('./PostModel')

const app = express()
app.use(cors())
app.use(express.json())

const postModel = new PostModel(db)

app.get('/posts', async (req, res) => {
  try {
    const posts = await postModel.getAll()
    res.json(posts)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.post('/posts', async (req, res) => {
  const { title, content } = req.body
  if (!title || !content) return res.status(400).json({ error: 'Dados incompletos' })

  try {
    const post = await postModel.create(title, content)
    res.json(post)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.put('/posts/:id', async (req, res) => {
  const { id } = req.params
  const { title, content } = req.body

  try {
    const changes = await postModel.update(id, title, content)
    res.json({ updated: changes })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.delete('/posts/:id', async (req, res) => {
  const { id } = req.params

  try {
    const changes = await postModel.delete(id)
    res.json({ deleted: changes })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.listen(3000, () => console.log('Servidor rodando em http://localhost:3000'))
