const csv = require('csv-parser')
const fs = require('fs')

fs.createReadStream('./db/1.csv')
  .pipe(csv())
  .on('data', row => {
    console.log('row : ', row)
  })
  .on('end', () => {
    console.log('CSV file successfully processed')
  })
