import http from 'http'
import { Server } from 'socket.io'
import path from 'path'
import express from 'express'
import dotenv from 'dotenv'
import colors from 'colors'
import morgan from 'morgan'
import { notFound, errorHandler } from './middleware/errorMiddleware.js'
import connectDB from './config/db.js'

import productRoutes from './routes/productRoutes.js'
import announceRoutes from './routes/announceRoutes.js'
import supplierRoutes from './routes/supplierRoutes.js'
import expenseRoutes from './routes/expenseRoutes.js'
import userRoutes from './routes/userRoutes.js'
import orderRoutes from './routes/orderRoutes.js'
import uploadRoutes from './routes/uploadRoutes.js'
import bankAccountRoutes from './routes/bankAccountRoutes.js'

dotenv.config()

connectDB()

const app = express()

const server = http.createServer(app)
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    transports: ['websocket'],
    credentials: true,
    allowEIO3: true
  },
  allowEIO3: true,
})

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}

app.use(express.json())

app.use('/api/products', productRoutes)
app.use('/api/announces', announceRoutes)
app.use('/api/suppliers', supplierRoutes)
app.use('/api/expenses', expenseRoutes)
app.use('/api/users', userRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/upload', uploadRoutes)
app.use('/api/bankAccounts', bankAccountRoutes)

app.get('/api/config/paypal', (req, res) =>
  res.send(process.env.PAYPAL_CLIENT_ID)
)

const __dirname = path.resolve()
app.use('/uploads', express.static(path.join(__dirname, '/uploads')))

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '/frontend/build')))

  app.get('*', (req, res) =>
    res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'))
  )
} else {
  app.get('/', (req, res) => {
    res.send('API is running....')
  })
}

app.use(notFound)
app.use(errorHandler)

const PORT = process.env.PORT || 5000

app.set('io', io);

server.listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold
  )
)

let interval;

io.on('connection', (socket) => {
  console.log('New Socket Connection...');
  if (interval) {
    clearInterval(interval);
  }
  interval = setInterval(() => io.emit('ping'), 1000);

  socket.on('disconnect', () => {
    console.log('Client disconnected');
    clearInterval(interval);
  });

  socket.on('addOrderItems', (data) => {
    console.log('addOrderItems', data);
    io.emit('orderItemsAdded', data);
  });
});