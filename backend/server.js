import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import morgan from 'morgan'
import path from 'path'
import Razorpay from 'razorpay'
import shortid from 'shortid'
import connectDB from './config/db.js'
import { errorHandler, notFound } from './middleware/errorMiddleware.js'
import orderRoutes from './routes/orderRoutes.js'
import productRoutes from './routes/productRoutes.js'
import uploadRoutes from './routes/uploadRoutes.js'
import userRoutes from './routes/userRoutes.js'

dotenv.config()

connectDB()

const app = express()

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}

app.use(express.json())
app.use(cors())

app.use('/api/products', productRoutes)
app.use('/api/users', userRoutes)
app.use('/api/orders', orderRoutes)

const razorpay = new Razorpay({
  key_id: 'rzp_test_EJ00MuTuNEAmBe',
  key_secret: 'EaJOyHUzg1qmjGA4XBczhhcq',
});

app.post('/api/config/razorpay', async (req, res) => {
const payment_capture = 1
const amount= order.totalPrice*100
const currency = 'INR'

const options={ 
  amount : (amount*100).toString(),
  currency, 
  receipt : shortid.generate(), 
  payment_capture
}

  try {
      const response = await razorpay.orders.create(options)
      console.log(response)
      res.json({
          id: response.id,
          currency: response.currency,
          amount: response.amount
      })
  } catch (error) {
      console.log(error)
  }

})


app.use('/api/upload', uploadRoutes)

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

app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
)
