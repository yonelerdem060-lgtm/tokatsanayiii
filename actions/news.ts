"use server";

import { requireNewsEditor } from "@/lib/admin";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { deleteUploadedFile } from "@/lib/uploads";
import { failure, getErrorMessage, slugify, success } from "@/lib/utils";
import { newsPostSchema } from "@/lib/validations";

function formatNewsPost(post: {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string | null;
  isPublished: boolean;
  publishedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}) {
  return { ...post };
}

export async function getPublishedNews(limit?: number) {
  try {
    const posts = await prisma.newsPost.findMany({
      where: { isPublished: true },
      orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
      take: limit,
    });
    return success(posts.map(formatNewsPost));
  } catch (error) {
    return failure(getErrorMessage(error));
  }
}

export async function getNewsPosts() {
  try {
    await requireNewsEditor();
    const posts = await prisma.newsPost.findMany({
      orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
    });
    return success(posts.map(formatNewsPost));
  } catch (error) {
    return failure(getErrorMessage(error));
  }
}

export async function getNewsBySlug(slug: string) {
  try {
    const post = await prisma.newsPost.findUnique({ where: { slug } });
    if (!post || !post.isPublished) return failure("Haber bulunamadı.");
    return success(formatNewsPost(post));
  } catch (error) {
    return failure(getErrorMessage(error));
  }
}

export async function getNewsById(id: string) {
  try {
    await requireNewsEditor();
    const post = await prisma.newsPost.findUnique({ where: { id } });
    if (!post) return failure("Haber bulunamadı.");
    return success(formatNewsPost(post));
  } catch (error) {
    return failure(getErrorMessage(error));
  }
}

async function uniqueSlug(title: string, excludeId?: string) {
  let base = slugify(title);
  if (!base) base = "haber";
  let slug = base;
  let counter = 1;

  while (true) {
    const existing = await prisma.newsPost.findUnique({ where: { slug } });
    if (!existing || existing.id === excludeId) break;
    slug = `${base}-${counter++}`;
  }
  return slug;
}

export async function createNewsFromInput(input: unknown) {
  try {
    await requireNewsEditor();

    const data = newsPostSchema.parse(input);
    const slug = await uniqueSlug(data.title);

    const post = await prisma.newsPost.create({
      data: {
        title: data.title,
        slug,
        excerpt: data.excerpt,
        content: data.content,
        coverImage: data.coverImage,
        isPublished: data.isPublished,
        publishedAt: data.isPublished ? new Date() : null,
      },
    });

    revalidatePath("/");
    revalidatePath("/haberler");
    revalidatePath("/admin/news");
    revalidatePath("/baskan");
    revalidatePath("/baskan/haberler");

    return success(formatNewsPost(post));
  } catch (error) {
    return failure(getErrorMessage(error));
  }
}

export async function updateNewsFromInput(id: string, input: unknown) {
  try {
    await requireNewsEditor();

    const data = newsPostSchema.parse(input);
    const existing = await prisma.newsPost.findUnique({ where: { id } });
    if (!existing) return failure("Haber bulunamadı.");

    const slug =
      slugify(data.title) === slugify(existing.title)
        ? existing.slug
        : await uniqueSlug(data.title, id);

    const post = await prisma.newsPost.update({
      where: { id },
      data: {
        title: data.title,
        slug,
        excerpt: data.excerpt,
        content: data.content,
        coverImage: data.coverImage,
        isPublished: data.isPublished,
        publishedAt:
          data.isPublished && !existing.publishedAt ? new Date() : existing.publishedAt,
      },
    });

    if (existing.coverImage && existing.coverImage !== post.coverImage) {
      await deleteUploadedFile(existing.coverImage);
    }

    revalidatePath("/");
    revalidatePath("/haberler");
    revalidatePath(`/haberler/${post.slug}`);
    revalidatePath("/admin/news");
    revalidatePath(`/admin/news/${id}/edit`);
    revalidatePath("/baskan");
    revalidatePath("/baskan/haberler");
    revalidatePath(`/baskan/haberler/${id}/duzenle`);

    return success(formatNewsPost(post));
  } catch (error) {
    return failure(getErrorMessage(error));
  }
}

export async function deleteNews(id: string) {
  try {
    await requireNewsEditor();

    const existing = await prisma.newsPost.findUnique({ where: { id } });
    if (!existing) return failure("Haber bulunamadı.");

    await prisma.newsPost.delete({ where: { id } });
    await deleteUploadedFile(existing.coverImage);

    revalidatePath("/");
    revalidatePath("/haberler");
    revalidatePath("/admin/news");
    revalidatePath("/baskan");
    revalidatePath("/baskan/haberler");
    return success(undefined);
  } catch (error) {
    return failure(getErrorMessage(error));
  }
}
