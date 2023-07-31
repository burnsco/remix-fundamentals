import { prisma } from "~/db.server";

export async function getPosts() {
  return prisma.posts.findAll();
}
