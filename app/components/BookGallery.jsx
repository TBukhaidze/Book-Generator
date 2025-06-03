export default function BookGallery({ books, onSelectBook }) {
  const CoverImage = ({ isbn, title, author }) => {
    const imageUrl = `https://picsum.photos/seed/${isbn}/128/192`;

    return (
      <div
        className="w-32 h-48 flex flex-col items-center justify-center mx-auto text-center p-4 relative"
        style={{
          backgroundImage: `url(${imageUrl})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          color: "#fff",
          textShadow: "0 1px 3px rgba(0,0,0,0.8)",
        }}
      >
        <div className="absolute inset-0 bg-black/30 z-0" />
        <p className="font-bold text-lg mb-2 relative z-10">{title}</p>
        <p className="text-sm relative z-10">{author}</p>
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-6">
      {books.map((book) => (
        <div
          key={book.isbn}
          className="border rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow cursor-pointer bg-white"
          onClick={() => onSelectBook(book)}
        >
          <CoverImage
            isbn={book.isbn}
            title={book.title}
            author={book.author}
          />
          <div className="p-4">
            <p className="font-semibold truncate">{book.title}</p>
            <p className="text-sm text-gray-600 truncate">{book.author}</p>
            <div className="mt-2 flex justify-between text-sm">
              <span>⭐ {book.likes}</span>
              <span>💬 {book.reviews?.length || 0}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
