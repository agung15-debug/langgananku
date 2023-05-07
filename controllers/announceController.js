import asyncHandler from 'express-async-handler'
import Announce from '../models/announceModel.js'

// @desc    Fetch all announces
// @route   GET /api/announces
// @access  Public
const getAnnounces = asyncHandler(async (req, res) => {
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

  const count = await Announce.countDocuments({ ...keyword })
  const announces = await Announce.find({ ...keyword })
    .limit(pageSize)
    .skip(pageSize * (page - 1))

  res.json({ announces, page, pages: Math.ceil(count / pageSize) })
})

// @desc    Fetch single announce
// @route   GET /api/announces/:id
// @access  Public
const getAnnounceById = asyncHandler(async (req, res) => {
  const announce = await Announce.findById(req.params.id)

  if (announce) {
    res.json(announce)
  } else {
    res.status(404)
    throw new Error('Announce not found')
  }
})

// @desc    Delete a announce
// @route   DELETE /api/announces/:id
// @access  Private/Admin
const deleteAnnounce = asyncHandler(async (req, res) => {
  const announce = await Announce.findById(req.params.id)

  if (announce) {
    await announce.remove()
    res.json({ message: 'Announce removed' })
  } else {
    res.status(404)
    throw new Error('Announce not found')
  }
})

// @desc    Create a announce
// @route   POST /api/announces
// @access  Private/Admin
const createAnnounce = asyncHandler(async (req, res) => {
  const announce = new Announce({
    name: 'Sample name',
    image: '/images/sample.jpg',
    description: 'Sample description',
  })

  const createdAnnounce = await announce.save()
  res.status(201).json(createdAnnounce)
})

// @desc    Update a announce
// @route   PUT /api/announces/:id
// @access  Private/Admin
const updateAnnounce = asyncHandler(async (req, res) => {
  const {
    name,
    image,
    description,
  } = req.body

  const announce = await Announce.findById(req.params.id)

  if (announce) {
    announce.name = name
    announce.image = image
    announce.description = description

    const updatedAnnounce = await announce.save()
    res.json(updatedAnnounce)
  } else {
    res.status(404)
    throw new Error('Announce not found')
  }
})

const getBanners = asyncHandler(async (req, res) => {
  const announces = await Announce.find({})
  res.json(announces)
})

const createTextAnnounce = asyncHandler(async (req, res) => {
  const textAnnounce = await Announce.findOne({ isText: true })

  if (textAnnounce) {
    await textAnnounce.remove()
    res.json({ message: 'Text announce removed' })
  }

  const {
    description,
  } = req.body

  const announce = new Announce({
    name: 'Text Announce',
    image: '/images/sample.jpg',
    description: description,
    isText: true,
  })

  const createdAnnounce = await announce.save()
  res.status(201).json(createdAnnounce)
})

const getTextAnnounce = asyncHandler(async (req, res) => {
  const textAnnounce = await Announce.findOne({ isText: true })
  res.json(textAnnounce)
})

const deleteTextAnnounce = asyncHandler(async (req, res) => {
  const textAnnounce = await Announce.findOne({ isText: true })

  await textAnnounce.remove()
    res.json({ message: 'Announce removed' })

})

export {
  getAnnounces,
  getAnnounceById,
  deleteAnnounce,
  createAnnounce,
  updateAnnounce,
  getBanners,
  createTextAnnounce,
  getTextAnnounce,
  deleteTextAnnounce,
}
