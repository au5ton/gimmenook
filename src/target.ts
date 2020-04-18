
import fetch from 'node-fetch'
import { info, error, success } from './prettyPrint'
import { Provider } from './iprovider'
import { ResponsePacket } from './iresponsepacket'
import { InventoryReport } from './iinventoryreport'

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

  // {
  //   location_id: '1535',
  //   distance: '45.54',
  //   store_name: 'Galveston',
  //   store_address: '6128 Broadway St Galveston TX 77551-1030',
  //   location_available_to_promise_quantity: 0,
  //   order_pickup: { availability_status: 'UNAVAILABLE' },
  //   curbside: { availability_status: 'UNAVAILABLE' },
  //   ship_to_store: { availability_status: 'UNAVAILABLE' },
  //   in_store_only: { availability_status: 'OUT_OF_STOCK' }
  // }
  

  async checkInventory(zipCode: number, radius: number = 50, limit: number = 50): Promise<InventoryReport[]> {
    let res = await fetch(`${this.baseUrl}/${this.itemId}?key=${this.key}&nearby=${zipCode}&limit=${radius}&requested_quantity=1&radius=${limit}&fulfillment_test_mode=grocery_opu_team_member_test`)
    let data = await res.json();

    const mapsUrl = `https://www.google.com/maps/search/?api=1`

    let reports: InventoryReport[] = [];

    for(let store of data.products[0].locations) {
      let aval = false;
      if(!['OUT_OF_STOCK', 'UNAVAILABLE'].includes(store.order_pickup.availability_status))  aval = true;
      if(!['OUT_OF_STOCK', 'UNAVAILABLE'].includes(store.curbside.availability_status))      aval = true;
      if(!['OUT_OF_STOCK', 'UNAVAILABLE'].includes(store.ship_to_store.availability_status)) aval = true;
      if(!['OUT_OF_STOCK', 'UNAVAILABLE'].includes(store.in_store_only.availability_status)) aval = true;

      let msg = `Target (${store.store_name}) has no inventory available.`;
      if(aval) {
        msg =  `Target 🎯 (${store.store_name}) has product in their inventory!\n`
        msg += `Location: ${store.store_address}\n`
        msg += `See:\n`
        msg += `<pre>${JSON.stringify(store, undefined, 1)}</pre>`
      }


      reports.push({
        provider: 'Target',
        available: aval,
        storeName: store.store_name,
        message: msg,
        quantity: store.location_available_to_promise_quantity,
        storeLocation: store.store_address,
        distance: store.distance,
      })
    }

    return reports
  }
}