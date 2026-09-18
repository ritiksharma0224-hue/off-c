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
    id: "drop-001",
    name: "DROP 001",
    slug: "drop-001",
    description: "The inaugural release of KAPDOLOGY®. Identity, attitude, and culture in garment form.",
    features: ["220-240 GSM Heavy Cotton", "Graphic-Driven DTF Prints", "Structured Oversized Cut"],
    tag: "PRIMARY DROP"
  },
  {
    id: "restricted",
    name: "RESTRICTED",
    slug: "restricted",
    description: "Ultra-limited graphic drops produced in strict low-quantity runs.",
    features: ["Chrome Foil Artwork", "Numbered Release Items", "Exclusive Collectors Packaging"],
    tag: "LIMITED RELEASE"
  },
  {
    id: "identity",
    name: "IDENTITY",
    slug: "identity",
    description: "Statement graphic tees built around subculture typography and visual self-expression.",
    features: ["Subculture Typography", "Heavy Organic Canvas", "Drop Shoulder Drape"],
    tag: "GRAPHIC HEAVY"
  },
  {
    id: "global",
    name: "GLOBAL",
    slug: "global",
    description: "Worldwide streetwear silhouettes tailored for the contemporary Gen-Z aesthetic.",
    features: ["Unisex Boxy Proportions", "Reinforced Taped Shoulders", "Pre-Shrunk Cotton"],
    tag: "CORE LINE"
  },
  {
    id: "chaos",
    name: "CHAOS",
    slug: "chaos",
    description: "Distressed washes, raw textures, and graphic rebellion.",
    features: ["Acid Wash Finishing", "Terry Cloth Weave", "Distressed Artwork Edges"],
    tag: "EXPERIMENTAL"
  },
  {
    id: "minimal",
    name: "MINIMAL",
    slug: "minimal",
    description: "Ultra-clean structured boxy fits focusing purely on fabric weight, drape, and proportion.",
    features: ["220 GSM Combed Cotton", "High Mock Neck Collar", "Clean Box Cut"],
    tag: "ESSENTIALS"
  },
  {
    id: "technical",
    name: "TECHNICAL",
    slug: "technical",
    description: "Cropped button-downs, utility pockets, and functional streetwear cuts.",
    features: ["Cotton Twill Weave", "Metal Snap Hardware", "Square Cropped Waist"],
    tag: "UTILITY & CUTS"
  }
];
