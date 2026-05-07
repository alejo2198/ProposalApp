import type { Listing } from "../../../types";

interface ListingCardProps {
  listing: Listing;
  canMakeOffer: boolean;
  onMakeOffer: (listing: Listing) => void;
}

const statusColor = (status: string) => {
  if (status === "Active") return "bg-green-100 text-green-700";
  if (status === "UnderContract") return "bg-yellow-100 text-yellow-700";
  return "bg-gray-100 text-gray-600";
};

export default function ListingCard({
  listing,
  canMakeOffer,
  onMakeOffer,
}: ListingCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-md transition">
      <img
        src={listing.imageUrl}
        alt={listing.title}
        className="w-full h-48 object-cover"
      />
      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-gray-800">{listing.title}</h3>
          <span
            className={`text-xs px-2 py-1 rounded-full font-medium ${statusColor(listing.status)}`}
          >
            {listing.status}
          </span>
        </div>
        <p className="text-gray-500 text-sm mb-3">
          {listing.address}, {listing.city}
        </p>
        <p className="text-blue-600 font-bold text-lg mb-3">
          ${listing.askingPrice.toLocaleString()}
        </p>
        <div className="flex gap-4 text-sm text-gray-500 mb-4">
          <span>🛏 {listing.bedrooms} bd</span>
          <span>🚿 {listing.bathrooms} ba</span>
          <span>📐 {listing.squareFeet.toLocaleString()} sqft</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-400">
            {listing.offerCount} offer
            {listing.offerCount !== 1 ? "s" : ""}
          </span>
          {canMakeOffer && (
            <button
              onClick={() => onMakeOffer(listing)}
              className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-1.5 rounded-lg transition"
            >
              Make Offer
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
