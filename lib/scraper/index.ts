import axios from "axios";
import * as cheerio from "cheerio";
import { extractCyrency, extractPrice } from "../utils";
export async function scrapeAmazonProduct(url: string) {
  if (!url) return;

  // BrightData proxy config
  // curl --proxy brd.superproxy.io:22225 --proxy-user brd-customer-hl_7488187a-zone-pricewise:njrly8jh0ndc -k "http://geo.brdtest.com/mygeo.json
  const username = String(process.env.BRIGHT_DATA_USERNAME);
  const password = String(process.env.BRIGHT_DATA_PASSWORD);
  const port = 22225;
  const sessionId = (1000000 * Math.random()) | 0;
  const options = {
    auth: {
      username: `${username}-session-${sessionId}`,
      password,
    },
    host: "proxy brd.superproxy.io",
    port,
    rejectUnauthorized: false,
  };

  try {
    // Fetch the product page
    const response = await axios.get(url, options);
    const $ = cheerio.load(response.data);

    // Extract data with cheerio
    const title = $("#productTitle").text().trim();

    const currentPrice = extractPrice(
      $(".priceToPay span.a-price-whole"),
      $("#a.size.base.a-color-price"),
      $(".a-button-selected .a-color-base"),
      $(".a-price.a-text-price.a-size-medium .a-offscreen")
    );

    const originalPrice = extractPrice(
      $("#priceblock_ourprice"),
      $(".a-price.a-text-price .a-offscreen"),
      $("#listPrice"),
      $("#priceblock_dealprice"),
      $(".a-size-base.a-color-price")
    );

    const outOfStock =
      $("#availability span").text().trim().toLowerCase() ===
      "currently unavailable";

    const images =
      $("#imgBlkFront").attr("data-a-dynamic-image") ||
      $("#landingImage").attr("data-a-dynamic-image") ||
      "{}";

    const imageUrls = Object.keys(JSON.parse(images));

    const currency = extractCyrency($(".a-price-symbol"));

    const discountRate = $(".savingsPercentage").text().replace(/[-%]/g, "");
    
    console.log({
      title,
      currentPrice,
      originalPrice,
      outOfStock,
      imageUrls,
      currency,
      discountRate,
    });
  } catch (error: any) {
    throw new Error(`Faileed to scrape products: ${error.message}`);
  }
}
