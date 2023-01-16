const path = require('path')
const fs = require('fs')
const readline = require('readline')
const { version } = require('typescript')

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

const mainPluginFilePath = 'rexpansive-builder.php';

fs.readFile(mainPluginFilePath, 'utf8', (err, data) => {
	if (err) throw err;

	const newCommentString = `* Version:           ${newVersion}`
	const newConstantString = `define( 'REXPANSIVE_BUILDER_VERSION', '${newVersion}' );`;
	let result = data
	result = result.replace(/\* Version:\s*[\w.,']+/, newCommentString)
	result = result.replace(/define\(\s*\'REXPANSIVE_BUILDER_VERSION\'\,\s*[\w.,']+\s*\)\;/, newConstantString);

	fs.writeFile(mainPluginFilePath, result, 'utf8', function (err) {
		if (err) return console.log(err);
	});
});

const gulpFile = 'gulpfile.js'
fs.readFile(gulpFile, 'utf8', (err, data) => {
	if (err) throw err;

	const cleanedVersion = newVersion.replace(/\./g, '')
	const newZipVersionString = `Premium-${cleanedVersion}-Rexpansive-Builder.zip`
	let result = data
	result = result.replace(/Premium-\d+-Rexpansive-Builder.zip/, newZipVersionString)

	fs.writeFile(gulpFile, result, 'utf8', function (err) {
		if (err) return console.log(err);
	});
});

// rl.close();