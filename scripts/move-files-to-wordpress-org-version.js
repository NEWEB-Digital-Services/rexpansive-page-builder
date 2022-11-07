const path = require('path')
const fs = require('fs')

const myArgs = process.argv.slice(2)

const logPath = myArgs[0]
const destRoot = myArgs[1]

if ('undefined' === typeof logPath || 'undefined' === typeof destRoot) {
	console.error('You must provide the path for diff file')
	process.exit(1)
}

const logfile = path.resolve(logPath)

var lineReader = require('readline').createInterface({
	input: require('fs').createReadStream(logfile)
});

const rootPath = path.resolve('.')
  
lineReader.on('line', function (line) {
	if ('' === line) return
	const lineInfo = line.split('\t')
	const fileInfo = lineInfo[1].replace(/\//g, '\\')
	const sourcePath = `${rootPath}\\${fileInfo}`
	const destPath = `${destRoot}\\${fileInfo}`
	switch (lineInfo[0]) {
		case 'A': {
			// todo: svn add destPath
			break
		}
		case 'M': {
			try {
				fs.copyFileSync(sourcePath, destPath)
			} catch (error) {
				// todo: handle non existing folders
				// todo: handle file types to not copy
				console.error(error.message)
			}
			break
		}
		case 'D': {
			// console.log('delete')
			try {
				// fs.rmSync(destPath)
				// todo: svn delete destPath
			} catch (error) {
				console.error(error.message)
			}
			break
		}
	}
	// console.log(line[0])
	
});

console.log(path.resolve('.'))