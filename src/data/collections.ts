export interface Collection {
  id: string;
  name: string;
  slug: string;
  description: string;
  features: string[];
  tag: string;
}

export const collectionsData: Collection[] = [
  {
    id: "oversized",
    name: "Oversized Tees",
    slug: "oversized-tees",
    description: "Heavyweight drop-shoulder shirts with relaxed boxes, built to last and hang just right.",
    features: ["240+ GSM Cotton Blend", "Relaxed Fit Ribbed Collar", "Drop-Shoulder Silhouette"],
    tag: "SIGNATURE FIT"
  },
  {
    id: "boxy",
    name: "Boxy Fits",
    slug: "boxy-fits",
    description: "Wide and slightly cropped body layout. The ultimate streetwear proportion for layering.",
    features: ["Pre-shrunk Terry Cloth", "Boxy Silhouette", "Reinforced Hems"],
    tag: "TRENDING"
  },
  {
    id: "cropped",
    name: "Cropped Shirts",
    slug: "cropped-shirts",
    description: "Modern high-cut shirts that drop perfectly at the waistline. Tailored streetwear style.",
    features: ["Relaxed Shoulders", "Straight Waist Edge", "Premium Button Details"],
    tag: "STREETWEAR CORE"
  },
  {
    id: "graphic",
    name: "Graphic Tees",
    slug: "graphic-tees",
    description: "High-density digital and screen prints featuring cyber, retro, and subculture graphics.",
    features: ["High-Density Puff Prints", "Fade-Resistant Colors", "Bold Original Graphics"],
    tag: "LIMITED DROP"
  },
  {
    id: "casual",
    name: "Casual Fits",
    slug: "casual-fits",
    description: "Everyday trousers, cargos, and essentials matching our boxy top profiles.",
    features: ["Durable Canvas / Twill", "Elastic & Adjustable Hems", "Multi-pocket Utilities"],
    tag: "EVERYDAY"
  },
  {
    id: "drops",
    name: "New Drops",
    slug: "new-drops",
    description: "The latest limited releases fresh off our production line. Grab them before they're gone.",
    features: ["Numbered Items", "Exclusive Colorways", "First Come First Served"],
    tag: "HOT SELLING"
  }
];
