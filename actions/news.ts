"use server";

import { requireNewsEditor } from "@/lib/admin";
import { revalidatePath, revalidateTag, unstable_cache } from "next/cache";
import { CACHE_TAGS } from "@/lib/cache-tags";
import { toDate, toDateOrNull } from "@/lib/dates";
import { prisma } from "@/lib/db";
import { deleteUploadedFile } from "@/lib/uploads";
import { failure, getErrorMessage, slugify, success } from "@/lib/utils";
import { ensureNewsExcerpt, newsPostSchema } from "@/lib/validations";

function formatNewsPost(post: {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string | null;
  isPublished: boolean;
  publishedAt: Date | string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
}) {
  return {
    ...post,
    publishedAt: toDateOrNull(post.publishedAt),
    createdAt: toDate(post.createdAt),
    updatedAt: toDate(post.updatedAt),
  };
}

export async function getPublishedNews(limit?: number) {
  try {
    const take = limit ?? 50;
    const posts = await unstable_cache(
      async () =>
        prisma.newsPost.findMany({
          where: { isPublished: true },
          orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
          take,
        }),
      ["published-news-v1", String(take)],
      { revalidate: 120, tags: [CACHE_TAGS.news] },
    )();
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
    const excerpt = ensureNewsExcerpt(data.excerpt, data.content, data.title);

    const post = await prisma.newsPost.create({
      data: {
        title: data.title,
        slug,
        excerpt,
        content: data.content,
        coverImage: data.coverImage,
        isPublished: data.isPublished,
        publishedAt: data.isPublished ? new Date() : null,
      },
    });

    revalidatePath("/");
    revalidateTag(CACHE_TAGS.news);
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
    const excerpt = ensureNewsExcerpt(data.excerpt, data.content, data.title);

    const post = await prisma.newsPost.update({
      where: { id },
      data: {
        title: data.title,
        slug,
        excerpt,
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
    revalidateTag(CACHE_TAGS.news);
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
    revalidateTag(CACHE_TAGS.news);
    revalidatePath("/haberler");
    revalidatePath("/admin/news");
    revalidatePath("/baskan");
    revalidatePath("/baskan/haberler");
    return success(undefined);
  } catch (error) {
    return failure(getErrorMessage(error));
  }
}
