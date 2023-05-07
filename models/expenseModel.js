import mongoose from 'mongoose'

const expenseSchema = mongoose.Schema(
  {
    needDescription: {
      type: String,
      required: true,
    },
    total: {
      type: Number,
      required: true,
      default: 0,
    },
    image: {
      type: String
    },
  },
  {
    timestamps: true,
  }
)

const Expense = mongoose.model('Expense', expenseSchema)

export default Expense
