const { PrismaClient } = require("@prisma/client");

// Use singleton pattern to prevent multiple instances
const globalForPrisma = globalThis;

const prisma = globalForPrisma.prisma || new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
  log: ['error', 'warn'],
});

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

// Graceful shutdown
process.on('beforeExit', async () => {
  await prisma.$disconnect();
});

prisma.$connect()
  .then(() => {
    console.log("Prisma connected to database");
  })
  .catch((err) => {
    console.error("Prisma connection failed", err);
    process.exit(1);
  });

module.exports = prisma;
