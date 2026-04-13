import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.post.upsert({
    where: { slug: "hello-world" },
    update: {
      title: "Hello, World",
      content: "# Welcome to ZeroClaw Blog\n\nThis is your first seeded post.",
      published: true,
    },
    create: {
      title: "Hello, World",
      slug: "hello-world",
      content: "# Welcome to ZeroClaw Blog\n\nThis is your first seeded post.",
      published: true,
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error: unknown) => {
    console.error("Seeding failed:", error);
    await prisma.$disconnect();
    process.exit(1);
  });
