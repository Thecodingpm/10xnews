// Mock Prisma client for when DATABASE_URL is not available
const createMockPrisma = () => ({
  post: {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
    findMany: (_args?: any) => Promise.resolve([]),
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
    findUnique: (_args?: any) => Promise.resolve(null),
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
    findFirst: (_args?: any) => Promise.resolve(null),
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
    create: (_args?: any) => Promise.resolve({ id: 'mock-post-id', title: 'Mock Post', slug: 'mock-post', published: false }),
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
    update: (_args?: any) => Promise.resolve(null),
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
    delete: (_args?: any) => Promise.resolve(null),
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
    deleteMany: (_args?: any) => Promise.resolve({ count: 0 }),
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
    count: (_args?: any) => Promise.resolve(0),
  },
  category: {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
    findMany: (_args?: any) => Promise.resolve([]),
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
    findUnique: (_args?: any) => Promise.resolve(null),
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
    findFirst: (_args?: any) => Promise.resolve(null),
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
    create: (_args?: any) => Promise.resolve(null),
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
    update: (_args?: any) => Promise.resolve(null),
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
    delete: (_args?: any) => Promise.resolve(null),
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
    deleteMany: (_args?: any) => Promise.resolve({ count: 0 }),
  },
  user: {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
    findMany: (_args?: any) => Promise.resolve([]),
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
    findUnique: (_args?: any) => Promise.resolve(null),
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
    findFirst: (_args?: any) => Promise.resolve(null),
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
    create: (_args?: any) => Promise.resolve({ id: 'mock-user-id', email: 'admin@10xnews.com', name: '10xNews Staff', role: 'ADMIN' }),
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
    update: (_args?: any) => Promise.resolve(null),
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
    delete: (_args?: any) => Promise.resolve(null),
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
    deleteMany: (_args?: any) => Promise.resolve({ count: 0 }),
  },
  account: {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
    findMany: (_args?: any) => Promise.resolve([]),
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
    findUnique: (_args?: any) => Promise.resolve(null),
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
    findFirst: (_args?: any) => Promise.resolve(null),
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
    create: (_args?: any) => Promise.resolve(null),
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
    update: (_args?: any) => Promise.resolve(null),
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
    delete: (_args?: any) => Promise.resolve(null),
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
    deleteMany: (_args?: any) => Promise.resolve({ count: 0 }),
  },
  session: {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
    findMany: (_args?: any) => Promise.resolve([]),
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
    findUnique: (_args?: any) => Promise.resolve(null),
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
    findFirst: (_args?: any) => Promise.resolve(null),
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
    create: (_args?: any) => Promise.resolve(null),
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
    update: (_args?: any) => Promise.resolve(null),
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
    delete: (_args?: any) => Promise.resolve(null),
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
    deleteMany: (_args?: any) => Promise.resolve({ count: 0 }),
  },
  verificationToken: {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
    findMany: (_args?: any) => Promise.resolve([]),
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
    findUnique: (_args?: any) => Promise.resolve(null),
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
    findFirst: (_args?: any) => Promise.resolve(null),
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
    create: (_args?: any) => Promise.resolve(null),
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
    update: (_args?: any) => Promise.resolve(null),
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
    delete: (_args?: any) => Promise.resolve(null),
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
    deleteMany: (_args?: any) => Promise.resolve({ count: 0 }),
  },
  comment: {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
    findMany: (_args?: any) => Promise.resolve([]),
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
    findUnique: (_args?: any) => Promise.resolve(null),
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
    findFirst: (_args?: any) => Promise.resolve(null),
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
    create: (_args?: any) => Promise.resolve(null),
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
    update: (_args?: any) => Promise.resolve(null),
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
    delete: (_args?: any) => Promise.resolve(null),
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
    deleteMany: (_args?: any) => Promise.resolve({ count: 0 }),
  },
})

// Conditional Prisma client - only initialize if DATABASE_URL is available
let prisma: ReturnType<typeof createMockPrisma> | null = null

// Only import and initialize Prisma if DATABASE_URL is available
if (process.env.DATABASE_URL) {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { PrismaClient } = require('@prisma/client')

const globalForPrisma = globalThis as unknown as {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      prisma: any
}

    prisma = globalForPrisma.prisma ?? new PrismaClient()

    if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}
  } catch {
    console.warn('Prisma client not initialized - DATABASE_URL not available or Prisma not installed')
    prisma = createMockPrisma()
  }
} else {
  // Use mock client when DATABASE_URL is not available
  prisma = createMockPrisma()
}

export { prisma }
