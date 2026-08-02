// Google Apps Script for the contributions Google Sheet.
// Paste this into the sheet: Extensions → Apps Script → replace the code,
// then Deploy → New deployment → Web app (execute as: Me, access: Anyone)
// and copy the /exec URL into Netlify env var SHEET_WEBHOOK_URL.
// The token below must match Netlify env var SHEET_WEBHOOK_TOKEN.

const TOKEN = 'f24b40622e3d40992cc7c242f22eb54d';

const GIFT_NAMES = {
  sofa: 'A New Sofa',
  honeymoon: 'Honeymoon Fund',
  renovation: 'Flat Renovation',
  kitchen: 'Kitchen Essentials',
  decoration: 'One Wedding Canvas',
};

function doPost(e) {
  const data = JSON.parse(e.postData.contents);
  if (data.token !== TOKEN) {
    return ContentService.createTextOutput('forbidden');
  }
  const sheet = SpreadsheetApp.openById('1UwVc0TtwBT27rH2hjSyFdZ2OwJDveewrX-H0LlKt3Mo').getSheets()[0];
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(['Date', 'Name', 'Gift', 'Amount (€)']);
  }
  sheet.appendRow([
    new Date(data.at),
    String(data.name).slice(0, 80),
    GIFT_NAMES[data.gift] || String(data.gift),
    Number(data.amount),
  ]);
  return ContentService.createTextOutput('ok');
}
