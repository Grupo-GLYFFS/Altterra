import { forwardRef } from 'react';
import StarIcon from './StarIcon';
import ReviewCard from './ReviewCard';

const ProductReviews = forwardRef(function ProductReviews({ summary, reviews }, ref) {
  return (
    <div className="reviews-container" ref={ref}>
      <h2 className="title-2xl">Avaliações</h2>

      <div className="reviews-summary">
        <div className="review-rating">
          <p className="title-3xl">{summary.average}</p>

          <div className="rating-summary">
            <div className="stars">
              {Array.from({ length: 5 }).map((_, index) => (
                <StarIcon key={index} size={20} />
              ))}
            </div>

            <p className="text-xs">{summary.totalLabel}</p>
          </div>
        </div>

        <div className="rating-bars">
          {summary.bars.map((bar) => (
            <div className="rating-bar" key={bar.stars}>
              <span className="star-number">{bar.stars}</span>
              <StarIcon size={12} />
              <meter className="progress-bar" min="0" max={summary.max} value={bar.value}></meter>
            </div>
          ))}
        </div>
      </div>

      <ul className="reviews-list">
        {reviews.map((review, index) => (
          <li key={review.id}>
            {index > 0 && <hr className="horizontal-line" />}
            <ReviewCard review={review} />
          </li>
        ))}
      </ul>

      <button className="button-expand-reviews" type="button">Ver mais avaliações</button>
    </div>
  );
});

export default ProductReviews;
