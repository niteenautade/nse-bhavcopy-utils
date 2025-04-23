const csv = require('csv-parser');
const { Readable } = require('stream');

const floatRegex = /^[+-]?(\d+(\.\d*)?|\.\d+)$/;
function isFloat(str) {
    return floatRegex.test(str);
}
async function fetchBhavcopyByDate(date) {
    if(typeof(date) === 'string'){
        date = new Date(date)
    }
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const formattedDate = `${day}${month}${year}`;

    const url = `https://nsearchives.nseindia.com/products/content/sec_bhavdata_full_${formattedDate}.csv`;

    const res = await fetch(url);
    const jsonData = [];

    await new Promise((resolve, reject) => {
        Readable.fromWeb(res.body)
            .pipe(csv())
            .on('data', (row) => {
                const trimmedRowJSON = {};
                Object.keys(row).forEach((key) => {
                    const value = row[key];
                    trimmedRowJSON[key.trim()] = value.trim();
                    const val = trimmedRowJSON[key.trim()]
                    if(isFloat(val)){
                        trimmedRowJSON[key.trim()] = parseFloat(val)
                    }
                });
                trimmedRowJSON['DATE'] = trimmedRowJSON['DATE1']
                delete trimmedRowJSON['DATE1']
                jsonData.push(trimmedRowJSON);
            })
            .on('end', resolve)
            .on('error', reject);
    });

    return jsonData;
}

module.exports.fetchBhavcopyByDate = fetchBhavcopyByDate