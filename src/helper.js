/**
 * The only purpose of this script is to start
 * Glucose Ticker in a separate detached process.
 * 
 * This is needed because starting the app from a 
 * shortcut will cache its icon so that it will not update
 * with the glucose value.
 */

const path = require('path');

// Find the parent directory of the script
var fullPath = process.argv[0];
var appDir = path.dirname(fullPath);
console.log("Detected app directory: " + appDir);

// glucose ticker executable
const exeName = 'glucose-ticker-base.exe';

// Get the path to glucose ticker exe
var exePath = path.join(appDir, exeName);
console.log("Launching: " + exePath);

// Spawn the exe detached
var spawn = require('child_process').spawn
const app = spawn(exePath, [], {detached: true});

process.exit();