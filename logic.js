const SUPPORT_LEVELS = [0.9, 0.8, 0.7];
const RESISTANCE_LEVELS = [1.1, 1.2, 1.3];

function calculateLevels(prices) {
  const currentPrice = prices[prices.length - 1];
  const supportLevels = SUPPORT_LEVELS.map(level => level * currentPrice);
  const resistanceLevels = RESISTANCE_LEVELS.map(level => level * currentPrice);
  return { supportLevels, resistanceLevels };
}

function calculateTrend(prices) {
  const currentPrice = prices[prices.length - 1];
  const previousPrice = prices[prices.length - 2];
  if (currentPrice > previousPrice) {
    return 'восходящий';
  } else if (currentPrice < previousPrice) {
    return 'нисходящий';
  } else {
    return 'боковой';
  }
}

function calculateActivity(prices) {
  const currentPrice = prices[prices.length - 1];
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const activity = ((currentPrice - minPrice) / (maxPrice - minPrice)) * 100;
  return activity.toFixed(2);
}

module.exports = {
  calculateLevels,
  calculateTrend,
  calculateActivity,
};
