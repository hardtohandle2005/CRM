// graph-utils.js
const axios = require('axios');
const ExcelJS = require('exceljs');

async function getAccessToken() {
  // Your access token logic here
}

async function getWorkbookFromOneDrive(fileName) {
  const accessToken = await getAccessToken();

  const url = `https://graph.microsoft.com/v1.0/users/MuninderPal@JK17.onmicrosoft.com/drive/root:/CRM/${fileName}`;
  const response = await axios.get(url, {
    headers: { Authorization: `Bearer ${accessToken}` }
  });

  if (response.status === 200 && response.data['@microsoft.graph.downloadUrl']) {
    const downloadUrl = response.data['@microsoft.graph.downloadUrl'];
    const excelBuffer = (await axios.get(downloadUrl, { responseType: 'arraybuffer' })).data;

    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(excelBuffer);

    return { workbook, token: accessToken };
  }

  return { workbook: null, token: accessToken };
}

async function uploadWorkbookToOneDrive(fileName, buffer) {
  const accessToken = await getAccessToken();

  const url = `https://graph.microsoft.com/v1.0/users/MuninderPal@JK17.onmicrosoft.com/drive/root:/CRM/${fileName}:/content`;
  const response = await axios.put(url, buffer, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    }
  });

  if (![200, 201].includes(response.status)) {
    throw new Error(`Upload failed: ${response.status}`);
  }

  console.log('✅ Excel uploaded to OneDrive');
}

module.exports = {
  getAccessToken,
  getWorkbookFromOneDrive,
  uploadWorkbookToOneDrive
};
