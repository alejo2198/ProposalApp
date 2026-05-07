import type { Offer } from "../../../types";

interface OfferCardProps {
  offer: Offer;
  onAccept: () => void;
  onReject: () => void;
}

const statusColor = (status: string) => {
  if (status === "Accepted") return "text-green-600 bg-green-50";
  if (status === "Rejected") return "text-red-600 bg-red-50";
  if (status === "Pending") return "text-blue-600 bg-blue-50";
  return "text-yellow-600 bg-yellow-50";
};

export default function OfferCard({
  offer,
  onAccept,
  onReject,
}: OfferCardProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4">
      <div className="flex justify-between items-start mb-2">
        <div>
          <p className="font-medium text-gray-800">{offer.buyerName}</p>
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
            onClick={onAccept}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white text-sm py-1.5 rounded-lg transition"
          >
            Accept
          </button>
          <button
            onClick={onReject}
            className="flex-1 bg-red-500 hover:bg-red-600 text-white text-sm py-1.5 rounded-lg transition"
          >
            Reject
          </button>
        </div>
      )}
    </div>
  );
}
