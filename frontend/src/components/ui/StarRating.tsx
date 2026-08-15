interface StarRatingProps {
  value: number
  onChange: (value: number) => void
}

export function StarRating({ value, onChange }: StarRatingProps) {
  return (
    <div className="star-rating">
      {[1, 2, 3, 4, 5].map((estrella) => (
        <button
          key={estrella}
          type="button"
          className={`star ${estrella <= value ? 'star-active' : ''}`}
          onClick={() => onChange(estrella)}
          aria-label={`${estrella} estrella${estrella > 1 ? 's' : ''}`}
        >
          ★
        </button>
      ))}
    </div>
  )
}
