import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  // Categories
  const categories = ['Cultural', 'Sports', 'Technical', 'Social', 'Infrastructure']
  
  for (const name of categories) {
    await prisma.category.upsert({
      where: { name },
      update: {},
      create: { name },
    })
  }

  // Admin User
  const hashedPassword = await bcrypt.hash('admin123', 10)
  await prisma.user.upsert({
    where: { email: 'admin@university.edu' },
    update: {},
    create: {
      email: 'admin@university.edu',
      name: 'Super Admin',
      password: hashedPassword,
      role: 'ADMIN',
    },
  })

  console.log('Seed executed: Categories and Admin user created.')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
