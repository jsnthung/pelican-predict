export const sampleData = [
  { x: new Date("2023-01-01").getTime(), o: 100, h: 110, l: 90, c: 105 },
  { x: new Date("2023-01-02").getTime(), o: 105, h: 115, l: 95, c: 100 },
  { x: new Date("2023-01-03").getTime(), o: 100, h: 120, l: 85, c: 110 },
  { x: new Date("2023-01-04").getTime(), o: 110, h: 130, l: 105, c: 125 },
];

export const sampleData2 = [
  { x: new Date("2024-04-01").getTime(), o: 192, h: 210, l: 186, c: 196 },
  { x: new Date("2024-04-02").getTime(), o: 196, h: 204, l: 154, c: 165 },
  { x: new Date("2024-04-03").getTime(), o: 165, h: 200, l: 134, c: 199 },
  { x: new Date("2024-04-04").getTime(), o: 199, h: 216, l: 195, c: 205 },
];

export const generatedSampleData = [
  { x: new Date("2024-04-01").getTime(), o: 192, h: 210, l: 186, c: 196 },
  { x: new Date("2024-04-02").getTime(), o: 196, h: 204, l: 150, c: 165 },
  { x: new Date("2024-04-03").getTime(), o: 165, h: 200, l: 142, c: 199 },
  { x: new Date("2024-04-04").getTime(), o: 199, h: 216, l: 195, c: 205 },
  { x: new Date("2024-04-05").getTime(), o: 205, h: 206, l: 199, c: 202 },
  { x: new Date("2024-04-06").getTime(), o: 202, h: 210, l: 199, c: 199 },
  { x: new Date("2024-04-07").getTime(), o: 199, h: 214, l: 191, c: 196 },
  { x: new Date("2024-04-08").getTime(), o: 196, h: 213, l: 179, c: 191 },
  { x: new Date("2024-04-09").getTime(), o: 191, h: 211, l: 190, c: 206 },
  { x: new Date("2024-04-10").getTime(), o: 206, h: 211, l: 187, c: 196 },
  { x: new Date("2024-04-11").getTime(), o: 196, h: 197, l: 185, c: 197 },
  { x: new Date("2024-04-12").getTime(), o: 197, h: 206, l: 179, c: 185 },
  { x: new Date("2024-04-13").getTime(), o: 185, h: 194, l: 167, c: 194 },
  { x: new Date("2024-04-14").getTime(), o: 194, h: 213, l: 182, c: 195 },
  { x: new Date("2024-04-15").getTime(), o: 195, h: 204, l: 180, c: 204 },
  { x: new Date("2024-04-16").getTime(), o: 204, h: 216, l: 194, c: 201 },
  { x: new Date("2024-04-17").getTime(), o: 201, h: 212, l: 191, c: 200 },
  { x: new Date("2024-04-18").getTime(), o: 200, h: 218, l: 198, c: 204 },
  { x: new Date("2024-04-19").getTime(), o: 204, h: 205, l: 189, c: 199 },
  { x: new Date("2024-04-20").getTime(), o: 199, h: 219, l: 184, c: 195 },
  { x: new Date("2024-04-21").getTime(), o: 195, h: 212, l: 175, c: 177 },
  { x: new Date("2024-04-22").getTime(), o: 177, h: 187, l: 162, c: 164 },
  { x: new Date("2024-04-23").getTime(), o: 164, h: 170, l: 156, c: 156 },
  { x: new Date("2024-04-24").getTime(), o: 156, h: 159, l: 147, c: 150 },
  { x: new Date("2024-04-25").getTime(), o: 150, h: 154, l: 136, c: 154 },
  { x: new Date("2024-04-26").getTime(), o: 154, h: 172, l: 143, c: 152 },
  { x: new Date("2024-04-27").getTime(), o: 152, h: 157, l: 139, c: 147 },
  { x: new Date("2024-04-28").getTime(), o: 147, h: 153, l: 128, c: 148 },
  { x: new Date("2024-04-29").getTime(), o: 148, h: 158, l: 143, c: 143 },
  { x: new Date("2024-04-30").getTime(), o: 143, h: 153, l: 142, c: 147 },
];

export type StockDataPoint = {
  x: number;  // timestamp
  o: number;  // open
  h: number;  // high
  l: number;  // low
  c: number;  // close
};

/**
 * Generates sample stock data for a specified number of days ending today
 * 
 * @param days Number of days of data to generate
 * @param startPrice Starting price for the data (default: 200)
 * @param volatility Volatility factor affecting price movements (default: 3)
 * @param trendStrength Strength of random trend changes (default: 0.05)
 * @returns Array of stock data points
 */
