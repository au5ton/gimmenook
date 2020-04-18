import { info, error, success } from './prettyPrint'
import { Telegram } from './telegram'
import { Target } from './target'
import { Provider } from './iprovider';

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
  private telegram: Telegram;
  private target: Target;
  constructor({ telegram, target }: AppArguments) {
    this.telegram = telegram;
    this.target = target;
  }

  async start() {
    this.telegram.sendMessage('Hello World!')
  }
}