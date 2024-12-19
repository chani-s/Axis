//services/addresses/ts:

import Papa from 'papaparse';

export const loadCSV = async () => {
  try {
    const response = await fetch('/addresses.csv');
    const csvText = await response.text();
    const parsedData = Papa.parse(csvText, {
      header: true, // אם יש כותרת בשורה הראשונה
      skipEmptyLines: true,
    });

    return parsedData.data;
  } catch (error) {
    console.error('Error loading CSV file:', error);
    return [];
  }
};
