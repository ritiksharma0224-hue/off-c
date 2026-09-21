export interface DesignFamily {
  id: string;
  name: string;
  slug: string;
  subtitle: string;
  description: string;
  features: string[];
  tag: string;
  coverImage: string;
}

export const designFamilies: DesignFamily[] = [
  {
    id: "identity",
    name: "IDENTITY",
    slug: "identity",
    subtitle: "SUBCULTURE TYPOGRAPHY & VISUAL STATEMENTS",
    description: "Graphic-driven pieces built around subculture typography and unapologetic visual self-expression.",
    features: ["Subculture Typography", "Heavy Organic Cotton", "Drop Shoulder Drape"],
    tag: "GRAPHIC CORE",
    coverImage: "/images/cyber-tee.jpg"
  },
  {
    id: "chaos",
    name: "CHAOS",
    slug: "chaos",
    subtitle: "ACID WASHES, DISTRESSED TEXTURES & RAW FINISHES",
    description: "Distressed washes, raw textures, and graphic rebellion engineered into heavy combed cotton.",
    features: ["Acid Wash Finishing", "Terry Cloth Weave", "Distressed Artwork Edges"],
    tag: "EXPERIMENTAL",
    coverImage: "/images/vintage-wash.jpg"
  },
  {
    id: "minimal",
    name: "MINIMAL",
    slug: "minimal",
    subtitle: "FABRIC WEIGHT, CLEAN PROPORTIONS & ARCHITECTURAL CUTS",
    description: "Ultra-clean structured boxy fits focusing purely on fabric weight, drape, and proportion.",
    features: ["220 GSM Combed Cotton", "High Mock Neck Collar", "Clean Box Cut"],
    tag: "ESSENTIALS",
    coverImage: "/images/slate-boxy.jpg"
  },
  {
    id: "technical",
    name: "TECHNICAL",
    slug: "technical",
    subtitle: "FUNCTIONAL CUTS, POCKET HARDWARE & CROPPED SILHOUETTES",
    description: "Cropped utility button-downs and street cargo trousers engineered for real-world movement.",
    features: ["Cotton Twill & Ripstop", "Metal Snap Hardware", "Square Cropped Waist"],
    tag: "UTILITY",
    coverImage: "/images/cropped-shirt.jpg"
  },
  {
    id: "restricted",
    name: "RESTRICTED",
    slug: "restricted",
    subtitle: "CHROME PRINTS & STRICT LOW-QUANTITY BATCHES",
    description: "Ultra-limited graphic drops produced in strict low-quantity runs with collector certificate packaging.",
    features: ["Chrome Foil Artwork", "Numbered Release Items", "Heavyweight Luxury Cotton"],
    tag: "LIMITED DROP",
    coverImage: "/images/chrome-tee.jpg"
  },
  {
    id: "global",
    name: "GLOBAL",
    slug: "global",
    subtitle: "CONTEMPORARY UNISEX STREETWEAR ESSENTIALS",
    description: "Worldwide streetwear silhouettes tailored for the contemporary Gen-Z aesthetic.",
    features: ["Unisex Boxy Proportions", "Reinforced Taped Shoulders", "Pre-Shrunk Cotton"],
    tag: "CORE LINE",
    coverImage: "/images/hero.png"
  }
];

// Alias for backwards compatibility
export const collectionsData = designFamilies;
export type Collection = DesignFamily;
