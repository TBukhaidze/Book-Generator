export default function BookTable({ books, onSelectBook }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border mt-6 min-w-[600px]">
        <thead>
          <tr className="bg-gray-200 text-left">
            <th className="p-2">#</th>
            <th className="p-2">ISBN</th>
            <th className="p-2">Title</th>
            <th className="p-2">Author</th>
            <th className="p-2">Publisher</th>
          </tr>
        </thead>
        <tbody>
          {books.map((book) => (
            <tr
              key={book.isbn}
              className="border-t hover:bg-gray-50 cursor-pointer"
              onClick={() => onSelectBook(book)}
            >
              <td className="p-2">{book.localIndex}</td>
              <td className="p-2">{book.isbn}</td>
              <td className="p-2">{book.title}</td>
              <td className="p-2">{book.author}</td>
              <td className="p-2">{book.publisher}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
