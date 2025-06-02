export default function ExportButton({ onExport }) {
  return (
    <button
      onClick={onExport}
      className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded w-full sm:w-auto cursor-pointer"
    >
      Export to CSV
    </button>
  );
}
