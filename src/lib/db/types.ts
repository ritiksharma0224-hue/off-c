/**
 * KAPDOLOGY® Master Database Entity Types
 * Single Source of Truth Ecommerce Architecture
 */

export type ProductStatus =
  | "DRAFT"
  | "ACTIVE"
  | "HIDDEN"
  | "OUT OF STOCK"
  | "PREORDER"
  | "RESERVATION OPEN"
  | "SOLD OUT"
  | "ARCHIVED";

export interface ProductVariant {
  id: string;
  productId: string;
  size: string; // e.g., "XS", "S", "M", "L", "XL", "XXL"
  color: string; // e.g., "Off-White / Cream"
  sku: string; // e.g., "KPD-SIG-BOX-OW-M"
  physicalStock: number;
  reservedStock: number;
  preorderedStock: number;
  allocatedStock: number; // In active confirmed orders pending dispatch
  availableStock: number; // physicalStock - reservedStock - allocatedStock
}

export interface ProductImageSlot {
  id: string;
  url: string;
  alt: string;
  slot: "PRIMARY" | "SECONDARY" | "DETAIL" | "BACK" | "MODEL" | "LIFESTYLE";
  isPrimary: boolean;
  isHover: boolean;
  position: number;
}

export interface MasterProduct {
  id: string;
  name: string;
  slug: string;
  shortDescription: string;
  fullDescription: string;
  price: number;
  compareAtPrice?: number;
  discountPercentage?: number;
  
  // Classification
  categoryId: string; // e.g., "cat-01"
  categoryName: string; // e.g., "OVERSIZED T-SHIRTS"
  categorySlug: string; // e.g., "oversized-tees"
  designFamilyId: string; // e.g., "identity", "chaos", "minimal", "technical", "restricted", "global"
  designFamilyName: string;
  collectionId: string; // e.g., "drop-001"
  collectionName: string;
  drop: string; // e.g., "DROP 001"
  tags: string[];

  // Technical Garment Specifications
  fabric: string; // e.g., "100% Combed Heavyweight Cotton"
  gsm: string; // e.g., "240 GSM"
  fit: string; // e.g., "Signature Oversized Box Cut"
  printMethod: string; // e.g., "High-Density Screenprint"
  care: string;
  details: string[];
  gender: "UNISEX" | "MEN" | "WOMEN";

  // Visual Assets
  image: string; // Primary image URL (convenience alias)
  images: string[]; // All image URLs ordered
  imageSlots: ProductImageSlot[];

  // Sizes and Variant Matrix
  availableSizes: string[];
  colors: string[];
  variants: ProductVariant[];

  // Stock Aggregates
  totalPhysicalStock: number;
  totalReservedStock: number;
  totalPreorderedStock: number;
  totalAvailableStock: number;
  lowStockThreshold: number;

  // Status & Badging
  status: ProductStatus;
  badge?: string; // e.g., "DROP 001", "BEST SELLER", "LIMITED"
  isNew: boolean;
  isPopular: boolean;
  featured: boolean;

  // Reservation System Settings
  reservationEnabled: boolean;
  reservationStartDate?: string;
  reservationEndDate?: string;
  maxReservations?: number;
  reservationLimitPerCustomer?: number;
  reservationAllowedSizes: string[];
  reservationAllowedColors: string[];
  reservationMessage?: string;
  reservationCtaText?: string; // Default: "RESERVE YOUR SIZE"

  // Preorder System Settings
  preorderEnabled: boolean;
  preorderStartDate?: string;
  preorderEndDate?: string;
  expectedFulfillmentDate?: string;
  maxPreorders?: number;
  preorderPrice?: number;
  preorderMessage?: string;
  preorderAllowedSizes: string[];
  preorderAllowedColors: string[];
  preorderCtaText?: string; // Default: "PREORDER NOW →"
  showPreorderCapacity: boolean;

  // Timestamps
  createdAt: string;
  updatedAt: string;
}

export interface GarmentCategoryEntity {
  id: string;
  name: string;
  slug: string;
  displayNumber: string;
  shortDescription: string;
  fullDescription: string;
  image: string;
  fitNote: string;
  sortOrder: number;
  status: "ACTIVE" | "HIDDEN";
}

