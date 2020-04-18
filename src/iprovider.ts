import { ResponsePacket } from "./iresponsepacket";

export interface Provider {
  selfCheck(): Promise<ResponsePacket>
}