const csv = require('csv-parser');
const { Readable } = require('stream');

const floatRegex = /^[+-]?(\d+(\.\d*)?|\.\d+)$/;
function isFloat(str) {
	return floatRegex.test(str);
}

function areDatesEqual(dateStr1, dateStr2) {
	const date1 = new Date(dateStr1);
	const date2 = new Date(dateStr2);

	// Invalid date handling
	if (isNaN(date1) || isNaN(date2)) {
		throw new Error('One or both date strings are invalid');
	}

	return date1.getTime() === date2.getTime();
}

function formatDateToDDMMYYYY(dateInput) {
	const date = new Date(dateInput);

	if (isNaN(date)) {
		throw new Error('Invalid date');
	}

	const day = String(date.getDate()).padStart(2, '0');
	const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
	const year = date.getFullYear();

	return `${day}-${month}-${year}`;
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
	if (!res.ok) {
		throw new Error(`HTTP error! status: ${res.status}`)
	}
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
					if (isFloat(val)) {
						trimmedRowJSON[key.trim()] = parseFloat(val)
					}
				});
				trimmedRowJSON['DATE'] = trimmedRowJSON['DATE1']
				delete trimmedRowJSON['DATE1']

				if (!areDatesEqual(trimmedRowJSON['DATE'], date)) {
					throw new Error(`Dates do not match! Expected: ${formatDateToDDMMYYYY(date)}, Got: ${trimmedRowJSON['DATE']}`)
				}
				jsonData.push(trimmedRowJSON);
			})
			.on('end', resolve)
			.on('error', reject);
	});

	return jsonData;
}

module.exports.fetchBhavcopyByDate = fetchBhavcopyByDate