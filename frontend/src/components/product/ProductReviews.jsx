import React from 'react';
import Rating from '../common/Rating';

const ProductReviews = ({ product }) => {
  const averageRating = product.average_rating || 0;
  const reviewCount = product.review_count || 0;
  const reviews = product.reviews || [];

  // Parse rating breakdown if it's a string
  let ratingBreakdown = {};
  if (product.rating_breakdown) {
    ratingBreakdown = typeof product.rating_breakdown === 'string'
      ? JSON.parse(product.rating_breakdown)
      : product.rating_breakdown;
  } else {
    // Empty breakdown if no reviews
    ratingBreakdown = {
      5: 0,
      4: 0,
      3: 0,
      2: 0,
      1: 0
    };
  }

  return (
    <div className="mt-8 border-t pt-8">
      <h2 className="text-2xl font-bold mb-6">Customer Reviews</h2>

      {/* Rating Summary */}
      <div className="flex flex-col md:flex-row gap-8 mb-8 pb-8 border-b">
        {/* Overall Rating */}
        <div className="text-center md:text-left">
          <div className="text-5xl font-bold mb-2">{averageRating.toFixed(1)}</div>
          <Rating rating={averageRating} size="lg" />
          <p className="text-sm text-gray-600 mt-2">
            Based on {reviewCount} {reviewCount === 1 ? 'review' : 'reviews'}
          </p>
        </div>

        {/* Star Breakdown */}
        <div className="flex-1 space-y-2">
          {[5, 4, 3, 2, 1].map((stars) => {
            const percentage = ratingBreakdown[stars] || 0;
            return (
              <div key={stars} className="flex items-center gap-3">
                <span className="text-sm font-medium w-12">{stars} stars</span>
                <div className="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-yellow-400 transition-all duration-300"
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
                <span className="text-sm text-gray-600 w-12 text-right">{percentage}%</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Individual Reviews */}
      {reviews.length > 0 ? (
        <div className="space-y-6">
          {reviews.map((review) => (
            <div key={review.id} className="border-b pb-6 last:border-b-0">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-orange-500 text-white rounded-full flex items-center justify-center font-semibold">
                      {review.user_name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div>
                      <div className="font-semibold">{review.user_name || 'Anonymous'}</div>
                      <Rating rating={review.rating} size="sm" />
                    </div>
                  </div>
                </div>
                <span className="text-sm text-gray-500">
                  {new Date(review.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
              </div>

              {review.comment && (
                <p className="text-gray-700 leading-relaxed mb-3">{review.comment}</p>
              )}

              {review.images && review.images.length > 0 && (
                <div className="flex gap-2 flex-wrap">
                  {review.images.map((img, i) => (
                    <img
                      key={i}
                      src={img}
                      alt={`Review ${i + 1}`}
                      className="w-24 h-24 object-cover rounded border border-gray-200 hover:scale-105 transition-transform cursor-pointer"
                    />
                  ))}
                </div>
              )}

              {review.verified_purchase && (
                <div className="mt-3 flex items-center gap-1 text-sm text-green-600">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Verified Purchase
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">No reviews yet</h3>
          <p className="text-gray-500">Be the first to review this product</p>
        </div>
      )}
    </div>
  );
};

export default ProductReviews;
