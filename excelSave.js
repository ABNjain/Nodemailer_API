const fs = require('fs');
const { parse } = require('csv-parse');

// reading the csv file data 
const data = [];
fs.createReadStream("./uploads/dumpgaura.orders194.csv")
  .pipe(
    parse({
      delimiter: ",",
      columns: true,
      ltrim: true,
    })
  )
  .on("data", function (row) {
    // This will push the object row into the array
    data.push(row);
  })
  .on("error", function (error) {
    console.log(error.message);
  })
  .on("end", function () {
    // Here log the result array
    console.log("parsed csv data:");
    console.log(data);
  });

  // saving the data data in mongodb database