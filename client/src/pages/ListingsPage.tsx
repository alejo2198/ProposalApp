import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext.tsx";
import type { Listing } from "../types";
import api from "../api/axios.ts";
import OfferModal from "../components/OfferModal.tsx";
import ListingCard from "../components/UI/Cards/ListingCard.tsx";

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
          <ListingCard
            key={listing.id}
            listing={listing}
            canMakeOffer={user?.role === "Buyer" && listing.status === "Active"}
            onMakeOffer={setSelectedListing}
          />
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
