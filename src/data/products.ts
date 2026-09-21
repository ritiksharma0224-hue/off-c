export interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  compareAtPrice?: number;
  category: string;
  categorySlug: string;
  designFamily: string;
  collection: string; // Alias for designFamily
  drop: string;
  fit: string;
  description: string;
  details: string[];
  fabric: string;
  gsm: string;
  printMethod: string;
  care: string;
  image: string;
  images: string[];
  sizes: string[];
  colors: string[];
  badge?: string;
  isNew?: boolean;
  isPopular?: boolean;
  featured?: boolean;
}

export const productsData: Product[] = [
  {
    id: "kpd-01",
    name: "Signature Oversized Box Tee",
    slug: "signature-oversized-box-tee",
    price: 599,
    compareAtPrice: 899,
    category: "OVERSIZED T-SHIRTS",
    categorySlug: "oversized-tees",
    designFamily: "GLOBAL",
    collection: "GLOBAL",
    drop: "DROP 001",
    fit: "Signature Oversized Box Cut",
    description: "The core anchor of Kapdology Drop 001. Built with 240 GSM organic combed cotton, featuring a structured drop-shoulder drape and reinforced collar.",
    details: [
      "240 GSM 100% Combed Heavyweight Cotton",
      "Signature Drop-Shoulder Box Cut",
      "1.2-inch Thick High-Rib Neckband",
      "Pre-Shrunk & Colorfast Wash Finished",
      "Tailored In Jaipur, India"
    ],
    fabric: "100% Combed Cotton",
    gsm: "240 GSM",
    printMethod: "Direct-to-Fabric Minimal Stencil",
    care: "Machine wash cold inside-out. Do not iron directly on graphics. Hang dry in shade.",
    image: "/images/hero.png",
    images: ["/images/hero.png", "/images/slate-boxy.jpg"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Off-White / Cream", "Phantom Black"],
    badge: "DROP 001",
    isNew: true,
    isPopular: true,
    featured: true
  },
  {
    id: "kpd-02",
    name: "Vintage Distressed Acid Wash Tee",
    slug: "vintage-distressed-acid-wash-tee",
    price: 1399,
    compareAtPrice: 1699,
    category: "OVERSIZED T-SHIRTS",
    categorySlug: "oversized-tees",
    designFamily: "CHAOS",
    collection: "CHAOS",
    drop: "DROP 001",
    fit: "Oversized Drop Shoulder",
    description: "Custom acid wash process creating an authentic worn-in texture on heavy terry cotton. Each garment is individually treated for a distinct vintage patina.",
    details: [
      "240 GSM Heavy Terry Cloth Cotton",
      "Hand-Curated Acid Mineral Wash Finish",
      "Raw Distress Edge Detailing on Ribbing",
      "Reinforced Double-Stitch Shoulder Taping",
      "Subtle Hand-Washed Handfeel"
    ],
    fabric: "100% Heavy Terry Cotton",
    gsm: "240 GSM",
    printMethod: "Mineral Washed Vintage Discharge",
    care: "Wash cold separately with mild detergent. Do not bleach. Tumble dry low or line dry.",
    image: "/images/vintage-wash.jpg",
    images: ["/images/vintage-wash.jpg", "/images/hero.png"],
    sizes: ["S", "M", "L", "XL"],
    colors: ["Mineral Washed Grey", "Acid Slate"],
    badge: "LIMITED",
    isNew: true,
    featured: true
  },
  {
    id: "kpd-03",
    name: "Minimalist Slate Boxy Tee",
    slug: "minimalist-slate-boxy-tee",
    price: 1199,
    compareAtPrice: 1499,
    category: "BOXY / RELAXED TEES",
    categorySlug: "boxy-tees",
    designFamily: "MINIMAL",
    collection: "MINIMAL",
    drop: "DROP 001",
    fit: "Structured Boxy Fit",
    description: "Architectural minimalism in garment form. Shorter body length with an expanded chest width creates the definitive modern streetwear proportion.",
    details: [
      "220 GSM High-Twist Combed Cotton",
      "High Mock Rib Collar (1.4-inch height)",
      "Square Body Drape with Clean Blind Hems",
      "Minimalist Kapdology Monogram at Hem",
      "Zero Fabric Cling"
    ],
    fabric: "100% High-Twist Combed Cotton",
    gsm: "220 GSM",
    printMethod: "Clean Monochrome Screenprint",
    care: "Machine wash cold with similar shades. Cool iron on reverse. Lay flat to dry.",
    image: "/images/slate-boxy.jpg",
    images: ["/images/slate-boxy.jpg", "/images/retro-boxy.jpg"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Slate Charcoal", "Raw Chalk"],
    badge: "ESSENTIAL",
    isPopular: true,
    featured: true
  },
  {
    id: "kpd-04",
    name: "Retro-Future Graphic Boxy Tee",
    slug: "retro-future-graphic-boxy-tee",
    price: 1299,
    category: "BOXY / RELAXED TEES",
    categorySlug: "boxy-tees",
    designFamily: "CHAOS",
    collection: "CHAOS",
    drop: "DROP 001",
    fit: "Boxy Relaxed Cut",
    description: "Stark monochrome graphic profile on dense combed cotton. Bold typographic tension inspired by futuristic street typography and subcultural zines.",
    details: [
      "220 GSM Combed Cotton Canvas",
      "High-Density Plastisol Typography Artwork",
      "Seamless Sleeve Openings for Broad Fit",
      "Pre-Shrunk to Preserve Proportions",
      "Signature Jaipur Production Batch Tag"
    ],
    fabric: "100% Combed Cotton",
    gsm: "220 GSM",
    printMethod: "High-Density Screenprint",
    care: "Machine wash cold inside-out. Do not iron directly on print. Line dry.",
    image: "/images/retro-boxy.jpg",
    images: ["/images/retro-boxy.jpg", "/images/slate-boxy.jpg"],
    sizes: ["S", "M", "L", "XL"],
    colors: ["Pitch Black", "Steel Grey"],
    isPopular: true
  },
  {
    id: "kpd-05",
    name: "Cyber Culture Oversized Graphic Tee",
    slug: "cyber-culture-oversized-graphic-tee",
    price: 1299,
    compareAtPrice: 1599,
    category: "GRAPHIC TEES",
    categorySlug: "graphic-tees",
    designFamily: "IDENTITY",
    collection: "IDENTITY",
    drop: "DROP 001",
    fit: "Oversized Drop Shoulder",
    description: "The visual embodiment of 'Not Just Clothes. It's a Mood.' High-definition graphic-driven DTF printing capturing intricate cyber and digital subculture motifs.",
    details: [
      "240 GSM Luxury Organic Cotton",
      "High-Resolution Multi-Pass DTF Graphics",
      "Full Back Graphic Artwork + Front Chest Tag",
      "Drop Shoulder Tailoring with Ribbed Neckline",
      "Fade-Resistant Print Chemistry"
    ],
    fabric: "100% Organic Heavy Cotton",
    gsm: "240 GSM",
    printMethod: "High-Density Multi-Layer DTF",
    care: "Gentle wash cold inside-out. Iron on reverse only. Hang dry in shade.",
    image: "/images/cyber-tee.jpg",
    images: ["/images/cyber-tee.jpg", "/images/puff-tee.jpg"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Core Black", "Acid Washed Black"],
    badge: "BEST SELLER",
    isPopular: true,
    featured: true
  },
  {
    id: "kpd-06",
    name: "Subculture Puff Graphic Tee",
    slug: "subculture-puff-graphic-tee",
    price: 1299,
    category: "GRAPHIC TEES",
    categorySlug: "graphic-tees",
    designFamily: "IDENTITY",
    collection: "IDENTITY",
    drop: "DROP 001",
    fit: "Oversized Fit",
    description: "Tactile graphic experience featuring 3D puff print lettering that rises off the garment. Bold street attitude tailored for everyday rotation.",
    details: [
      "220 GSM Breathable Summer Heavyweight Cotton",
      "3D Tactile Puff Print Typography",
      "Side Seam Reinforced Stitching",
      "Crewneck Collar with Elastic Recovery",
      "Custom Woven Neck Ribbon"
    ],
    fabric: "100% Cotton Single Jersey",
    gsm: "220 GSM",
    printMethod: "Dimensional 3D Puff Screenprint",
    care: "Machine wash cold inside-out on gentle cycle. Do not iron puff elements.",
    image: "/images/puff-tee.jpg",
    images: ["/images/puff-tee.jpg", "/images/cyber-tee.jpg"],
    sizes: ["S", "M", "L", "XL"],
    colors: ["Washed Phantom", "Bone White"],
    isNew: true
  },
  {
    id: "kpd-07",
    name: "Liquid Chrome Limited Graphic Tee",
    slug: "liquid-chrome-limited-graphic-tee",
    price: 1499,
    compareAtPrice: 1799,
    category: "GRAPHIC TEES",
    categorySlug: "graphic-tees",
    designFamily: "RESTRICTED",
    collection: "RESTRICTED",
    drop: "DROP 001",
    fit: "Signature Oversized Silhouette",
    description: "Limited collector edition featuring liquid chrome foil typography that reflects light with metallic clarity. Delivered with numbered packaging.",
    details: [
      "240 GSM Luxury Dense Cotton Jersey",
      "Mirror-Finish Liquid Chrome Foil Imprint",
      "Numbered Batch Certificate Included",
      "Drop-Shoulder Box Silhouette",
      "Limited Drop Edition"
    ],
    fabric: "100% Luxury Heavy Cotton",
    gsm: "240 GSM",
    printMethod: "Hot-Stamp Mirror Chrome Foil",
    care: "Hand wash cold inside-out. Do not wring or twist foil. Lay flat to dry.",
    image: "/images/chrome-tee.jpg",
    images: ["/images/chrome-tee.jpg", "/images/cyber-tee.jpg"],
    sizes: ["S", "M", "L", "XL"],
    colors: ["Deep Carbon", "Pure Slate"],
    badge: "RESTRICTED",
    isNew: true,
    featured: true
  },
  {
    id: "kpd-08",
    name: "Urban Utility Cropped Shirt",
    slug: "urban-utility-cropped-shirt",
    price: 1499,
    compareAtPrice: 1899,
    category: "SHIRTS",
    categorySlug: "shirts",
    designFamily: "TECHNICAL",
    collection: "TECHNICAL",
    drop: "DROP 001",
    fit: "Relaxed Cropped Hem",
    description: "Street-forward cropped utility button-down featuring dual cargo chest pockets, structured square hemline, and matte black industrial snap buttons.",
    details: [
      "200 GSM Durable Cotton Twill Weave",
      "Industrial Matte Snap Fasteners",
      "Dual Gusseted Utility Pockets with Flaps",
      "Square-Cut Cropped Waistline",
      "Relaxed Box Shoulders for Layering"
    ],
    fabric: "100% Cotton Twill",
    gsm: "200 GSM",
    printMethod: "Technical Utility Construction",
    care: "Machine wash cold with like colors. Hang dry. Warm iron if needed.",
    image: "/images/cropped-shirt.jpg",
    images: ["/images/cropped-shirt.jpg", "/images/hero.png"],
    sizes: ["S", "M", "L", "XL"],
    colors: ["Tactical Stone", "Raw Olive"],
    badge: "UTILITY",
    isNew: true,
    featured: true
  },
  {
    id: "kpd-09",
    name: "Modular Street Cargo Pants",
    slug: "modular-street-cargo-pants",
    price: 1699,
    compareAtPrice: 2099,
    category: "BOTTOMS",
    categorySlug: "bottoms",
    designFamily: "TECHNICAL",
    collection: "TECHNICAL",
    drop: "DROP 001",
    fit: "Relaxed Straight-Leg with Ankle Adjuster",
    description: "Engineered to balance our oversized tops. Built from durable cotton ripstop with 6 deep utility pockets and concealed ankle bungees to toggle between straight-leg and tapered fits.",
    details: [
      "280 GSM Cotton Ripstop Weave",
      "6-Pocket Modular Utility Layout",
      "Concealed Elastic Ankle Cinch Bungees",
      "Articulated Knee Pleats for Mobility",
      "Reinforced Seat & Inseam Stitching"
    ],
    fabric: "100% Cotton Ripstop",
    gsm: "280 GSM",
    printMethod: "Technical Garment Construction",
    care: "Machine wash cold. Do not bleach. Tumble dry low or line dry.",
    image: "/images/cargos.jpg",
    images: ["/images/cargos.jpg", "/images/cropped-shirt.jpg"],
    sizes: ["28", "30", "32", "34", "36"],
    colors: ["Utility Washed Black", "Combat Olive"],
    badge: "CORE",
    isPopular: true
  },
  {
    id: "kpd-10",
    name: "Raw French Terry Boxy Hoodie",
    slug: "raw-french-terry-boxy-hoodie",
    price: 1899,
    compareAtPrice: 2399,
    category: "HOODIES / SWEATSHIRTS",
    categorySlug: "hoodies",
    designFamily: "CHAOS",
    collection: "CHAOS",
    drop: "DROP 001",
    fit: "Boxy Heavyweight Drop-Shoulder",
    description: "420 GSM unbrushed loopback French terry fleece. A structured, heavy silhouette with a double-layered hood without drawstrings for a clean architectural aesthetic.",
    details: [
      "420 GSM 100% Loopback French Terry Cotton",
      "Seamless Double-Layer Ergonomic Hood",
      "Hidden Kangaroo Pocket with Reinforced Bar-Tacks",
      "Pre-Shrunk Heavyweight Knit",
      "Drop-Shoulder Box Cut Silhouette"
    ],
    fabric: "100% Loopback French Terry",
    gsm: "420 GSM",
    printMethod: "Discharge & Subtle Tonal Stencil",
    care: "Machine wash cold inside-out. Do not tumble dry. Reshape and dry flat.",
    image: "/images/vintage-wash.jpg",
    images: ["/images/vintage-wash.jpg", "/images/hero.png"],
    sizes: ["S", "M", "L", "XL"],
    colors: ["Washed Ash Grey", "Heavy Charcoal"],
    badge: "PREVIEW",
    isNew: true
  }
];
