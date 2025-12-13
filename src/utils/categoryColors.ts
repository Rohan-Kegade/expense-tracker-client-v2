// 🎨 Strong modern colors for default categories
const BASE_CATEGORY_COLORS: Record<string, string> = {
  "Food & Dining": "#FF6B6B", // Vibrant Red
  Transportation: "#4D96FF", // Strong Blue
  Shopping: "#FFA931", // Bright Orange
  Entertainment: "#9B5DE5", // Purple
  "Bills & Utilities": "#FEE440", // Yellow
  Healthcare: "#FF4F7B", // Pink-Red
  Education: "#2BCBBA", // Teal
  Travel: "#6A4C93", // Deep Violet
  Other: "#A0A0A0", // Neutral Gray
};

// 🎨 Fallback colors for new custom categories — bold but distinct
const EXTRA_COLORS = [
  "#00C49F", // strong teal-green
  "#0088FE", // vivid blue
  "#FFBB28", // gold
  "#FF8042", // orange-red
  "#845EC2", // deep purple
  "#4B4453", // charcoal gray
  "#D65DB1", // magenta
  "#2C73D2", // azure
];

const generatedColorMap: Record<string, string> = {};

export function getCategoryColor(category: string): string {
  if (BASE_CATEGORY_COLORS[category]) return BASE_CATEGORY_COLORS[category];
  if (generatedColorMap[category]) return generatedColorMap[category];

  const newColor =
    EXTRA_COLORS[Object.keys(generatedColorMap).length % EXTRA_COLORS.length];

  generatedColorMap[category] = newColor;
  return newColor;
}
