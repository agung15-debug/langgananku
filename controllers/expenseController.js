import asyncHandler from 'express-async-handler'
import Expense from '../models/expenseModel.js'

// @desc    Fetch all expenses
// @route   GET /api/expenses
// @access  Public
const getExpenses = asyncHandler(async (req, res) => {
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

  const count = await Expense.countDocuments({ ...keyword })
  const expenses = await Expense.find({ ...keyword })
    .limit(pageSize)
    .skip(pageSize * (page - 1))

  res.json({ expenses, page, pages: Math.ceil(count / pageSize) })
})

// @desc    Fetch single expense
// @route   GET /api/expenses/:id
// @access  Public
const getExpenseById = asyncHandler(async (req, res) => {
  const expense = await Expense.findById(req.params.id)

  if (expense) {
    res.json(expense)
  } else {
    res.status(404)
    throw new Error('Expense not found')
  }
})

// @desc    Delete a expense
// @route   DELETE /api/expenses/:id
// @access  Private/Admin
const deleteExpense = asyncHandler(async (req, res) => {
  const expense = await Expense.findById(req.params.id)

  if (expense) {
    await expense.remove()
    res.json({ message: 'Expense removed' })
  } else {
    res.status(404)
    throw new Error('Expense not found')
  }
})

// @desc    Create a expense
// @route   POST /api/expenses
// @access  Private/Admin
const createExpense = asyncHandler(async (req, res) => {
  const expense = new Expense({
    needDescription: 'Sample description',
    total: 0,
  })

  const createdExpense = await expense.save()
  res.status(201).json(createdExpense)
})

// @desc    Update a expense
// @route   PUT /api/expenses/:id
// @access  Private/Admin
const updateExpense = asyncHandler(async (req, res) => {
  const {
    needDescription,
    total,
    image,
  } = req.body

  const expense = await Expense.findById(req.params.id)

  if (expense) {
    expense.needDescription = needDescription
    expense.total = total
    expense.image = image

    const updatedExpense = await expense.save()
    res.json(updatedExpense)
  } else {
    res.status(404)
    throw new Error('Expense not found')
  }
})

const getAllExpenses = asyncHandler(async (req, res) => {
  const expenses = await Expense.find({})
  res.json(expenses)
})

export {
  getExpenses,
  getExpenseById,
  deleteExpense,
  createExpense,
  updateExpense,
  getAllExpenses
}