export function generateStockData(
  days: number, 
  startPrice: number = 200, 
  volatility: number = 3,
  trendStrength: number = 0.05
): StockDataPoint[] {
  const result: StockDataPoint[] = [];
  let currentPrice = Math.max(1, startPrice);
  let trend = 0; // Neutral trend to start

  // Calculate the start date by subtracting days from today
  const endDate = new Date();
  // Skip weekends in the generated data
  const isWeekend = (date: Date) => date.getDay() === 0 || date.getDay() === 6;

  // Start from the end date and work backwards
  for (let i = 0; i < days;) {
    const currentDate = new Date(endDate);
    currentDate.setDate(endDate.getDate() - i);
    
    // Skip weekends
    if (isWeekend(currentDate)) {
      i++;
      continue;
    }

    // Update trend with some randomness
    trend = trend * 0.95 + (Math.random() - 0.5) * trendStrength;
    
    // Calculate daily movement based on trend and volatility
    const dailyChange = trend * currentPrice + (Math.random() - 0.5) * volatility;
    
    // Generate open price with some randomness from the current price
    let open = currentPrice + (Math.random() - 0.5) * (volatility / 2);
    // Ensure open price is positive
    open = Math.max(0.01, open);
    
    let close = open + dailyChange;
    // Ensure close price is positive
    close = Math.max(0.01, close);
    
    // Set the current price to close for the next iteration
    currentPrice = close;
    
    // Generate high and low with reasonable ranges
    const highOffset = Math.random() * volatility;
    const lowOffset = Math.random() * volatility;
    
    // Ensure high is the highest price
    const high = Math.max(open, close) + highOffset;
    
    // Ensure low is the lowest price but not below 0
    const lowBase = Math.min(open, close);
    const low = Math.max(0.01, lowBase - lowOffset);
    
    // Add the data point
    result.unshift({
      x: currentDate.getTime(),
      o: +open.toFixed(2),
      c: +close.toFixed(2),
      h: +high.toFixed(2),
      l: +low.toFixed(2)
    });
    
    i++;
  }
  
  return result;
}

/**
 * Generates prediction data for future days based on the last data point
 * 
 * @param lastDataPoint The last data point from historical data
 * @param days Number of days to predict (default: 7)
 * @param volatility Volatility factor for prediction (default: same as historical)
 * @returns Array of predicted stock data points
 */
export function generatePredictionData(
  lastDataPoint: StockDataPoint,
  days: number = 7,
  volatility: number = 3
): StockDataPoint[] {
  const result: StockDataPoint[] = [];
  let currentPrice = lastDataPoint.c; // Start from the last closing price
  
  // Calculate momentum based on the last data point
  const momentum = (lastDataPoint.c - lastDataPoint.o) / lastDataPoint.o;
  
  // Create tomorrow as the first prediction day (1 day after last data point)
  const tomorrow = new Date(lastDataPoint.x);
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0); // Normalize time to start of day
  
  // Skip weekends in the generated data
  const isWeekend = (date: Date) => date.getDay() === 0 || date.getDay() === 6;

  // Generate prediction data
  let tradingDaysGenerated = 0;
  let currentDate = new Date(tomorrow); 
  
  // Continue until we've generated the requested number of trading days
  while (tradingDaysGenerated < days) {
    // Skip weekends
    if (isWeekend(currentDate)) {
      // Move to next calendar day
      currentDate = new Date(currentDate);
      currentDate.setDate(currentDate.getDate() + 1);
      continue;
    }
    
    // Use momentum and randomness to generate next price
    const dailyChange = momentum * currentPrice + (Math.random() - 0.45) * volatility; // Slight upward bias
    
    // Generate open price with some randomness from the current price
    let open = currentPrice + (Math.random() - 0.5) * (volatility / 3);
    open = Math.max(0.01, open);
    
    let close = open + dailyChange;
    close = Math.max(0.01, close);
    
    // Set the current price to close for the next iteration
    currentPrice = close;
    
    // Generate high and low with reasonable ranges
    const highOffset = Math.random() * volatility;
    const lowOffset = Math.random() * volatility;
    
    const high = Math.max(open, close) + highOffset;
    
    const lowBase = Math.min(open, close);
    const low = Math.max(0.01, lowBase - lowOffset);
    
    // Add the data point with the current date
    result.push({
      x: new Date(currentDate).getTime(), // Create a new timestamp to avoid reference issues
      o: +open.toFixed(2),
      c: +close.toFixed(2),
      h: +high.toFixed(2),
      l: +low.toFixed(2)
    });
    
    tradingDaysGenerated++;
    
    // Move to next calendar day
    currentDate = new Date(currentDate);
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  return result;
}
