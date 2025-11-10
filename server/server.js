require('dotenv').config()
const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const path = require('path')
const authRoutes = require('./routes/auth')

const app = express()
const PORT = process.env.PORT || 4000

app.use(cors())
app.use(express.json())

// API routes
app.use('/api/auth', authRoutes)
app.get('/api/health', (req, res) => res.json({ ok: true }))

// Serve frontend
app.use(express.static(path.join(__dirname, '../dist')))
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'))
})

async function start() {
  try {
    const uri = process.env.MONGO_URI
    if (!uri) throw new Error('MONGO_URI not set')
    await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    console.log('Connected to MongoDB')

    app.listen(PORT, () => {
      console.log(`Server listening on http://localhost:${PORT}`)
    })
  } catch (err) {
    console.error('Failed to start server', err)
    process.exit(1)
  }
}

start()
