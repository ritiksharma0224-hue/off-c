export interface GarmentCategory {
  id: string;
  name: string;
  slug: string;
  displayNumber: string;
  shortDescription: string;
  fullDescription: string;
  itemCount: number;
  image: string;
  fitNote: string;
}

export const garmentCategories: GarmentCategory[] = [
  {
    id: "cat-01",
    name: "OVERSIZED T-SHIRTS",
    slug: "oversized-tees",
    displayNumber: "01",
    shortDescription: "Heavyweight drop-shoulder silhouettes in 240 GSM organic cotton.",
    fullDescription: "Built with structured shoulder drops and heavy cotton canvases that hold architectural shape without clinging.",
    itemCount: 2,
    image: "/images/hero.png",
    fitNote: "Signature Oversized Cut"
  },
  {
    id: "cat-02",
    name: "BOXY / RELAXED TEES",
    slug: "boxy-tees",
    displayNumber: "02",
    shortDescription: "Wide drape with tight neck collars and modern streetwear box cuts.",
    fullDescription: "Clean boxy proportions designed for relaxed layering with high-density ribbed necklines.",
    itemCount: 2,
    image: "/images/slate-boxy.jpg",
    fitNote: "Structured Boxy Fit"
  },
  {
    id: "cat-03",
    name: "GRAPHIC TEES",
    slug: "graphic-tees",
    displayNumber: "03",
    shortDescription: "High-definition DTF prints celebrating subculture, cyber graphics, and typography.",
    fullDescription: "Statement artwork engineered directly into heavy cotton fabrics using fade-resistant graphic inks.",
    itemCount: 3,
    image: "/images/cyber-tee.jpg",
    fitNote: "Oversized Graphic Cut"
  },
  {
    id: "cat-04",
    name: "SHIRTS",
    slug: "shirts",
    displayNumber: "04",
    shortDescription: "Technical cropped button-downs with modular utility pockets and structured hems.",
    fullDescription: "Functional utility shirts constructed with durable cotton twill and industrial snap hardware.",
    itemCount: 1,
    image: "/images/cropped-shirt.jpg",
    fitNote: "Relaxed Cropped Hem"
  },
  {
    id: "cat-05",
    name: "BOTTOMS",
    slug: "bottoms",
    displayNumber: "05",
    shortDescription: "Everyday street cargos and utility trousers built to pair with our boxy tops.",
    fullDescription: "Reinforced ripstop canvas pants featuring modular storage and adjustable ankle silhouettes.",
    itemCount: 1,
    image: "/images/cargos.jpg",
    fitNote: "Relaxed Straight Cut"
  },
  {
    id: "cat-06",
    name: "HOODIES / SWEATSHIRTS",
    slug: "hoodies",
    displayNumber: "06",
    shortDescription: "Heavyweight terry fleece essentials crafted for structured layering.",
    fullDescription: "400+ GSM loopback French terry silhouettes designed with oversized hoods and ribbed hems. Pre-release preview for upcoming drops.",
    itemCount: 1,
    image: "/images/vintage-wash.jpg",
    fitNote: "Heavyweight Boxy Fleece"
  }
];
