import asyncHandler from 'express-async-handler'
import Order from '../models/orderModel.js'
import Product from '../models/productModel.js'

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const addOrderItems = asyncHandler(async (req, res) => {
  const {
    orderItems,
    pickupNote,
    paymentMethod,
    itemsPrice,
    discountPrice,
    totalPrice,
    totalProfit,
  } = req.body

  if (orderItems && orderItems.length === 0) {
    res.status(400)
    throw new Error('No order items')
    return
  } else {
    const order = new Order({
      orderItems,
      user: req.user._id,
      pickupNote,
      paymentMethod,
      itemsPrice,
      discountPrice,
      totalPrice,
      totalProfit,
    })

    const createdOrder = await order.save()

    // Emit socket event when a new order is created
    req.app.get('io').emit('orderCreated', createdOrder)

    res.status(201).json(createdOrder)
  }
})

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate(
    'user',
    'name email phone'
  )

  if (order) {
    res.json(order)
  } else {
    res.status(404)
    throw new Error('Order not found')
  }
})

// @desc    Update order to paid
// @route   GET /api/orders/:id/pay
// @access  Private
const updateOrderToPaid = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id)

  if (order) {
    order.paymentResult = {
      id: req.body.id,
      status: req.body.status,
      update_time: Date.now(),
      email_address: req.body.email_address,
      phone: req.body.phone,
      proof: req.body.proof,
    }

    const updatedOrder = await order.save()

    res.json(updatedOrder)
  } else {
    res.status(404)
    throw new Error('Order not found')
  }
})

const updateOrderToConfirmPaid = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id)

  if (order) {
    order.isPaid = true
    order.paidAt = Date.now()
    order.paymentResult.status = "processing"
    order.paymentResult.update_time = Date.now()

    const updatedOrder = await order.save()

    res.json(updatedOrder)
  } else {
    res.status(404)
    throw new Error('Order not found')
  }
})

// @desc    Update order to delivered
// @route   GET /api/orders/:id/deliver
// @access  Private/Admin
const updateOrderToDone = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id)

  if (order) {
    order.isDone = true
    order.doneAt = Date.now()
    order.paymentResult.status = "completed"
    order.paymentResult.update_time = Date.now()

    const updatedOrder = await order.save()

    // Kurangi jumlah stok produk yang terkait dengan pesanan
    const products = updatedOrder.orderItems
    for (let i = 0; i < products.length; i++) {
      const product = products[i]
      const item = await Product.findById(product.product)

      if (item) {
        item.countInStock = item.countInStock - product.qty
        await item.save()
      }
    }

    res.json(updatedOrder)
  } else {
    res.status(404)
    throw new Error('Order not found')
  }
})

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id })
  res.json(orders)
})

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({}).populate('user', 'id name phone')
  res.json(orders)
})

const getSortOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({})
    .populate('user', 'id name phone')
    .sort({ 'pickupNote.date': 1 }); // 1 menandakan ascending, -1 menandakan descending
  res.json(orders);
});

export {
  addOrderItems,
  getOrderById,
  updateOrderToPaid,
  updateOrderToConfirmPaid,
  updateOrderToDone,
  getMyOrders,
  getOrders,
  getSortOrders
}
