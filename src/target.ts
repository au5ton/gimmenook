
import fetch from 'node-fetch'
import { info, error, success } from './prettyPrint'
import { Provider } from './iprovider'
import { ResponsePacket } from './iresponsepacket'

export class Target implements Provider {
  private baseUrl: string = 'https://api.target.com/fulfillment_aggregator/v1/fiats'
  private key: string = 'eb2551e4accc14f38cc42d32fbc2b2ea'
  private itemId: string = '77464001'

  async selfCheck(): Promise<ResponsePacket> {
    try {
      await this.checkInventory(77001)
      return {
        status: true,
        data: null
      };
    }
    catch(err) {
      return {
        status: true,
        data: err
      };
    }
  }

  async checkInventory(zipCode: number, radius: number = 50, limit: number = 50) {
    let res = await fetch(`${this.baseUrl}/${this.itemId}?key=${this.key}&nearby=${zipCode}&limit=${radius}&requested_quantity=1&radius=${limit}&fulfillment_test_mode=grocery_opu_team_member_test`)
    return await res.json()
  }
}