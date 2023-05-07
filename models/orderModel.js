import mongoose from 'mongoose'

const orderSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    orderItems: [
      {
        name: { type: String, required: true },
        qty: { type: Number, required: true },
        image: { type: String, required: true },
        basePrice: { type: Number, required: true },
        sellingPrice: { type: Number, required: true },
        groceryPrice: { type: Number, required: true },
        discountThreshold: { type: Number, required: true },
        discountPercentage: { type: Number, required: true },
        product: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: 'Product',
        },
      },
    ],
    pickupNote: {
      date: { type: Date, required: true },
      note: { type: String },
    },
    paymentMethod: {
      type: String,
      required: true,
    },
    paymentResult: {
      status: { type: String },
      update_time: { type: Date },
      email_address: { type: String },
      phone: { type: String },
      proof: { type: String },
    },
    discountPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    totalPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    totalProfit: {
      type: Number,
      required: true,
      default: 0.0,
    },
    isPaid: {
      type: Boolean,
      required: true,
      default: false,
    },
    paidAt: {
      type: Date,
    },
    isDone: {
      type: Boolean,
      required: true,
      default: false,
    },
    doneAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
)

const Order = mongoose.model('Order', orderSchema)

export default Order
