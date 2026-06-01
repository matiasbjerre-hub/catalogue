const APP_VERSION = "84";


function doGet(e) {
  var mode = (e && e.parameter && e.parameter.mode) ? e.parameter.mode : "";
  const tmpl = HtmlService.createTemplateFromFile("Index");
  tmpl.appVersion = APP_VERSION;
  tmpl.fieldDefsJson = JSON.stringify(UI_FIELD_DEFS);
  tmpl.productDataJson = JSON.stringify(UI_PRODUCT_DATA);
  tmpl.mode = mode;
  return tmpl.evaluate()
    .setTitle("RFQ Analyser — Rent.Group")
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function analyseEmail(emailText, mode, lang, cartItems) {
  mode = mode || "";
  lang = lang || "da";
  var originalEmail = emailText;
  if (cartItems) {
    try {
      var parsedCart = JSON.parse(cartItems);
      if (parsedCart && parsedCart.length) {
        emailText = emailText + "\n\n[Kurv paa webshoppen: " + parsedCart.map(function(x){ return (x.qty||1)+"x "+(x.name||"")+" Art."+(x.art||"?"); }).join(", ") + "]";
      }
    } catch(e2) {}
  }
  const fieldList = FIELDS.map(function(f){ return f.key + ": " + f.label; }).join("\n");


  const extractPayload = {
    model: "claude-opus-4-7",
    max_tokens: 5000,
    system: "Du er assistent for Rent.Group København, der udlejer møbler til events. Udtræk information fra kunders tilbudsforespørgsler og returner KUN gyldig JSON. Ingen markdown, ingen forklaring.",
    messages: [{
      role: "user",
      content: "Nedenstaaende er en e-mail-traad. Gennemlaes ALLE beskeder og saml information paa tvaers af dem alle. Returner vaerdien hvis den findes et eller andet sted i traaden, ellers null. Saet status til \"ok\" (klart angivet), \"partial\" (antydet/uklart) eller \"missing\" (ikke naevnt nogen steder i traaden).\n\nFelter:\n" + fieldList + "\n\nVigtige noter til felter:\n- selfSetup: saet til \"ja\" hvis kunden eksplicit skriver at de selv vil opstille og nedtage, ellers \"nej\"\n- deliveryDate og deliveryInterval: udfyld KUN hvis selfSetup er \"ja\"\n- eventDate: inkluder evt. tidsinterval for selve eventet (fx \"12.-13. juni, kl. 18-22\")\n- setupTeardown: beskriv dato(er) og tidsrum for Rent.Groups opsaetning og nedtagning\n- contactPhone og contactEmail: adskil telefon og e-mail i separate felter\n- onsiteName/onsitePhone/onsiteEmail: kontaktperson til stede ved opsaetning/nedtagning (kan vaere samme som contactName)\n\nBaseret paa kundens beskrivelse af arrangement, stil, farver og moebelonsker: foresla de mest relevante produkter fra dette katalog. Tilfoj anbefalede antal (x[antal]) til hvert produkt baseret paa gaestetal og arrangementtype. Tommelfingerregler: stole ca antal gaester, dinnerborde ca gaester/8 (afrund op til naermeste 2), cocktailborde/barborde ca gaester/4 (afrund op til naermeste 2), loungemoebler ca gaester/8 (afrund op til naermeste 2), puffer ca gaester/10. Brug x0 hvis gaestetal er ukendt. VIGTIGT: Foresla ALDRIG barstole til et plenum, breakout-rum eller grupperum - kun almindelige stole. Barstole maa KUN foreslaas hvis kunden eksplicit beder om barstole, eller til en bar/hoejbords-opstilling der udtrykkeligt er beskrevet i forespoergslen. Hvis kataloget ikke daekker behovet fuldt ud, angiv dette med notOutOfCatalogue: true. VIGTIGT for productSuggestions: Hvis kunden beskriver FLERE SEPARATE AKTIVITETER eller LOKALER (fx plenum, breakout, lounge, middag), SKAL du opdele produkterne i navngivne sektioner med dette format: [Dato: DD.MM|Lokale: LOKALE|Aktivitet: AKTIVITET]: Produktnavn Art.XXXXX x[antal], ...; [Dato: DD.MM|Lokale: LOKALE2|Aktivitet: AKTIVITET2]: Produktnavn Art.XXXXX x[antal], ... Hvis der kun er en aktivitet, returner en simpel kommasepareret liste. productSuggestions MA KUN indeholde produktlinjer med Art.nr - INGEN noter, OBS, anbefalinger eller fritekst uden Art.nr. Max 4 produkter pr. sektion. Skriv alle noter, OBS-punkter, anbefalinger og mangler i feltet catalogueComments.\n\nKATALOG:\n" + CATALOGUE + "\n\nReturner JSON praecis saadan:\n{\"fields\":{\"company\":{\"value\":\"...eller null\",\"status\":\"ok|partial|missing\"},...},\"clientFirstName\":\"...eller null\",\"eventDays\":1,\"productSuggestions\":\"Produktnavn Art.XXXXX x[antal], ...\",\"catalogueComments\":\"emne1-tekst - emne2-tekst eller null\",\"notOutOfCatalogue\":false}\n\ncatalogueComments MA KUN indeholde: (1) praktiske usikkerheder og forhold der skal afklares, og (2) begrundelser for specifikke produktvalg. Skriv IKKE oplysninger der allerede daekkes af andre felter. Hvert punkt handler om et samlet emne - saml ALT der vedroerer samme emne i et punkt. Separator \" - \" bruges KUN til at adskille fuldstaendig separate emner. Hvert punkt indledes med en kort titel efterfulgt af kolon. Ingen linjeskift.\n\neventDays er antallet af dage selve eventet varer (heltal >= 1). Tael KUN egentlige eventdage.\n\nE-mail-traad:\n" + emailText
    }]
  };

  const extractResp = callAnthropicAPI(extractPayload);
  const rawJson = extractResp.replace(/```json|```/g, "").trim();
  let parsed;
  try {
    parsed = JSON.parse(rawJson);
  } catch(e) {
    // Attempt to salvage by removing control characters and retrying
    const cleaned = rawJson.replace(/[\x00-\x1F\x7F]/g, " ");
    try { parsed = JSON.parse(cleaned); }
    catch(e2) { throw new Error("JSON-parsefejl fra AI: " + e.message + "\n\nRå svar (første 500 tegn):\n" + rawJson.substring(0, 500)); }
  }

  const missingLabels = FIELDS
    .filter(f => { const s = parsed.fields[f.key]?.status; return s === "missing" || s === "partial"; })
    .map(f => f.label);

  const firstName = parsed.clientFirstName || "der";
  const suggestions = parsed.productSuggestions || null;
  const catalogueComments = parsed.catalogueComments || null;
  if (suggestions) {
    parsed.fields["productSuggestions"] = { value: suggestions, status: "ok" };
  } else {
    parsed.fields["productSuggestions"] = { value: null, status: "missing" };
  }
  parsed.fields["catalogueComments"] = { value: catalogueComments, status: catalogueComments ? "ok" : "missing" };

  var emailReply = null;
  if (mode !== "web") {
    const emailPayload = {
      model: "claude-opus-4-7",
      max_tokens: 800,
      system: "Du skriver korte, venlige og professionelle e-mails for Rent.Group København, der udlejer møbler til events.",
      messages: [{
        role: "user",
        content: `Nedenstående er en e-mail-tråd mellem Rent.Group og kunden ${firstName}. Skriv DEN NÆSTE besked i tråden på SAMME SPROG som tråden er skrevet på. Undgå indledende fraser som "Tak for din henvendelse" eller "Vi har modtaget din forespørgsel" — det hører hjemme i en første henvendelse, ikke en igangværende dialog. Vær direkte og naturlig. Spørg ALDRIG om kundens e-mailadresse. Hvis virksomhedsnavn, CVR-nummer eller faktureringsadresse ikke fremgår af tråden, spørg i punktform om disse firmaoplysninger. Spørgsmålet vedrørende møbelbudgettet skal være en naturlig sætning — IKKE i punktlisten. Angiv aldrig estimerede priser eller beregn en samlet pris, medmindre kunden eksplicit beder om det. Spørgsmål til timing for opsætning skal stå som et punkt således "Dato og tidsrum for opsætning?" og spørgsmål til timing for nedtagning skal stå som et punkt således "Dato og tidsrum for nedtagning?" Beegreberne opsætning og nedtagning dækker over begreberne levering og afhentning, så spørg ikke også til levering og afhentning. Møbler fra lokalt katalog / webshop må IKKE nævnes som spørgsmål overhovedet — hverken i punktlisten eller som sætning. De øvrige manglende oplysninger stilles som en simpel punktliste med bindestreg uden fed tekst: ${missingLabels.filter(l => l !== "E-mail / telefon" && l !== "Møbler fra lokalt katalog / webshop" && l !== "Budget" && l !== "Antal pr. møbel" && l !== "Indendørs / udendørs").join(", ")}. Afslut e-mailen med denne sætning nøjagtigt som den er skrevet her: "Jeg har vedhæftet vores lokale katalog, så I kan vælge møbler herfra og dermed undgå fordyrende transport fra vores fjernlager.\nDu er naturligvis stadig velkommen til at vælge fra vores WEBSHOP_LINK." Underskriv som Rent.Group-teamet. Kun brødtekst, ingen emnelinje.\n\nE-mail-tråd:\n${emailText}`
      }]
    };
    emailReply = callAnthropicAPI(emailPayload);
  }
  const eventDays = (parsed.eventDays && parseInt(parsed.eventDays) >= 1) ? parseInt(parsed.eventDays) : 1;
  appendToSheet(originalEmail, lang, mode, parsed.productSuggestions || null, missingLabels.join(", "), cartItems || "");
  return JSON.stringify({ fields: parsed.fields, emailReply: emailReply, eventDays: eventDays });
}

function callAnthropicAPI(payload) {
  const key = PropertiesService.getScriptProperties().getProperty("ANTHROPIC_API_KEY");
  const options = {
    method: "post",
    contentType: "application/json",
    headers: { "x-api-key": key, "anthropic-version": "2023-06-01" },
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  };
  const response = UrlFetchApp.fetch("https://api.anthropic.com/v1/messages", options);
  const code = response.getResponseCode();
  const body = response.getContentText();
  if (code !== 200) throw new Error("API fejl " + code + ": " + body);
  const data = JSON.parse(body);
  return data.content.map(b => b.text || "").join("");
}
function extractPDFText(base64Data) {
  const blob = Utilities.newBlob(
    Utilities.base64Decode(base64Data),
    'application/pdf',
    'temp_rfq.pdf'
  );
  const file = DriveApp.createFile(blob);
  try {
    const docFile = Drive.Files.copy(
      {mimeType: 'application/vnd.google-apps.document'},
      file.getId()
    );
    try {
      const text = DocumentApp.openById(docFile.id).getBody().getText();
      return text;
    } finally {
      DriveApp.getFileById(docFile.id).setTrashed(true);
    }
  } finally {
    file.setTrashed(true);
  }
}

// ─── Fase 4: Sheet storage + daily digest ──────────────────────────────────
function setupStorage() {
  var props = PropertiesService.getScriptProperties();
  var sheetId = props.getProperty("RFQ_SHEET_ID");
  if (sheetId) return sheetId;
  var ss = SpreadsheetApp.create("RFQ Log — Rent.Group");
  var sheet = ss.getActiveSheet();
  sheet.setName("Forespørgsler");
  sheet.appendRow(["Tidsstempel","Sprog","Kilde","Forespørgsel","Møbelforslag","Manglende oplysninger","Kurv-indhold","Emailet"]);
  props.setProperty("RFQ_SHEET_ID", ss.getId());
  return ss.getId();
}

function appendToSheet(emailText, lang, mode, suggestions, missingInfo, cartContent) {
  try {
    var props = PropertiesService.getScriptProperties();
    var sheetId = props.getProperty("RFQ_SHEET_ID");
    if (!sheetId) sheetId = setupStorage();
    var sheet = SpreadsheetApp.openById(sheetId).getSheetByName("Forespørgsler");
    if (!sheet) return;
    sheet.appendRow([
      new Date(),
      lang || "da",
      mode === "web" ? "katalog" : "rfq",
      emailText ? String(emailText).substring(0, 500) : "",
      suggestions || "",
      missingInfo || "",
      cartContent || "",
      "nej"
    ]);
  } catch(eSheet) {
    // Non-critical — do not crash the main analysis flow
  }
}

function sendDailyDigest() {
  var props = PropertiesService.getScriptProperties();
  var sheetId = props.getProperty("RFQ_SHEET_ID");
  if (!sheetId) return;
  var sheet = SpreadsheetApp.openById(sheetId).getSheetByName("Forespørgsler");
  if (!sheet) return;
  var data = sheet.getDataRange().getValues();
  if (data.length < 2) return;
  var headers = data[0];
  var emailedCol = headers.indexOf("Emailet");
  if (emailedCol < 0) return;
  var pending = [];
  for (var i = 1; i < data.length; i++) {
    if (data[i][emailedCol] === "nej") pending.push({ row: i + 1, data: data[i] });
  }
  if (!pending.length) return;
  var body = "RFQ Digest — " + pending.length + " forespørgsel(er)\n\n";
  pending.forEach(function(p, idx) {
    body += "#" + (idx + 1) + " — " + p.data[0] + " (" + p.data[1] + ", " + p.data[2] + ")\n";
    body += "Forslag: " + (p.data[4] || "—") + "\n";
    body += "Mangler: " + (p.data[5] || "—") + "\n\n";
  });
  MailApp.sendEmail({
    to: "matiasbjerre@gmail.com",
    subject: "RFQ Daglig Digest — " + pending.length + " forespørgsel(er)",
    body: body
  });
  pending.forEach(function(p) {
    sheet.getRange(p.row, emailedCol + 1).setValue("ja");
  });
}

function setupTrigger() {
  ScriptApp.getProjectTriggers().forEach(function(trigger) {
    if (trigger.getHandlerFunction() === "sendDailyDigest") ScriptApp.deleteTrigger(trigger);
  });
  ScriptApp.newTrigger("sendDailyDigest")
    .timeBased()
    .atHour(7)
    .everyDays(1)
    .create();
}