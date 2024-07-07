"use client";
import { scrapeAndStoreProduct } from "@/lib/actions";
import React, { FormEvent, useState } from "react";

const Searchbar = () => {
  const [searchPromt, setSearchPromt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const isValidAmazonProductUrl = (url: string) => {
    try {
      const parsedUrl = new URL(url);
      const hostName = parsedUrl.hostname;

      // Check is the link have amazon.*
      if (
        hostName.includes("amazon.com") ||
        hostName.includes("amazon.") ||
        hostName.endsWith("amazon")
      ) {
        return true;
      }
    } catch (error) {
      return false;
    }
    return false;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const isValidLink = isValidAmazonProductUrl(searchPromt);

    if (!isValidLink) {
      return alert("Please provide a valid Amazon link");
    }

    try {
      setIsLoading(true);
      // Scrape the product
      const product =  await scrapeAndStoreProduct(searchPromt);
    } catch (error) {
      console.log('Error loading data from link: ',error)
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      action=""
      className="flex flex-wrap gap-4 mt-12"
      onSubmit={handleSubmit}
    >
      <input
        type="text"
        value={searchPromt}
        onChange={(e) => setSearchPromt(e.target.value)}
        className="searchbar-input"
        placeholder="Enter product link"
      />
      <button
        type="submit"
        className="searchbar-btn"
        disabled={searchPromt === ""}
      >
        {isLoading ? "Searching..." : "Search"}
      </button>
    </form>
  );
};

export default Searchbar;
