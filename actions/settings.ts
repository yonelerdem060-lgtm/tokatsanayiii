"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin";
import { prisma } from "@/lib/db";
import { getResolvedSiteConfig } from "@/lib/site-settings";
import { failure, getErrorMessage, success } from "@/lib/utils";
import { siteSettingsSchema } from "@/lib/validations";

export async function getSiteSettings() {
  try {
    await requireAdmin();
    const config = await getResolvedSiteConfig();
    return success({
      name: config.name,
      shortName: config.shortName,
      phone: config.phone,
      email: config.email,
      address: config.address,
      adEmail: config.adEmail,
      weekdayHours: config.workingHours.weekday,
      saturdayHours: config.workingHours.saturday,
      sundayHours: config.workingHours.sunday,
      about: config.about,
      aboutParagraphs: config.aboutPage.paragraphs,
      aboutStats: config.aboutPage.stats,
    });
  } catch (error) {
    return failure(getErrorMessage(error));
  }
}

export async function updateSiteSettings(input: unknown) {
  try {
    await requireAdmin();
    const data = siteSettingsSchema.parse(input);

    await prisma.siteSettings.upsert({
      where: { id: "default" },
      create: {
        id: "default",
        name: data.name,
        shortName: data.shortName,
        phone: data.phone,
        email: data.email,
        address: data.address,
        adEmail: data.adEmail,
        weekdayHours: data.weekdayHours,
        saturdayHours: data.saturdayHours,
        sundayHours: data.sundayHours,
        about: data.about,
        aboutParagraphs: JSON.stringify(data.aboutParagraphs),
        aboutStats: JSON.stringify(data.aboutStats),
      },
      update: {
        name: data.name,
        shortName: data.shortName,
        phone: data.phone,
        email: data.email,
        address: data.address,
        adEmail: data.adEmail,
        weekdayHours: data.weekdayHours,
        saturdayHours: data.saturdayHours,
        sundayHours: data.sundayHours,
        about: data.about,
        aboutParagraphs: JSON.stringify(data.aboutParagraphs),
        aboutStats: JSON.stringify(data.aboutStats),
      },
    });

    revalidatePath("/");
    revalidatePath("/hakkimizda");
    revalidatePath("/iletisim");
    revalidatePath("/admin/settings");

    return success(undefined);
  } catch (error) {
    return failure(getErrorMessage(error));
  }
}
