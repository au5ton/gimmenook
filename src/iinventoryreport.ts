
export interface InventoryReport {
  provider: string;       // Target, Best Buy, etc
  available: boolean;     // Whether or not the item is available for immediate purchase
  storeName: string;      // Name or some other identifier for the store
  message: string;        // Custom message given to notification recipients
  quantity?: number;      // Quantity of items immediately available for purchase
  storeLocation?: string; // Address or some other means for locating the physical location of the store
  distance?: string;      // Distance from the store in question to the provided reference location
}
