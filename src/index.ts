#!/usr/bin/env node

import fs from 'fs'
import path from 'path'
import dotenv from 'dotenv'
import { info, error, success } from './prettyPrint'
import { program, Command, Option } from 'commander'

import { App, bindProviders } from './app'
import { Telegram } from './telegram'
import { Target } from './target'
import { Provider } from './iprovider'

program
  .version(process.env.npm_package_version || "")
  .description(process.env.npm_package_description || "")
  .option('--cred <string>', 'Location of .env file with credentials', path.join(__dirname, '..', '.env')) 
  .action(async (command: Command) => {
    const cred: any = dotenv.parse(
      fs.readFileSync(
        path.resolve(command.cred!)
      )
    )
    
    info(`Initializing providers ...`)
    
    // Initialize providers
    let providers: Provider[] = [
      new Telegram(cred.TELEGRAM_BOT_TOKEN, cred.TELEGRAM_CHANNEL_ID),
      new Target()
    ]

    // Perform self check for all providers
    for (let item of providers) {
      let res = await item.selfCheck()
      if(res.status) {
        info(`${item.constructor.name} passed the self-check.`)
      }
      else {
        error(`${item.constructor.name} failed the self-check: `, res.data)
      }
    }

    info(`Starting gimmenook (${process.env.npm_package_version}) ...`)
    
    let app = new App(providers)
    await app.start();
    
    info('Exitting...')
  })
  .parse(process.argv);

