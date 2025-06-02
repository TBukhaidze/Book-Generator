export default function BookViewSwitcher({ viewMode, setViewMode }) {
  return (
    <div className="flex flex-wrap justify-end mb-4 gap-2">
      <div className="inline-flex rounded-md shadow-sm" role="group">
        <button
          onClick={() => setViewMode("table")}
          className={`px-4 py-2 text-sm font-medium rounded-l-lg cursor-pointer ${
            viewMode === "table"
              ? "bg-blue-500 text-white"
              : "bg-white text-gray-700 hover:bg-gray-100"
          }`}
        >
          Table View
        </button>
        <button
          onClick={() => setViewMode("gallery")}
          className={`px-4 py-2 text-sm font-medium rounded-r-md cursor-pointer ${
            viewMode === "gallery"
              ? "bg-blue-500 text-white"
              : "bg-white text-gray-700 hover:bg-gray-100"
          }`}
        >
          Gallery View
        </button>
      </div>
    </div>
  );
}
