import type { Listing } from "../../../types";

interface AgentListingCardProps {
  listing: Listing;
  isSelected: boolean;
  onSelect: (listingId: number) => void;
}

export default function AgentListingCard({
  listing,
  isSelected,
  onSelect,
}: AgentListingCardProps) {
  return (
    <div
      onClick={() => onSelect(listing.id)}
      className={`bg-white border rounded-xl p-4 cursor-pointer hover:border-blue-300 transition ${isSelected ? "border-blue-500 ring-1 ring-blue-500" : "border-gray-200"}`}
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
          <p className="text-xs text-gray-400">{listing.offerCount} offers</p>
        </div>
      </div>
    </div>
  );
}
