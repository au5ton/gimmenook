#!/usr/bin/env node

import fs from 'fs'
import path from 'path'
import dotenv from 'dotenv'
import { info, error, success } from './prettyPrint'
import { program, Command, Option } from 'commander'

program
  .version(process.env.npm_package_version || "")
  .description(process.env.npm_package_description || "")
  .option('--cred <string>', 'Location of .env file with credentials', path.join(__dirname, '..', '.env')) 
  .action(async (command: Command) => {
    const cred: unknown = dotenv.parse(
      fs.readFileSync(
        path.resolve(command.cred!)
      )
    )

    console.log(cred)
  })
  .parse(process.argv);

