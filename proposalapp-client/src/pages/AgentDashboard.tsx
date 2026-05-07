import { useEffect, useState } from "react";
import * as signalR from "@microsoft/signalr";
import type { Listing, Offer } from "../types";
import api from "../api/axios";

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

  const statusColor = (status: string) => {
    if (status === "Accepted") return "text-green-600 bg-green-50";
    if (status === "Rejected") return "text-red-600 bg-red-50";
    if (status === "Countered") return "text-yellow-600 bg-yellow-50";
    return "text-blue-600 bg-blue-50";
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
              <div
                key={listing.id}
                onClick={() => loadOffers(listing.id)}
                className={`bg-white border rounded-xl p-4 cursor-pointer hover:border-blue-300 transition ${selectedListing === listing.id ? "border-blue-500 ring-1 ring-blue-500" : "border-gray-200"}`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-gray-800">{listing.title}</p>
                    <p className="text-sm text-gray-500">{listing.address}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-blue-600">
                      ${listing.askingPrice.toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-400">
                      {listing.offerCount} offers
                    </p>
                  </div>
                </div>
              </div>
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
                <div
                  key={offer.id}
                  className="bg-white border border-gray-200 rounded-xl p-4"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-medium text-gray-800">
                        {offer.buyerName}
                      </p>
                      <p className="text-sm text-gray-500">{offer.message}</p>
                    </div>
                    <span
                      className={`text-xs px-2 py-1 rounded-full font-medium ${statusColor(offer.status)}`}
                    >
                      {offer.status}
                    </span>
                  </div>
                  <p className="text-blue-600 font-bold text-lg mb-3">
                    ${offer.offerAmount.toLocaleString()}
                  </p>
                  {offer.status === "Pending" && (
                    <div className="flex gap-2">
                      <button
                        onClick={() =>
                          handleAction(offer.id, "accept", selectedListing)
                        }
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white text-sm py-1.5 rounded-lg transition"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() =>
                          handleAction(offer.id, "reject", selectedListing)
                        }
                        className="flex-1 bg-red-500 hover:bg-red-600 text-white text-sm py-1.5 rounded-lg transition"
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
