export interface User {
  token: string;
  fullName: string;
  email: string;
  role: string;
}

export interface Listing {
  id: number;
  title: string;
  address: string;
  city: string;
  province: string;
  askingPrice: number;
  bedrooms: number;
  bathrooms: number;
  squareFeet: number;
  description: string;
  imageUrl: string;
  status: string;
  offerCount: number;
}

export interface Offer {
  id: number;
  listingId: number;
  listingTitle: string;
  buyerName: string;
  offerAmount: number;
  message: string;
  status: string;
  counterOfferAmount: number | null;
  signatureCompleted: boolean;
  createdAt: string;
}
