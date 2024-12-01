const express = require("express");
const router = express.Router();
const fs = require('fs');
const csv = require('csvtojson');
const { Parser } = require("json2csv");
const multer = require("multer");
const path = require("path");
const dbf = require("dbf");
// const dbf = require("node-dbf");

const upload = multer({ dest: "uploads/" });

// Route to handle CSV to JSON conversion (using POST for file upload)
router.post("/convert", upload.single("file"), (req, res, next) => {
    // console.log(req.file); // Check if the file is available in the request
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }

    const csvFilePath = req.file.path; // Path to your CSV file
    csv()
        .fromFile(csvFilePath)
        .then((jsonObj) => {
            // JSON object converted from CSV
            // console.log('JSON Data:', jsonObj);

            // Writing to a JSON file
            fs.writeFile('./data.json', JSON.stringify(jsonObj, null, 2), (err) => {
                if (err) {
                    console.error('Error writing JSON file:', err);
                } else {
                    console.log('Data successfully written to data.json');
                    res.download('./data.json', "converted.json"); // Download JSON file
                }
            });
        })
        .catch((error) => {
            console.error('Error converting CSV to JSON:', error);
            res.status(500).send('Error converting CSV to JSON.');
        });
});

// Route to handle JSON to CSV conversion (using POST for file upload)
router.post("/json-to-csv", upload.single("file"), (req, res, next) => {
    // console.log(req.file); // Check if the file is available in the request
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }

    const jsonFilePath = req.file.path; // Path to your JSON file

    fs.readFile(jsonFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading JSON file:', err);
            return res.status(500).send("Error reading JSON file.");
        }

        try {
            // Attempt to parse the JSON data
            const jsonData = JSON.parse(data); // Parse JSON data
            // console.log("Parsed JSON data:", jsonData);

            // If parsing is successful, convert JSON to CSV
            const parser = new Parser(); // Instantiate the Parser
            const csvData = parser.parse(jsonData); // Convert JSON to CSV
            const csvFilePath = `uploads/${req.file.originalname.replace(/\.json$/, ".csv")}`;

            // Write the CSV data to a file
            fs.writeFile(csvFilePath, csvData, (err) => {
                if (err) {
                    console.error("Error writing CSV file:", err);
                    return res.status(500).send("Error writing CSV file.");
                }

                console.log("CSV file successfully written.");
                res.download(csvFilePath, "converted.csv"); // Send the file for download
            });
        } catch (error) {
            console.error("Error converting JSON to CSV:", error);
            res.status(500).send("Error converting JSON to CSV. Ensure the JSON file is properly formatted.");
        }
    });
});

router.post("/json-to-dbf", upload.single("file"), (req, res, next) => {
    if (!req.file) {
        return res.status(400).send("No file uploaded.");
    }

    const jsonFilePath = req.file.path; // Path to your JSON file

    // Read the uploaded JSON file
    fs.readFile(jsonFilePath, "utf8", (err, data) => {
        if (err) {
            console.error("Error reading JSON file:", err);
            return res.status(500).send("Error reading JSON file.");
        }

        try {
            const jsonData = JSON.parse(data); // Parse the JSON data

            // Check if JSON data is valid
            if (!jsonData || jsonData.length === 0) {
                return res.status(400).send("Invalid or empty JSON data.");
            }

            // Define the DBF schema based on the JSON data keys
            const fields = Object.keys(jsonData[0]).map(key => ({
                name: key,
                type: 'C', // 'C' for character fields
                length: 20 // Field length, adjust based on your data
            }));

            // Define DBF output file path
            const outputFile = path.join(__dirname, "uploads", `${req.file.originalname.replace(/\.json$/, ".dbf")}`);

            // Create a new DBF table instance
            const table = new dbf.Table(outputFile, fields);

            // Write data to the DBF table
            table.open(dbf.OPEN_WRITE);  // Open the table for writing

            // Add rows to the DBF table
            jsonData.forEach(row => {
                const dbfRow = fields.map(field => row[field.name] || ''); // Ensure empty values are handled
                table.add(dbfRow); // Add each row
            });

            // Close the table after writing
            table.close();

            console.log(`DBF file saved as ${outputFile}`);

            // Send the DBF file for download
            res.download(outputFile, "converted.dbf");
        } catch (error) {
            console.error("Error parsing JSON:", error);
            res.status(500).send("Error converting JSON to DBF.");
        }
    });
});


// Read the JSON file



module.exports = router;
