function doPost(e) {

  const rawData = e.postData.contents; // array of object

  try {
    // const dataObject = JSON.parse(rawData);
    const parsedRawData = JSON.parse(JSON.parse(JSON.stringify(rawData)));
    const postDataString = parsedRawData[0].postData;

    const jsonData = JSON.parse(postDataString);


    if (!Array.isArray(jsonData)) {
      Logger.log("❌ Error: Data is not an array");
    }
    else{
      Logger.log("Data is an array" + jsonData[1].id);
    }

    // Get or create the sheet
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("MyCase Events") ||
                  SpreadsheetApp.getActiveSpreadsheet().insertSheet("MyCase Events");

    // Optional: Add headers if the sheet is empty
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "ID", "Name", "Description", "Private", "All Day", "Start", "End", "Location", "Case ID", "Created at", "Updated at", "Event Type"
      ]);
    }

    // Append each event row
    jsonData.forEach(event => {
      sheet.appendRow([
        event.id || "",
        event.name || "",
        event.description || "",
        event.private || "",
        event.all_day || "",
        event.start || "",
        event.end || "",
        event.location || "",
        event.case?.id || "",
        event.created_at || "",
        event.updated_at || "",
        event.event_type || ""
      ]);
    });

    return ContentService.createTextOutput("Success");

  } catch (err) {
    Logger.log("❌ Error parsing data: " + err.message);
    return ContentService.createTextOutput("Error: " + err.message);
  }
}

function testDoPost() {
  // Simulate a sample POST request data
  var e = [{"id":50049767,"name":"FSC","description":"FSC 10/1/25 10:00 Dept 28 (continued)","private":false,"all_day":false,"start":"2025-10-01T17:00:00Z","end":"2025-10-01T18:00:00Z","location":null,"case":{"id":23616633},"staff":[{"id":29972060},{"id":29972105},{"id":29972106},{"id":29972107},{"id":29972108},{"id":29972109},{"id":29972110},{"id":29972111},{"id":30621493},{"id":30700690},{"id":31292820},{"id":31780631},{"id":33699824},{"id":37328996},{"id":38545915},{"id":38690912},{"id":41424931},{"id":41934304},{"id":43852589},{"id":44841743},{"id":46420232},{"id":47284562},{"id":50301021},{"id":53000580},{"id":53515575},{"id":55532598},{"id":56094458},{"id":56094615},{"id":56322435},{"id":57191197},{"id":57191659},{"id":57535355},{"id":57633641},{"id":57896301},{"id":57946136},{"id":58265013},{"id":58694452},{"id":59482109},{"id":59566667},{"id":60010369},{"id":60494314}],"created_at":"2023-01-19T17:03:30Z","updated_at":"2025-04-03T21:22:32Z","event_type":"HEARING"},{"id":50049860,"name":"TRIAL","description":"Trial 10/15/25 8:30 Dept 28 (continued)","private":false,"all_day":false,"start":"2025-10-15T15:30:00Z","end":"2025-10-15T16:30:00Z","location":null,"case":{"id":23616633},"staff":[{"id":29972060},{"id":29972105},{"id":29972106},{"id":29972107},{"id":29972108},{"id":29972109},{"id":29972110},{"id":29972111},{"id":30621493},{"id":30700690},{"id":31292820},{"id":31780631},{"id":33699824},{"id":37328996},{"id":38545915},{"id":38690912},{"id":41424931},{"id":41934304},{"id":43852589},{"id":44841743},{"id":46420232},{"id":47284562},{"id":50301021},{"id":53000580},{"id":53515575},{"id":55532598},{"id":56094458},{"id":56094615},{"id":56322435},{"id":57191197},{"id":57191659},{"id":57535355},{"id":57633641},{"id":57896301},{"id":57946136},{"id":58265013},{"id":58694452},{"id":59482109},{"id":59566667},{"id":60010369},{"id":60494314}],"created_at":"2023-01-19T17:04:44Z","updated_at":"2025-04-03T21:23:10Z","event_type":"TRIAL"}];

  doPost(e); // Call your doPost function
}

function getNextPageUrlFromLinkHeader(linkHeader) {
  if (!linkHeader) return null;

  // RFC 5988 format: <url>; rel="next", <url>; rel="last"
  const links = linkHeader.split(',');
  for (let i = 0; i < links.length; i++) {
    const match = links[i].match(/<([^>]+)>;\s*rel="next"/);
    if (match && match[1]) {
      return match[1].trim();
    }
  }
  return null;
}

function formatDateOnly(isoString) {
  if (!isoString) return '';
  const date = new Date(isoString);
  return Utilities.formatDate(date, Session.getScriptTimeZone(), 'yyyy-MM-dd');
}