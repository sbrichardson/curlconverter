#!/usr/bin/env node

const curlconverter = require('../index.js')
const argv = require('yargs').argv
const fs = require('fs')

// sets a default incase -l/--langauge isn't passed
const defaultLanguage = 'python'

// used to map languages to functions
// NOTE: make sure to update this when adding langauge support
const translate = {
  r: 'toR',
  php: 'toPhp',
  python: 'toPython',
  node: 'toNode',
  go: 'toGo',
  strest: 'toStrest',
  rust: 'toRust',
  json: 'toJsonString',
  dart: 'toDart'
}

// outputs the help menu
function help() {
  console.log(`usage: curlconverter [-l <language>] [<curl>]

options:
\t-l, --language\t the language to convert the curl command to

stdin:
\tif no <curl> is passes, the script will read from stdin

languages:
\t${ Object.keys(translate).join('\n\t')}`);
}

(async () => {
  if (argv.h || argv.help)
    return help()

  const language = argv.l || argv.language

  // used either the language passed of the default
  const fnName = language ? translate[language] : translate[defaultLanguage]

  // if true, the used passed in an unsuppored langauge
  if (!fnName)
    return console.error('error: language not supported'), help()

  // either use the unnamed argument or read from stdin
  const curl = argv._.length ? argv._[0] : fs.readFileSync(0, 'utf8')
  const generator = curlconverter[fnName]
  const code = generator(curl)
  console.log(code)
})()
