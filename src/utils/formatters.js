/**
 * Formats a review count to the nearest lower multiple of 5 with a plus sign.
 * Example: 53 -> "50+", 56 -> "55+", 126 -> "125+"
 * @param {number} count - The actual number of reviews
 * @returns {string} - The formatted string
 */
export const formatReviewCount = (count) => {
    if (!count) return "0";
    const rounded = Math.floor(count / 5) * 5;
    return `${rounded}+`;
};
