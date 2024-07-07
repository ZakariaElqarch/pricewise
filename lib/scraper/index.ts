import axios from "axios";
import * as cheerio from "cheerio";
import { extractPrice } from "../utils";
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
      $('.a-price.a-text-price.a-size-medium .a-offscreen')
    );
    console.log('==========>',title,"=",currentPrice)
  } catch (error: any) {
    throw new Error(`Faileed to scrape products: ${error.message}`);
  }
}