export interface DesignFamilyEntity {
  id: string;
  name: string;
  slug: string;
  subtitle: string;
  description: string;
  features: string[];
  tag: string;
  coverImage: string;
  sortOrder: number;
  status: "ACTIVE" | "HIDDEN";
}

export interface CollectionEntity {
  id: string;
  name: string;
  slug: string;
  description: string;
  coverImage: string;
  startDate?: string;
  endDate?: string;
  featured: boolean;
  sortOrder: number;
  status: "ACTIVE" | "UPCOMING" | "ARCHIVED";
}

export type InventoryMovementType =
  | "PRODUCTION_RECEIVED"
  | "DAMAGED"
  | "SAMPLE"
  | "ORDER_COMMITTED"
  | "ORDER_CANCELLED"
  | "AUDIT_CORRECTION"
  | "RESERVATION_HOLD"
  | "RESERVATION_RELEASE";

export interface InventoryMovement {
  id: string;
  variantId: string;
  productId: string;
  productName: string;
  size: string;
  color: string;
  quantityChange: number; // positive or negative
  previousStock: number;
  newStock: number;
  type: InventoryMovementType;
  reason: string;
  admin: string;
  timestamp: string;
}

export type ReservationStatus =
  | "PENDING"
  | "CONFIRMED"
  | "CANCELLED"
  | "FULFILLED"
  | "EXPIRED";

export interface Reservation {
  id: string;
  reservationNumber: string; // e.g., "#RES-1042"
  productId: string;
  productName: string;
  variantId?: string;
  size: string;
  color: string;
  quantity: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  status: ReservationStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export type PreorderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "FULFILLED"
  | "CANCELLED";

export interface Preorder {
  id: string;
  preorderNumber: string; // e.g., "#PRE-1024"
  productId: string;
  productName: string;
  variantId?: string;
  size: string;
  color: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  expectedFulfillmentDate?: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress?: {
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
  };
  status: PreorderStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export type OrderPaymentStatus =
  | "PAYMENT_NOT_INTEGRATED"
  | "PAYMENT_PENDING"
  | "PAYMENT_CONFIRMED"
  | "CANCELLED"
  | "REFUNDED";

export type OrderFulfillmentStatus =
  | "UNFULFILLED"
  | "PROCESSING"
  | "PACKED"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED";

export interface OrderItemRecord {
  productId: string;
  productName: string;
  slug: string;
  size: string;
  color?: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  image: string;
}

export interface MasterOrder {
  id: string;
  orderNumber: string; // e.g., "#KPD-8492"
  customer: {
    fullName: string;
    email: string;
    phone: string;
  };
  shippingAddress: {
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
  };
  items: OrderItemRecord[];
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  deliveryMethod: string;
  paymentMethod: string;
  paymentStatus: OrderPaymentStatus;
  fulfillmentStatus: OrderFulfillmentStatus;
  trackingNumber?: string;
  carrier?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CustomerProfile {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  totalOrders: number;
  totalReservations: number;
  totalPreorders: number;
  totalSpent: number;
  lastActivityAt: string;
  notes?: string;
  createdAt: string;
}

export interface MediaAsset {
  id: string;
  filename: string;
  url: string;
  sizeBytes: number;
  mimeType: string;
  dimensions?: { width: number; height: number };
  usedBy: Array<{
    type: "product" | "category" | "family" | "collection";
    id: string;
    name: string;
  }>;
  uploadedAt: string;
}

export interface AuditLog {
  id: string;
  admin: string;
  action: string;
  targetType: string;
  targetId: string;
  targetName: string;
  details: string;
  timestamp: string;
}

export interface StoreSettings {
  lowStockThreshold: number;
  currency: string;
  currencySymbol: string;
  freeShippingThreshold: number;
  standardShippingFee: number;
  storeEmail: string;
  paymentGatewayStatus: "PRE_RELEASE_INACTIVE" | "ACTIVE";
  reservationNotice: string;
  preorderNotice: string;
}
