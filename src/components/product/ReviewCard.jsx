import StarIcon from './StarIcon';

function ReviewCard({ review }) {
  return (
    <article className="review-card">
      <div className="reviewer-header">
        <img className="reviewer-image" src={review.image} alt={review.reviewer} />

        <div className="reviewer-info">
          <div className="review-header">
            <p className="text-semibold">{review.reviewer}</p>

            <div className="stars">
              {Array.from({ length: review.stars }).map((_, index) => (
                <StarIcon key={index} size={16} />
              ))}
            </div>
          </div>

          <time className="text-xs text-muted" dateTime={review.date}>{review.dateLabel}</time>
        </div>
      </div>

      <p className="text-paragraph">{review.text}</p>
    </article>
  );
}

export default ReviewCard;
