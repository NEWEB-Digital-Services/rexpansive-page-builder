const path = require('path')
const fs = require('fs')
const readline = require('readline')

// const rl = readline.createInterface({
// 	input: process.stdin,
// 	output: process.stdout
// })

/* === Constants === */
const ROOT_FOLDER = path.resolve('../../')

/* === Reading input === */
const args = process.argv.slice(2)
const newVersion = args[0]

if(typeof newVersion === 'undefined') {
	console.log('Insert new version!')
	process.exit()
}

/* === Editing client package.json === */
const packageJsonFilePath = path.resolve('./package.json')
const packageJson = require(packageJsonFilePath)

packageJson.version = newVersion
fs.writeFileSync(packageJsonFilePath, JSON.stringify(packageJson, null, '\t') + '\n')

// rl.close();