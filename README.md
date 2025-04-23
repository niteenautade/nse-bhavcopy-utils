Here’s a simple **README.md** for your package that explains its functionality and how to use it:

---

# **NSE Bhavdata Utils**

This Node.js package fetches **bhavdata** (stock market data) from the **National Stock Exchange of India (NSE)** for a given date, parses the CSV file, and converts it into a structured **JSON format**.

It’s useful for financial analysis, automation, or building stock market tools that require historical data from NSE.

## **Features**

- Fetches bhavdata CSV from NSE for a specific date.
- Converts CSV data into structured JSON.
- Automatically trims whitespaces and parses numbers to floats where applicable.
- Simple to use with asynchronous API.

## **Installation**

To install the package, use npm:

```bash
npm install nse-bhavcopy-utils
```

## **Usage**

### **Import the module:**

```javascript
const { fetchBhavdataByDate } = require('nse-bhavdata-fetcher');
```

### **Fetch Bhavdata by Date**

You can pass a `Date` object or a `string` representing the date (in any valid format supported by JavaScript `Date`) to fetch bhavdata for that date.

```javascript
const { fetchBhavdataByDate } = require('nse-bhavdata-fetcher');

async function getBhavdata() {
    const date = '2025-04-21'; // You can pass any date in string format or Date object
    const data = await fetchBhavdataByDate(date);
    console.log(data); // Array of JSON objects with bhavdata
}

getBhavdata();
```

### **How it Works**

1. **Date Formatting:** The function automatically formats the date into the `DDMMYYYY` format.
2. **CSV Parsing:** It fetches the `.csv` file from the [NSE Bhavcopy archive](https://nsearchives.nseindia.com/) for the specific date.
3. **JSON Conversion:** Each row in the CSV is parsed into a JSON object. Any numerical data is converted to `float`.
4. **Result:** The result is an array of objects where each object represents a row from the CSV file.

### **Example Output:**

```json
[
  {
    "SYMBOL": "INFY",
    "OPEN": 1200.5,
    "CLOSE": 1215.75,
    "DATE": "21-Apr-2025",
    ...
  },
  {
    "SYMBOL": "TCS",
    "OPEN": 2800.5,
    "CLOSE": 2830.75,
    "DATE": "21-Apr-2025",
    ...
  }
]
```

## **API**

### `fetchBhavdataByDate(date: string | Date): Promise<Object[]>`

Fetches bhavdata for the given date and returns the data as an array of JSON objects.

- **Arguments:** 
  - `date`: A date string (e.g., `'2025-04-21'`) or a `Date` object.
  
- **Returns:** A promise that resolves to an array of JSON objects.

## **Dependencies**

- `csv-parser`: For parsing CSV data.
- `stream`: Native Node.js module to handle streams.

## **License**

MIT License. See the [LICENSE](LICENSE) file for details.

---

This README gives users clear instructions on how to install, use, and understand the functionality of your library. You can add more details based on features you want to highlight (like handling errors, advanced use cases, etc.). Let me know if you'd like any changes!