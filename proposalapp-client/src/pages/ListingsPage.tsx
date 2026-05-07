import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext.tsx";
import type { Listing } from "../types";
import api from "../api/axios.ts";
import OfferModal from "../components/OfferModal.tsx";

export default function ListingsPage() {
  const { user } = useAuth();
  const [listings, setListings] = useState<Listing[]>([]);
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/api/listings").then((r) => {
      setListings(r.data);
      setLoading(false);
    });
  }, []);

  const statusColor = (status: string) => {
    if (status === "Active") return "bg-green-100 text-green-700";
    if (status === "UnderContract") return "bg-yellow-100 text-yellow-700";
    return "bg-gray-100 text-gray-600";
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-64 text-gray-400">
        Loading listings...
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800">Available Listings</h2>
        <p className="text-gray-500 text-sm mt-1">
          {listings.length} properties found
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {listings.map((listing) => (
          <div
            key={listing.id}
            className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-md transition"
          >
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
                {user?.role === "Buyer" && listing.status === "Active" && (
                  <button
                    onClick={() => setSelectedListing(listing)}
                    className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-1.5 rounded-lg transition"
                  >
                    Make Offer
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      {selectedListing && (
        <OfferModal
          listing={selectedListing}
          onClose={() => setSelectedListing(null)}
          onSuccess={() => {
            setSelectedListing(null);
          }}
        />
      )}
    </div>
  );
}
