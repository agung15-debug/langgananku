import bcrypt from 'bcryptjs'

const users = [
  {
    name: 'Admin User',
    email: 'admin@example.com',
    phone: "08123456789",
    password: bcrypt.hashSync('123123', 10),
    isAdmin: true,
  },
  {
    name: 'Latif',
    email: 'latif@example.com',
    phone: "08123456789",
    password: bcrypt.hashSync('123123', 10),
  },
  {
    name: 'John Doe',
    email: 'john@example.com',
    phone: "08123456789",
    password: bcrypt.hashSync('123123', 10),
  },
  {
    name: 'Jane Doe',
    email: 'jane@example.com',
    phone: "08123456789",
    password: bcrypt.hashSync('123123', 10),
  },
]

export default users
