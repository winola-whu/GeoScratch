// src/components/GuidePopup.jsx
export default function GuidePopup({ guide, onClose }) {
  if (!guide) return null

  return (
    <div className="absolute top-16 right-10 w-80 p-4 bg-white rounded shadow-lg z-20 text-sm">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-bold">{guide.label}</h3>
        <button
          onClick={onClose}
          className="text-slate-500 hover:text-slate-700"
        >
          ✖
        </button>
      </div>
      <p>{guide.content}</p>
      {guide.link && (
        <a
          href={guide.link}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline text-sm"
        >
          Read more
        </a>
      )}
    </div>
  )
}
