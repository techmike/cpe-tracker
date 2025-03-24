function updateCPETracker() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const certSheet = ss.getSheetByName("Certifications");
  const eventSheet = ss.getSheetByName("CPE_Events");
  const catSheet = ss.getSheetByName("CPE_Categories");

  const certData = certSheet.getDataRange().getValues();
  const eventData = eventSheet.getDataRange().getValues();
  const catData = catSheet.getDataRange().getValues();

  const limits = {};
  for (let i = 1; i < catData.length; i++) {
    const key = catData[i][0].trim() + "-" + catData[i][1].trim();
    limits[key] = catData[i][2] === "No Limit" ? Infinity : Number(catData[i][2]);
  }

  for (let i = 1; i < certData.length; i++) {
    const cert = certData[i][0];
    const issuedDateRaw = certData[i][1];
    const issuedDate = issuedDateRaw ? new Date(issuedDateRaw) : null;
    const renewalType = (certData[i][15] || "").toLowerCase();
    const showOverage = (certData[i][12] || "").toLowerCase() === "yes";
    const today = new Date();

    // Handle PLANNED / NOT YET EARNED certs
    if (!issuedDate || issuedDate > today) {
      certSheet.getRange(i + 1, 7, 1, 9).setValues([[
        "Not Yet Earned", "Not Yet Earned", "Not Yet Earned",
        "Not Yet Earned", "Not Yet Earned", "Not Yet Earned",
        "", "", "Planned"
      ]]);
      continue;
    }

    // Handle Lifetime certs
    if (renewalType === "lifetime") {
      certSheet.getRange(i + 1, 7, 1, 9).setValues([[
        "N/A", "N/A", "N/A", "N/A", "N/A", "N/A", "", "", "Lifetime"
      ]]);
      continue;
    }

    // Handle Retake-only certs
    if (renewalType === "retake") {
      certSheet.getRange(i + 1, 7, 1, 6).setValues([
        ["Not Required", "Not Required", "Not Required", "Not Required", "Not Required", ""]
      ]);
      certSheet.getRange(i + 1, 15).setValue("✅ Retake Required");
      continue;
    }

    // Handle normal CPE-based certs
    const cycleStart = new Date(certData[i][3]);
    const cycleEnd = new Date(certData[i][2]);
    const cycleLength = Number(certData[i][4]) || 3;
    const cycleRequired = Number(certData[i][5]);

    const yearStart = new Date(certData[i][8]);
    const yearEnd = new Date(yearStart.getTime() + 365 * 24 * 60 * 60 * 1000);
    const yearRequired = Math.ceil(cycleRequired / cycleLength);

    let earnedCycle = 0;
    let earnedYear = 0;
    let queuedEvents = 0;
    let missingProof = false;
    const catTotals = {};

    for (let j = 1; j < eventData.length; j++) {
      const eventDate = new Date(eventData[j][0]);
      const cpes = Number(eventData[j][2]);
      const certs = eventData[j][3].split(",").map(c => c.trim());
      const category = eventData[j][4].trim();
      const status = (eventData[j][9] || "").toLowerCase();
      const uploadedProofs = (eventData[j][10] || "").split(",").map(c => c.trim());

      if (!certs.includes(cert)) continue;

      if (status === "completed" && !uploadedProofs.includes(cert)) {
        missingProof = true;
      }

      if (status !== "completed") {
        queuedEvents++;
      }

      if (status !== "completed") continue;

      const catKey = cert + "-" + category;
      const current = catTotals[catKey] ?? 0;
      const limit = limits[catKey] ?? Infinity;

      let countableCPE = 0;
      if (showOverage || current < limit) {
        countableCPE = Math.min(cpes, limit - current);
        catTotals[catKey] = current + countableCPE;
      }

      if (eventDate >= cycleStart && eventDate <= cycleEnd) {
        earnedCycle += countableCPE;
      }

      if (eventDate >= yearStart && eventDate <= yearEnd) {
        earnedYear += cpes;
      }
    }

    const remainingCycle = Math.max(0, cycleRequired - earnedCycle);
    const remainingYear = Math.max(0, yearRequired - earnedYear);
    const proofFlag = missingProof ? "⚠️ Missing Proof" : "✅ All Proofs Uploaded";

    // Write back to Certifications sheet
    certSheet.getRange(i + 1, 7).setValue(earnedCycle);     // G
    certSheet.getRange(i + 1, 8).setValue(remainingCycle);  // H
    certSheet.getRange(i + 1, 10).setValue(yearRequired);   // J
    certSheet.getRange(i + 1, 11).setValue(earnedYear);     // K
    certSheet.getRange(i + 1, 12).setValue(remainingYear);  // L
    certSheet.getRange(i + 1, 14).setValue(queuedEvents);   // N
    certSheet.getRange(i + 1, 15).setValue(proofFlag);      // O
  }
}
