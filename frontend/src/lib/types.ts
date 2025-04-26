export interface CandlestickDataPoint {
  x: number; // timestamp (milliseconds)
  o: number; // open
  h: number; // high
  l: number; // low
  c: number; // close
  color?: {
    up?: string;
    down?: string;
    unchanged?: string;
  };
}
