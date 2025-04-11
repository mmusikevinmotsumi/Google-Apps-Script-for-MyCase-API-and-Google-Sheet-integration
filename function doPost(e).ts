function doPost(e) {
  const rawData = e.postData.contents;

  try {
    const parsedRawData = JSON.parse(JSON.parse(JSON.stringify(rawData)));
    const postDataString = parsedRawData[0].postData;
    const jsonData = JSON.parse(postDataString);

    if (!Array.isArray(jsonData)) {
      Logger.log("❌ Error: Data is not an array");
      return ContentService.createTextOutput("Error: Data is not an array");
    }

    // Target date for filtering
    const targetDate = "2025-04-18";

    // Get or create the original sheet
    const mainSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("MyCase Events") ||
                      SpreadsheetApp.getActiveSpreadsheet().insertSheet("MyCase Events");

    // Get or create the filtered sheet for targetDate
    const filteredSheetName = targetDate;
    const filteredSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(filteredSheetName) ||
                          SpreadsheetApp.getActiveSpreadsheet().insertSheet(filteredSheetName);

    // Headers
    const headers = [
      "ID", "Name", "Description", "Private", "All Day", "Start", "End", "Location", "Case ID", "Created at", "Updated at", "Event Type"
    ];

    // Add headers if sheet is empty
    if (mainSheet.getLastRow() === 0) mainSheet.appendRow(headers);
    if (filteredSheet.getLastRow() === 0) filteredSheet.appendRow(headers);

    jsonData.forEach(event => {
      const row = [
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
      ];

      // Append to main sheet (all events)
      mainSheet.appendRow(row);

      // If event matches target date for both start and end, append to filtered sheet
      const eventStartDate = event.start?.split("T")[0];  // Extract date from datetime
      const eventEndDate = event.end?.split("T")[0];

      if (eventStartDate === targetDate && eventEndDate === targetDate) {
        filteredSheet.appendRow(row);
      }
    });

    return ContentService.createTextOutput("Success");
  } catch (err) {
    Logger.log("❌ Error parsing data: " + err.message);
    return ContentService.createTextOutput("Error: " + err.message);
  }
}
