// ─── Enums ────────────────────────────────────────────────
export type BookingStatus = "PENDING" | "CONFIRMED" | "CANCELLED" | "DONE";

// ─── Packages ─────────────────────────────────────────────
export type PackageCategory = {
  id: string;
  name: string;
  slug: string;
};

export type PackageTier = {
  id: string;
  name: string;
  price: number;
  duration: number;
  includes: string[];
  packageId: string;
};

export type PackageSample = {
  id: string;
  imageUrl: string;
  caption: string | null;
  packageId: string;
  order: number;
};

export type Package = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  coverImage: string;
  isActive: boolean;
  categoryId: string;
  category: PackageCategory;
  tiers: PackageTier[];
  samples: PackageSample[];
};

// Versi ringkas untuk list/card
export type PackageCard = Pick<
  Package,
  "id" | "name" | "slug" | "coverImage" | "description"
> & {
  category: PackageCategory;
  tiers: Pick<PackageTier, "price">[];
};

// ─── Gallery ──────────────────────────────────────────────
export type GalleryCategory = {
  id: string;
  name: string;
  slug: string;
};

export type GalleryPhoto = {
  id: string;
  imageUrl: string;
  caption: string | null;
  categoryId: string;
  category: GalleryCategory;
  order: number;
};

// ─── Booking ──────────────────────────────────────────────
export type Booking = {
  id: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  packageId: string;
  tierId: string;
  date: Date;
  timeSlot: string;
  status: BookingStatus;
  notes: string | null;
  createdAt: Date;
};

// Form input saat user submit booking
export type BookingFormInput = {
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  packageId: string;
  tierId: string;
  date: string; // ISO string dari date picker
  timeSlot: string;
  notes?: string;
};
