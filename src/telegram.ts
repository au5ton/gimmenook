
import fetch from 'node-fetch'

export class Telegram {
  private token: string;
  private channelId: string;
  constructor(token: string, channelId: string) {
    this.token = token;
    this.channelId = channelId;
  }

  async sendMessage(text: string) {
    let res = await fetch(`https://api.telegram.org/bot${this.token}/sendMessage?chat_id=${this.channelId}&text=${encodeURI(text)}`)
    return await res.json()
  }
}