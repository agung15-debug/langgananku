import mongoose from 'mongoose'

const bankAccountSchema = mongoose.Schema(
  {
    bankName: {
      type: String
    },
    holderName: {
      type: String
    },
    accountNumber: {
      type: String
    },
    image: {
      type: String
    },
    isQris: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  {
    timestamps: true,
  }
)

const BankAccount = mongoose.model('BankAccount', bankAccountSchema)

export default BankAccount
