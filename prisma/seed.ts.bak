import { PrismaClient } from "@prisma/client";
import { posts, projects, teamMembers, testimonials } from "../lib/data";

const prisma = new PrismaClient();

async function main() {
  await prisma.project.deleteMany();
  await prisma.post.deleteMany();
  await prisma.teamMember.deleteMany();
  await prisma.testimonial.deleteMany();

  await prisma.project.createMany({
    data: projects
  });

  await prisma.post.createMany({
    data: posts.map((post) => ({
      ...post,
      publishedAt: new Date(post.publishedAt)
    }))
  });

  await prisma.teamMember.createMany({
    data: teamMembers
  });

  await prisma.testimonial.createMany({
    data: testimonials
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
