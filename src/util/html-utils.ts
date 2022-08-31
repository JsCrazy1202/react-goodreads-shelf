import { Book } from "../types";

const bookMapper = (row: Element, index: number, thumbnailWidth: number): Book => {
  const isbn = row?.querySelector("td.field.isbn .value")?.textContent?.trim();
  const title = row?.querySelector("td.field.title a")?.getAttribute("title") ?? "";
  const author = row?.querySelector("td.field.author .value")?.textContent?.trim().replace(" *", "").split(", ").reverse().join(" ");
  const imageUrl = row
    ?.querySelector("td.field.cover img")
    ?.getAttribute("src")
    // Get a thumbnail of the requested width
    // Add some padding factor for higher-quality rendering
    ?.replace(/\._(S[Y|X]\d+_?){1,2}_/i, `._SX${thumbnailWidth * 1.5}_`);
  const href = row?.querySelector("td.field.cover a")?.getAttribute("href");
  const rating = row?.querySelectorAll("td.field.rating .staticStars .p10")?.length;

  return {
    id: `${isbn}_${index}`,
    isbn,
    title,
    author,
    imageUrl,
    rating,
    link: `https://www.goodreads.com/${href}`
  };
};

export const getBooksFromHtml = (html: string, limit = 10, width = 150): Book[] => {
  const parser = new DOMParser();
  const goodreadsDocument = parser.parseFromString(html, "text/html");
  const bookElements = goodreadsDocument.querySelectorAll("#booksBody .bookalike");
  const bookArray = Array.from(bookElements).slice(0, limit);
  // Get width if not a number
  if (typeof width !== "number") {
    width = 100;
  }
  return bookArray.map((el, i) => bookMapper(el, i, width));
};
