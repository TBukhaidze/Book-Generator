export default function BookFilters({
  region,
  setRegion,
  seed,
  setSeed,
  likes,
  setLikes,
  reviews,
  setReviews,
  regions,
  getRandomSeed,
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <label className="flex flex-col">
        Region:
        <select
          className="border p-2 rounded"
          value={region}
          onChange={(e) => setRegion(e.target.value)}
        >
          {regions.map((r) => (
            <option key={r.value} value={r.value}>
              {r.label}
            </option>
          ))}
        </select>
      </label>

      <label className="flex flex-col">
        Seed:
        <div className="flex gap-2">
          <input
            className="border p-2 rounded w-full"
            value={seed}
            onChange={(e) => setSeed(e.target.value.replace(/\D/g, ""))}
            type="number"
          />
          <button
            className="bg-blue-500 text-white px-3 py-2 rounded cursor-pointer"
            onClick={() => setSeed(getRandomSeed())}
          >
            🎲
          </button>
        </div>
      </label>

      <label className="flex flex-col">
        <span>Avg Likes: {likes.toFixed(1)}</span>
        <input
          type="range"
          min={0}
          max={10}
          step={0.1}
          value={likes}
          onChange={(e) => setLikes(parseFloat(e.target.value))}
          className="h-full"
        />
      </label>

      <label className="flex flex-col">
        Avg Reviews:
        <input
          type="number"
          step={0.1}
          min={0}
          value={reviews}
          onChange={(e) => {
            const value = parseFloat(e.target.value);
            if (!isNaN(value) && value >= 0) setReviews(value);
          }}
          className="border p-2 rounded"
        />
      </label>
    </div>
  );
}
