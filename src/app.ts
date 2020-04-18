import { info, error, success } from './prettyPrint'
import { Telegram } from './telegram'
import { Target } from './target'
import { Provider } from './iprovider';
import { InventoryReport } from './iinventoryreport';

export interface AppArguments {
  telegram: Telegram
  target: Target
}

export function bindProviders(providers: Provider[]): AppArguments {
  let telegram = null;
  let target = null;
  for(let item of providers) {
    if(item instanceof Telegram) telegram = item;
    if(item instanceof Target) target = item;
  }

  return {
    telegram: telegram!,
    target: target!
  }
}

export class App {
  private providers: Provider[];
  constructor(providers: Provider[]) {
    this.providers = providers;
  }

  async start() {    
    let telegram: Telegram = this.providers.filter(e => e instanceof Telegram)[0] as Telegram

    let inventory = await Promise.all(this.providers.map(async e => {
      if(e instanceof Target) return await e.checkInventory(77043)
      return []
    }))

    inventory
    .flat()
    .filter(item => (item as InventoryReport).available)
    .forEach(async item => {
      telegram.sendMessage((item as InventoryReport).message)
    })
  }
}