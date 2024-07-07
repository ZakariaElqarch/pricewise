"use server";

import { scrapeAmazonProduct } from "../scraper";

export async function scrapeAndStoreProduct(productUrl: string) {
  if (!productUrl) return;

  const scrapedProduct = await scrapeAmazonProduct(productUrl);
  try {
  } catch (error: any) {
    throw new Error(`Failed to create/update product: ${error.message}`);
  }
}
