import { Dialog } from "@headlessui/react";

export default function BookModal({ book, onClose }) {
  if (!book) return null;

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
    <Dialog
      open={!!book}
      onClose={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      <div className="absolute inset-0 bg-black/30" aria-hidden="true" />
      <div className="bg-white p-4 sm:p-6 rounded-xl max-w-2xl w-full shadow-xl space-y-4 relative max-h-[90vh] overflow-y-auto">
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          onClick={onClose}
        >
          ✕
        </button>

        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-shrink-0">
            <CoverImage
              isbn={book.isbn}
              title={book.title}
              author={book.author}
            />
          </div>

          <div className="flex-grow">
            <h2 className="text-xl sm:text-2xl font-bold">{book.title}</h2>

            <div className="mt-4 space-y-2 text-sm sm:text-base">
              <p>
                <strong>Author:</strong> {book.author}
              </p>
              <p>
                <strong>Publisher:</strong> {book.publisher}
              </p>
              <p>
                <strong>ISBN:</strong> {book.isbn}
              </p>
              <p>
                <strong>Likes:</strong> {book.likes} ⭐
              </p>
              <p>
                <strong>Reviews:</strong> {book.reviews?.length || 0} 💬
              </p>
            </div>

            {book.reviews && book.reviews.length > 0 && (
              <div className="mt-6">
                <h3 className="text-base sm:text-lg font-semibold mb-3">
                  Customer Reviews:
                </h3>
                <div className="space-y-3">
                  {book.reviews.map((review, i) => (
                    <div key={i} className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center mb-2">
                        <div className="bg-gray-200 border-2 border-dashed rounded-xl w-8 h-8 mr-2" />
                        <span className="font-medium">{review.author}</span>
                      </div>
                      <p className="italic text-gray-700">"{review.content}"</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Dialog>
  );
}
