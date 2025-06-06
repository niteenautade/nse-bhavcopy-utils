const csv = require('csv-parser');
const { Readable } = require('stream');

const floatRegex = /^[+-]?(\d+(\.\d*)?|\.\d+)$/;
function isFloat(str) {
	return floatRegex.test(str);
}
function splitDateStringToNumberMonth(dateStr) {
	const parts = dateStr.split('-');

	if (parts.length !== 3) {
		throw new Error('Invalid date format. Expected format is dd-MMM-yyyy');
	}

	const [day, monthName, year] = parts;

	const monthMap = {
		Jan: '01', Feb: '02', Mar: '03', Apr: '04', May: '05', Jun: '06',
		Jul: '07', Aug: '08', Sep: '09', Oct: '10', Nov: '11', Dec: '12'
	};

	const month = monthMap[monthName];

	if (!month) {
		throw new Error('Invalid month name');
	}

	return { day, month, year };
}


async function fetchBhavcopyByDate(date) {
	if (typeof (date) === 'string') {
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
		if (!res.ok) {
			return reject(res)
		}
		Readable.fromWeb(res.body)
			.pipe(csv())
			.on('data', (row) => {
				const trimmedRowJSON = {};
				Object.keys(row).forEach((key) => {
					const value = row[key];
					trimmedRowJSON[key.trim()] = value.trim();
					const val = trimmedRowJSON[key.trim()]
					if (isFloat(val)) {
						trimmedRowJSON[key.trim()] = parseFloat(val)
					}
				});
				const receivedDate = splitDateStringToNumberMonth(trimmedRowJSON['DATE1'])
				const formattedReceivedDate = `${receivedDate.day}${receivedDate.month}${receivedDate.year}`;
				trimmedRowJSON['TRADE_DATE'] = `${receivedDate.year}-${receivedDate.month}-${receivedDate.day}`
				delete trimmedRowJSON['DATE1']
				if (formattedReceivedDate !== formattedDate) {
					return reject(`Dates do not match! Expected: ${formattedDate}, Got: ${formattedReceivedDate}`)
				}
				jsonData.push(trimmedRowJSON);
			})
			.on('end', resolve)
			.on('error', reject);
	});

	return jsonData;
}

module.exports.fetchBhavcopyByDate = fetchBhavcopyByDate