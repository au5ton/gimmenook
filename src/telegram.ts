
import fetch from 'node-fetch'
import { Provider } from './iprovider';
import { ResponsePacket } from './iresponsepacket';

export class Telegram implements Provider {
  private token: string;
  private channelId: string;
  constructor(token: string, channelId: string) {
    this.token = token;
    this.channelId = channelId;
  }

  async selfCheck(): Promise<ResponsePacket> {
    try {
      let res = await fetch(`https://api.telegram.org/bot${this.token}/getMe`)
      let data = await res.json()
      return {
        status: true,
        data: data
      };
    }
    catch(err) {
      return {
        status: false,
        data: err
      };
    }
  }

  async sendMessage(text: string) {
    let res = await fetch(`https://api.telegram.org/bot${this.token}/sendMessage?chat_id=${this.channelId}&text=${encodeURI(text)}`)
    return await res.json()
  }
}