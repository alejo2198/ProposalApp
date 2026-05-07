import { useEffect, useState } from "react";
import * as signalR from "@microsoft/signalr";
import type { Listing, Offer } from "../types";
import api from "../api/axios";
import AgentListingCard from "../components/UI/Cards/AgentListingCard";
import OfferCard from "../components/UI/Cards/OfferCard";

interface Toast {
  id: number;
  message: string;
}

export default function AgentDashboard() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [offers, setOffers] = useState<Record<number, Offer[]>>({});
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [selectedListing, setSelectedListing] = useState<number | null>(null);

  const loadOffers = async (listingId: number) => {
    const { data } = await api.get(`/api/offers/listing/${listingId}`);
    setOffers((prev) => ({ ...prev, [listingId]: data }));
    setSelectedListing(listingId);
  };

  const addToast = (message: string) => {
    const id = Date.now();
    setToasts((t) => [...t, { id, message }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 5000);
  };

  useEffect(() => {
    api.get("/api/listings").then((r) => setListings(r.data));
  }, []);

  useEffect(() => {
    if (listings.length === 0) return;

    const connection = new signalR.HubConnectionBuilder()
      .withUrl("http://localhost:5018/hubs/offers", {
        withCredentials: false,
      })
      .withAutomaticReconnect()
      .build();

    connection.on("NewOffer", (data) => {
      addToast(
        `🏠 New offer of $${data.offerAmount.toLocaleString()} from ${data.buyerName} on ${data.listingTitle}`,
      );
      if (selectedListing === data.listingId) {
        loadOffers(data.listingId);
      }
    });

    connection.on("OfferUpdated", (data) => {
      addToast(`Offer #${data.offerId} updated to ${data.status}`);
    });

    connection.start().then(() => {
      listings.forEach((l) =>
        connection.invoke("JoinListingGroup", l.id.toString()),
      );
    });

    return () => {
      connection.stop();
    };
  }, [listings, selectedListing]);

  const handleAction = async (
    offerId: number,
    action: "accept" | "reject",
    listingId: number,
  ) => {
    await api.put(`/api/offers/${offerId}/${action}`);
    loadOffers(listingId);
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      {/* Toast notifications */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            className="bg-gray-900 text-white text-sm px-4 py-3 rounded-xl shadow-lg max-w-sm"
          >
            {t.message}
          </div>
        ))}
      </div>

      <h2 className="text-2xl font-bold text-gray-800 mb-6">Agent Dashboard</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Listings panel */}
        <div>
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
            Your Listings
          </h3>
          <div className="space-y-3">
            {listings.map((listing) => (
              <AgentListingCard
                key={listing.id}
                listing={listing}
                isSelected={selectedListing === listing.id}
                onSelect={loadOffers}
              />
            ))}
          </div>
        </div>

        {/* Offers panel */}
        <div>
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
            {selectedListing ? "Offers" : "Select a listing to view offers"}
          </h3>
          {selectedListing && offers[selectedListing] && (
            <div className="space-y-3">
              {offers[selectedListing].length === 0 && (
                <p className="text-gray-400 text-sm">No offers yet.</p>
              )}
              {offers[selectedListing].map((offer) => (
                <OfferCard
                  key={offer.id}
                  offer={offer}
                  onAccept={() =>
                    handleAction(offer.id, "accept", selectedListing)
                  }
                  onReject={() =>
                    handleAction(offer.id, "reject", selectedListing)
                  }
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
