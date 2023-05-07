import asyncHandler from 'express-async-handler'
import BankAccount from '../models/bankAccountModel.js'

// @desc    Fetch all bankAccounts
// @route   GET /api/bankAccounts
// @access  Public
const getBankAccounts = asyncHandler(async (req, res) => {
  const pageSize = 10
  const page = Number(req.query.pageNumber) || 1

  const keyword = req.query.keyword
    ? {
        name: {
          $regex: req.query.keyword,
          $options: 'i',
        },
      }
    : {}

  const count = await BankAccount.countDocuments({ ...keyword })
  const bankAccounts = await BankAccount.find({ ...keyword })
    .limit(pageSize)
    .skip(pageSize * (page - 1))

  res.json({ bankAccounts, page, pages: Math.ceil(count / pageSize) })
})

// @desc    Fetch single bankAccount
// @route   GET /api/bankAccounts/:id
// @access  Public
const getBankAccountById = asyncHandler(async (req, res) => {
  const bankAccount = await BankAccount.findById(req.params.id)

  if (bankAccount) {
    res.json(bankAccount)
  } else {
    res.status(404)
    throw new Error('BankAccount not found')
  }
})

// @desc    Delete a bankAccount
// @route   DELETE /api/bankAccounts/:id
// @access  Private/Admin
const deleteBankAccount = asyncHandler(async (req, res) => {
  const bankAccount = await BankAccount.findById(req.params.id)

  if (bankAccount) {
    await bankAccount.remove()
    res.json({ message: 'BankAccount removed' })
  } else {
    res.status(404)
    throw new Error('BankAccount not found')
  }
})

// @desc    Create a bankAccount
// @route   POST /api/bankAccounts
// @access  Private/Admin
const createBankAccount = asyncHandler(async (req, res) => {
  const bankAccount = new BankAccount({
    isQris: false,
  })

  const createdBankAccount = await bankAccount.save()
  res.status(201).json(createdBankAccount)
})

// @desc    Update a bankAccount
// @route   PUT /api/bankAccounts/:id
// @access  Private/Admin
const updateBankAccount = asyncHandler(async (req, res) => {
  const {
    bankName,
    holderName,
    accountNumber,
    image,
    isQris
  } = req.body

  const bankAccount = await BankAccount.findById(req.params.id)

  if (bankAccount) {
    bankAccount.bankName = bankName
    bankAccount.holderName = holderName
    bankAccount.accountNumber = accountNumber
    bankAccount.isQris = isQris
    bankAccount.image = image

    const updatedBankAccount = await bankAccount.save()
    res.json(updatedBankAccount)
  } else {
    res.status(404)
    throw new Error('BankAccount not found')
  }
})

const getAllBankAccounts = asyncHandler(async (req, res) => {
  const bankAccounts = await BankAccount.find({})
  res.json(bankAccounts)
})

export {
  getBankAccounts,
  getBankAccountById,
  deleteBankAccount,
  createBankAccount,
  updateBankAccount,
  getAllBankAccounts
}
