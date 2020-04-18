import { ResponsePacket } from "./iresponsepacket";
import { InventoryReport } from "./iinventoryreport";

export interface Provider {
  selfCheck(): Promise<ResponsePacket>
}