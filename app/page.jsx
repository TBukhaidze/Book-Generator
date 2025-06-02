"use client";

import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useInView } from "react-intersection-observer";
import Papa from "papaparse";
import BookFilters from "./components/BookFilters";
import BookViewSwitcher from "./components/BookViewSwitcher";
import BookTable from "./components/BookTable";
import BookGallery from "./components/BookGallery";
import BookModal from "./components/BookModal";
import ExportButton from "./components/ExportButton";

const REGIONS = [
  { label: "English (USA)", value: "en-US" },
  { label: "Deutsch (Germany)", value: "de-DE" },
  { label: "日本語 (Japan)", value: "ja-JP" },
];

function getRandomSeed() {
  return Math.floor(10000000 + Math.random() * 90000000).toString();
}

function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export default function BooksPage() {
  const [region, setRegion] = useState("en-US");
  const [seed, setSeed] = useState("");
  const [likes, setLikes] = useState(3.7);
  const [reviews, setReviews] = useState(1.5);
  const [books, setBooks] = useState([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const { ref, inView } = useInView();
  const [selectedBook, setSelectedBook] = useState(null);
  const [viewMode, setViewMode] = useState("table");
  const [isLoading, setIsLoading] = useState(false);

  const [tempLikes, setTempLikes] = useState(likes);
  const [tempReviews, setTempReviews] = useState(reviews);

  const debouncedLikes = useDebounce(tempLikes, 500);
  const debouncedReviews = useDebounce(tempReviews, 500);

  useEffect(() => {
    setLikes(debouncedLikes);
  }, [debouncedLikes]);

  useEffect(() => {
    setReviews(debouncedReviews);
  }, [debouncedReviews]);

  const fetchBooks = useCallback(
    async (pageNum, reset = false) => {
      setIsLoading(true);
      try {
        const count = pageNum === 0 ? 20 : 10;
        const { data } = await axios.get("/api/books", {
          params: {
            region,
            seed,
            page: pageNum,
            likes: debouncedLikes,
            reviews: debouncedReviews,
          },
        });

        if (data.length === 0 || data.length < count) {
          setHasMore(false);
        }

        setBooks((prev) => (reset ? data : [...prev, ...data]));
        setPage(pageNum);
      } catch (err) {
        console.error("Failed to load books", err);
        setHasMore(false);
      } finally {
        setIsLoading(false);
      }
    },
    [region, seed, debouncedLikes, debouncedReviews]
  );

  useEffect(() => {
    setPage(0);
    setBooks([]);
    setHasMore(true);
    fetchBooks(0, true);
  }, [region, seed, debouncedLikes, debouncedReviews]);

  useEffect(() => {
    if (inView && hasMore && !isLoading) {
      fetchBooks(page + 1);
    }
  }, [inView, hasMore, page, isLoading]);

  const exportToCSV = () => {
    const data = books.map((book) => ({
      Index: book.index,
      ISBN: book.isbn,
      Title: book.title,
      Author: book.author,
      Publisher: book.publisher,
      Likes: book.likes,
      ReviewCount: book.reviews?.length || 0,
      Reviews: book.reviews
        ? book.reviews.map((r) => `${r.author}: ${r.content}`).join("; ")
        : "",
    }));

    const csv = Papa.unparse(data);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `books_${region}_${seed}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold">📚 Book Generator</h1>
        <ExportButton onExport={exportToCSV} />
      </div>

      <BookFilters
        region={region}
        setRegion={setRegion}
        seed={seed}
        setSeed={setSeed}
        likes={tempLikes}
        setLikes={setTempLikes}
        reviews={tempReviews}
        setReviews={setTempReviews}
        regions={REGIONS}
        getRandomSeed={getRandomSeed}
        isLoading={isLoading}
      />

      <BookViewSwitcher viewMode={viewMode} setViewMode={setViewMode} />

      {viewMode === "table" ? (
        <BookTable books={books} onSelectBook={setSelectedBook} />
      ) : (
        <BookGallery books={books} onSelectBook={setSelectedBook} />
      )}

      {hasMore && (
        <div ref={ref} className="text-center mt-4 text-gray-500">
          {isLoading ? "Loading more books..." : "Scroll to load more"}
        </div>
      )}

      <BookModal book={selectedBook} onClose={() => setSelectedBook(null)} />
    </div>
  );
}
