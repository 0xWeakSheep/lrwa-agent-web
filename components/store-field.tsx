import type { StoreSignal } from "@/lib/types";

const statusLabel: Record<StoreSignal["status"], string> = {
  pending: "Pending",
  verified: "Verified",
  attention: "Needs attention",
  closed: "Likely inactive",
};

export function StoreField({
  stores,
  compact = false,
  progress = 0,
}: {
  stores: StoreSignal[];
  compact?: boolean;
  progress?: number;
}) {
  const completedStores = Math.round(stores.length * progress);

  return (
    <div
      className={compact ? "store-field compact" : "store-field"}
      role="img"
      aria-label={`Synthetic store observation field with ${stores.length} locations`}
    >
      <div className="map-grid" aria-hidden />
      <span className="river river-a" aria-hidden />
      <span className="river river-b" aria-hidden />
      {stores.map((store, index) => {
        const observed = index < completedStores;
        const className = observed
          ? `store-node ${store.status === "pending" ? "verified" : store.status}`
          : `store-node ${store.status}`;

        return (
          <span
            aria-hidden
            className={className}
            key={store.id}
            style={{ left: `${store.x}%`, top: `${store.y}%` }}
            title={`${store.name}: ${observed ? "Observed" : statusLabel[store.status]}`}
          />
        );
      })}
      <div className="map-district district-a" aria-hidden>
        JING&apos;AN
      </div>
      <div className="map-district district-b" aria-hidden>
        XUHUI
      </div>
      <div className="map-district district-c" aria-hidden>
        PUDONG
      </div>
      {!compact && (
        <div className="map-legend">
          <span>
            <i className="legend-node verified" /> Verified
          </span>
          <span>
            <i className="legend-node attention" /> Attention
          </span>
          <span>
            <i className="legend-node closed" /> Inactive signal
          </span>
        </div>
      )}
    </div>
  );
}
