// utils/fileHelper.js
// This is the ONLY file in the entire backend that is allowed to touch the
// file system. Controllers never call fs directly - they only ever call
// readExpenses() and writeExpenses() exported from here.

const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, '..', 'data', 'expenses.json');

/**
 * Reads and parses the expenses.json file.
 * Returns an empty array if the file does not exist yet, or if the
 * contents cannot be parsed for any reason.
 * @returns {Array<Object>}
 */
function readExpenses() {
  try {
    if (!fs.existsSync(DATA_FILE)) return [];
    const rawData = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(rawData);
  } catch (error) {
    return [];
  }
}

/**
 * Persists the given expenses array to expenses.json as pretty-printed JSON.
 * Creates the data/ directory first if it does not already exist.
 * @param {Array<Object>} expenses
 */
function writeExpenses(expenses) {
  const dataDirectory = path.dirname(DATA_FILE);
  if (!fs.existsSync(dataDirectory)) {
    fs.mkdirSync(dataDirectory, { recursive: true });
  }
  fs.writeFileSync(DATA_FILE, JSON.stringify(expenses, null, 2));
}

module.exports = { readExpenses, writeExpenses };
