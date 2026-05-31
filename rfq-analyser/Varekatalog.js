// ─── SERVER-SIDE: felter til AI-prompt ───────────────────────────────────────

const FIELDS = [
  {key:"company",          label:"Virksomhedsnavn"},
  {key:"companyAddress",   label:"Virksomhedens adresse"},
  {key:"deliveryAddr",     label:"Vareindleveringsadresse"},
  {key:"cvr",              label:"CVR nr."},
  {key:"contactName",      label:"Kontaktperson navn"},
  {key:"contactPhone",     label:"Kontaktperson tlf."},
  {key:"contactEmail",     label:"Kontaktperson e-mail"},
  {key:"onsiteName",       label:"On-site kontaktperson navn"},
  {key:"onsitePhone",      label:"On-site kontaktperson tlf."},
  {key:"onsiteEmail",      label:"On-site kontaktperson e-mail"},
  {key:"eventType",        label:"Arrangementtype"},
  {key:"eventDate",        label:"Event-dato(er)"},
  {key:"venue",            label:"Lokation / venue"},
  {key:"guestCount",       label:"Antal gæster"},
  {key:"indoorOutdoor",    label:"Indendørs / udendørs"},
  {key:"furnitureItems",   label:"Ønsket møblement"},
  {key:"quantity",         label:"Antal pr. møbel"},
  {key:"styleTheme",       label:"Stil / tema"},
  {key:"colourPref",       label:"Farvepræference"},
  {key:"budget",           label:"Budget"},
  {key:"decisionDate",     label:"Beslutningsfrist"},
  {key:"setupTeardown",    label:"Opsætning & Nedtagning"},
  {key:"selfSetup",        label:"Kunden opstiller selv"},
  {key:"deliveryDate",     label:"Leveringsdato og nedtagningsdato"},
  {key:"deliveryInterval", label:"Tidsintervaller for levering og nedtagning"},
  {key:"productSuggestions", label:"Foreslåede produkter fra kataloget"},
];

// ─── SERVER-SIDE: lokalt lager i København ────────────────────────────────────

const LOCAL_STOCK = "1007,1040,1122,1123,1133,1193,2005,2037,2039,2054,2056,2085,2167,2185,2186,2303,2604,2613,2615,2617,2624,2626,2635,2653,2655,2658,4302,4610,4611,4628,4646,4647,4648,5092,5815,5824,5825,6015,6016,6017,6018,6581,6582,60231,60233,60235,60237,192037,192084,192518,192519,192520,192536,192537,192538,192539,192641,192642,192655,192658,192668,194066,194086,194090,194091,194092,194093,194094,194095,194096,194766,194772,194782,194783,194784,195713,195714,195715,195716,195717,195718,195719,1960231,1960233,1960237,1960309,1960520,1960521";

// ─── SERVER-SIDE: tekstkatalog til AI-prompt ─────────────────────────────────

const CATALOGUE = `STOLE (Dinner & Conference):
HAY About A Chair White/Oak Art.70491 DKK 207
HAY About A Chair Black/Oak Art.70491 DKK 207
HAY About A Chair Swivel Black/pepper-salt Art.4628 DKK 271
DSW Eames Chair White/Maple Art.70251 DKK 165
DSW Eames Chair Mustard/Maple Art.70252 DKK 165
DSW Eames Chair Mustard/Maple Art.70253 DKK 165
DSW Eames Chair SeaBlue/Maple Art.70289 DKK 165
HAY Hee Dining Chair Black Art.4647 DKK 123
Panton Design Chair White Art.2167 DKK 145
Crossback Chair Whitewash Art.2037 DKK 96
PRDK Industrial Chair Black Art.194766 DKK 162
PRDK Industrial Stool Black Art.194772 DKK 105
Alanya Bistro Chair Chrome Art.1040 DKK 49
Folding Chair with Cushion White Art.wm1123 DKK (pris mangler)
Chiavari Chair with Cushion White Art.wm1115 DKK (pris mangler)
Skool Chair Wood/Black Art.2039 DKK 71
Chairik Model 107 Black/Chrome Art.4611 DKK 81
Chairik Model 107 White/Chrome Art.4610 DKK 81
Chairik Model 107 with cushion Black Art.70354 DKK 101
Chairik Model 107 with cushion White Art.70351 DKK 101
Nancy Design Chair White Art.2185 DKK 67
Nancy Design Chair Black Art.2186 DKK 67
Folding Chair Black/Metal Art.1007 DKK 20
Dallas Upholstered Chair Black/Metal Art.2005 DKK 52
Linda Chair Black/Chrome Art.wm1104 DKK (pris mangler)

BARSTOLE:
HAY About A Stool White/Oak Art.71150 DKK 266
HAY About A Stool White/Oak Art.71151 DKK 266
HAY About A Stool White/Black Art.71152 DKK 266
HAY About A Stool Black/Black Art.71153 DKK 266
Padova Bar Stool Leather white Art.2054 DKK 200
Padova Bar Stool Leather black Art.2056 DKK 200
Pedrali Kuadra Barstool White/Chrome Art.192084 DKK 142
Bonello Barstool White Art.2085 DKK 98
PRDK Industrial Barstool White Art.194783 DKK 172
PRDK Industrial Barstool Black Art.194782 DKK 172
PRDK Industrial Barstool Grey Art.194784 DKK 172
PRDK Upholstered Barstool Cognac/Black Art.192086 DKK (pris mangler)
Skool Barstool Wood/Black Art.192037 DKK 159
Lem Adjustable Barstool White/Chrome Art.71061 DKK 244
HEE Barstool Black Art.4648 DKK 167

HØJE BORDE & BARBORDE:
Bristol Bornholm High Table Wood/Black W160xD80xH110 Art.60702 DKK 907
Bristol Bornholm High Table Wood/Chrome W160xD80xH110 Art.60181 DKK 793
Sylt High Table Oak/Chrome W160xD80xH110 Art.1960192 DKK 705
Sylt High Table Oak/Chrome W160xD80xH110 Art.1960772 DKK 793
Kranich High Table White/Black Ø160 Art.60627 DKK 1069
St. Tropez Bridge Table White W180xD70xH108 Art.60042 DKK 848
St. Tropez Bridge Table White W70xD70xH108 Art.60045 DKK 508
Marseille Bridge Table Black W180xD70xH108 Art.60062 DKK 991
BRIO High Table Black Ø60 Art.60241 DKK 316
BRIO High Table White Ø60 Art.60235 DKK 316
PRDK Bar Table Black Ø60 Art.192588 DKK 166
PRDK High Table Black Ø70 Art.192589 DKK 166
Ibiza High Table White/Chrome Ø80 Art.60074 DKK 283
Ibiza High Table White/Chrome W80xD80 Art.60076 DKK 306
Helsinki Bar Table White Ø80 Art.1133 DKK 113
Helsinki Bar Table w.Cover White Art.1133+2671 DKK 315
Bornholm Bar Table Wood/Chrome W80xD80 Art.60183 DKK 394
Sylt Bar Table Oak/Chrome W80xD80 Art.60194 DKK 345
Kubus Bar Table White W45xD45 Art.192655 DKK 350
Kubus Bar Table White W45xD45 Art.2658 DKK 365
Kubus Bar Table Black W40xD40 Art.192658 DKK 340
Kubus Bar Table Grey W40xD40 Art.192668 DKK 340
Kubus Bar Table Brown W40xD40 Art.2655 DKK 365
Kubus LED Bar Table White+LED Art.2604 DKK 740
Kubus Bornholm Bar Table Wood Art.6582 DKK 483

SPISE- & BISTROBORDE:
Bristol Bornholm Dinner Table Wood/Black W160xD80xH78 Art.60701 DKK 848
Bornholm Dinner Table Wood/Chrome W160xD80xH78 Art.60180 DKK 759
Sylt Dinner Table Oak/Chrome W160xD80xH78 Art.1960191 DKK 670
Bristol Sylt Dinner Table Oak/Black W160xD80xH78 Art.1960771 DKK 759
St. Tropez Bridge Table White W180xD70xH76 Art.60041 DKK 809
Astana Dinner Table Black W160xD80xH73 Art.191377 DKK 312
Astana Dinner Table Black W70xD70xH73 Art.191378 DKK 246
PRDK Nordisk Dinner Table Black Ø110 Art.1960236 DKK 624
PRDK Nordisk Dinner Table White Ø110 Art.1960238 DKK 624
Kranich Dinner Table White/Black Ø160 Art.60628 DKK 922
Round Dinner Table Wood Ø150 Art.1122 DKK 118
Round Dinner Table Wood Ø180 Art.1123 DKK 177
Nordisk Bistro Table Black Ø60 Art.1960309 DKK 229
Nordisk Bistro Table White Ø60 Art.1960233 DKK 204
BRIO Bistro Table White Ø60 Art.60233 DKK 246
Berliner Table Black W220xD67xH76 Art.1960520 DKK 144
Berliner Bench Black W220xD36xH43 Art.1960521 DKK 38
Bench Table Black W180xD70xH76 Art.wm1025 DKK 144

LOUNGEBORDE og side tables:
Wooden Cube Lounge Table White/Black Art.2656 DKK 227
Wooden Cube Lounge Table Sylt/Black Art.5092 DKK 276
Wooden Cube Lounge Table Bornholm/Black Art.6581 DKK 315
Wooden Cube Lounge Table Dark Wood Art.2653 DKK 226
Tree Trunk Lounge Table Ø40 Art.4302 DKK 409
Nordic Touch Lounge Table Black/Grey Ø54 Art.1971567 DKK (pris mangler)
Nordic Touch Lounge Table Black/Grey Ø72 Art.1971568 DKK (pris mangler)
HAY Tray Table Black W40xD40 Art.72091 DKK 271
HAY Tray Table Black W60xD60 Art.72096 DKK 394
ST. Tropez Lounge Table White W70xD70xH45 Art.60043 DKK 449
ST. Tropez Lounge Table White W180xD70xH45 Art.60040 DKK 789
BRIO Lounge Table White Ø60 Art.60231 DKK 217
BRIO Lounge Table Black Ø60 Art.60237 DKK 227
PRDK Lounge Table Black Ø60 Art.1960237 DKK 198
PRDK Lounge Table White Ø60 Art.1960231 DKK 198

LOUNGEMØBLER - LÆNESTOLE & SOFAER:
HAY About A Lounge Chair Grey/Oak Art.71580 DKK 1316
HAY About A Lounge Chair Grey/Black Art.71581 DKK 1316
HAY About A Lounge Chair Petrol/Oak Art.71582 DKK 1316
HAY About A Lounge Chair Petrol/Black Art.71583 DKK 1316
HAY About A Lounge Chair Swivel Red/Black Art.71585 DKK 1755
HAY About A Lounge Chair Swivel Curry/Black Art.71584 DKK 1755
HAY About A Lounge Sofa Grey/Black W150 Art.71565 DKK 2351
HAY About A Lounge Sofa Grey/Black W150 Art.71566 DKK 2351
The Egg Lounge Chair White Yacht Leather Art.4322 DKK 3401
The Egg Lounge Chair Black Yacht Leather Art.4323 DKK 3401
The Egg Lounge Chair Beige Yacht Leather Art.4321 DKK 3401
The Swan Lounge Chair White Yacht Leather Art.3996 DKK 2218
The Swan Lounge Chair Black Yacht Leather Art.3997 DKK 2218
The Swan Lounge Chair Beige Yacht Leather Art.3995 DKK 2218
Nordic Touch Lounge Chair Grey/Black Art.1971564 DKK 726
Nordic Touch Lounge Sofa Grey/Black W125 Art.1971565 DKK 1227
Freistil 173 Lounge Chair Navy Blue Art.4983 DKK 779
Heelack Lounge Chair Black Art.4646 DKK 419
Hollywood Settee 2-seater White Art.2624 DKK 1085
Hollywood Sofa 2-seater White Art.2635 DKK 1518
Hollywood Corner Element White Art.2626 DKK 917
Hollywood Lounge Cube White Art.2613 DKK 217
Hollywood Lounge Stool White Art.2615 DKK 434
Hollywood Lounge Stool 2-seater White Art.2617 DKK 592
Ontario 2-seater Settee Grey Art.5824 DKK 1302
Ontario Corner Armchair Grey Art.5825 DKK 1085
Ontario Lounge Cube Grey Art.5815 DKK 483
Soft Peak Beanbag Twist Charcoal Art.192641 DKK 621
Soft Peak Beanbag Sand Grey Art.192642 DKK 621

Puffer:
Pouf Mochi Deep Blue Ø70 Art.192539 DKK 600
Pouf Mochi Light Blue Ø70 Art.192538 DKK 600
Pouf Mochi Light Grey Ø70 Art.192537 DKK 600
Pouf Mochi Characol Black Ø70 Art.192536 DKK 600
Leather Pouf Grey Art.192518 DKK 739
Leather Pouf Cognac Art.192520 DKK 739
Leather Pouf Olive Green Art.192519 DKK 739

UDENDØRS LOUNGE:
Net Relax Chair Ocean Art.6015 DKK 91
Net Relax Chair Taupe Art.6016 DKK 91
Net Relax Chair Mustard Art.6017 DKK 91
Net Relax Chair Coral Red Art.6018 DKK 91
Komodo Arm Chair Taupe Art.71246 DKK 690
Komodo 2-seater Taupe Art.71247 DKK 1217
Komodo 3-seater Taupe Art.71248 DKK 1745
Komodo 5-seater L-shape Taupe Art.71249 DKK 2997
Komodo Lounge Table Taupe Art.71250 DKK 463
Granada Lounge Chair Black/Creme Art.71212 DKK 695
Granada Lounge Sofa Black/Creme Art.71214 DKK 1380
Granada Lounge Table Black/Glass Art.71215 DKK 976

BAR & RECEPTION:
Bornholm Bar W200xD70xH95 Art.72208 DKK 2810
Bornholm Bar with Front W200xD83xH215 Art.72210 DKK 4191
Bar/Buffet Black/Steel W200xD70xH95 Art.72691 DKK 2307
Bar/Buffet White/Grey W200xD70xH95 Art.72106 DKK 1972
Bar/Buffet White/Steel W200xD70xH95 Art.72206 DKK 1972
Buffet Bar White with LED W200xD70xH95 Art.72351 DKK 3066
Nordic Counter Bar Black W122xD48xH110 Art.9010 DKK 450
St. Tropez High Counter White W180xD70xH108 Art.60047 DKK 1099
St. Tropez High Counter White W70xD70xH108 Art.60039 DKK 680
Plano Info Counter White W120xD60xH90 Art.2303 DKK 1725

GULVTÆPPER:
Carpet Burnt Curry W200xD300 Art.194091 DKK 807
Carpet Silky White W200xD300 Art.194092 DKK 807
Carpet Dark Grey W200xD300 Art.194090 DKK 807
Carpet Dark Blue W200xD300 Art.194093 DKK 807
Carpet Light Grey W200xD300 Art.194086 DKK 807
Carpet Bordeaux W200xD300 Art.194095 DKK 807
Carpet Persian Pattern W200xD300 Art.194096 DKK 807
Carpet Moss Green W200xD300 Art.194094 DKK 807
Carpet Artificial Grass Ø6m Art.194066 DKK 1099
Carpet Tile Anthracite W100xD100 Art.1193 DKK 35

PUDER:
Pillow Dark Blue Art.195717 DKK 44
Pillow Red Art.195714 DKK 44
Pillow Petroleum Art.195715 DKK 44
Pillow Cream White Art.195719 DKK 44
Pillow Curry Art.195718 DKK 44
Pillow Yellow Art.195713 DKK 44
Pillow Forrest Green Art.195716 DKK 44`;

// ─── CLIENT-SIDE: feltdefinitioner til UI (injiceres via doGet) ───────────────

const UI_FIELD_DEFS = [
  {
    key:"_company", label:{da:"Virksomhed",en:"Company"},
    grouped:[
      {key:"company",        subLabel:{da:"Virksomhedsnavn",en:"Company name"}},
      {key:"companyAddress", subLabel:{da:"Adresse",en:"Address"}},
      {key:"cvr",            subLabel:{da:"CVR nr.",en:"CVR no."}},
    ]
  },
  {
    key:"_contact", label:{da:"Kontaktperson",en:"Contact person"},
    grouped:[
      {key:"contactName",  subLabel:{da:"Navn",en:"Name"}},
      {key:"contactPhone", subLabel:{da:"Tlf.",en:"Phone"}},
      {key:"contactEmail", subLabel:{da:"E-mail",en:"Email"}},
    ]
  },
  {
    key:"_onsite", label:{da:"On-site kontaktperson",en:"On-site contact"},
    grouped:[
      {key:"onsiteName",  subLabel:{da:"Navn",en:"Name"}},
      {key:"onsitePhone", subLabel:{da:"Tlf.",en:"Phone"}},
      {key:"onsiteEmail", subLabel:{da:"E-mail",en:"Email"}},
    ]
  },
  {
    key:"_venueGroup", label:{da:"Lokation / Venue",en:"Location / Venue"},
    grouped:[
      {key:"venue",        subLabel:{da:"Venue",en:"Venue"}},
      {key:"deliveryAddr", subLabel:{da:"Leveringsadresse",en:"Delivery address"}},
    ]
  },
  {key:"eventType",        label:{da:"Arrangementtype",en:"Event type"}},
  {key:"eventDate",        label:{da:"Event-dato(er)",en:"Event date(s)"}},
  {key:"guestCount",       label:{da:"Antal gæster",en:"No. of guests"}},
  {key:"indoorOutdoor",    label:{da:"Indendørs / udendørs",en:"Indoor / outdoor"}},
  {key:"furnitureItems",   label:{da:"Ønsket møblement",en:"Desired furniture"}},
  {key:"quantity",         label:{da:"Antal pr. lounge-møbel",en:"Qty per lounge piece"}},
  {key:"styleTheme",       label:{da:"Stil / tema",en:"Style / theme"}},
  {key:"colourPref",       label:{da:"Farvepræference",en:"Colour preference"}},
  {key:"budget",           label:{da:"Budget",en:"Budget"}},
  {key:"decisionDate",     label:{da:"Beslutningsfrist",en:"Decision deadline"}},
  {key:"setupTeardown",    label:{da:"Opsætning & Nedtagning",en:"Setup & Teardown"}},
  {key:"deliveryDate",     label:{da:"Leveringsdato & nedtagningsdato",en:"Delivery & collection date"},           conditional:"selfSetup"},
  {key:"deliveryInterval", label:{da:"Tidsintervaller for levering & nedtagning",en:"Time windows for delivery & collection"}, conditional:"selfSetup"},
  {key:"productSuggestions", label:{da:"Foreslåede produkter fra kataloget",en:"Suggested products from catalogue"}},
  {key:"catalogueComments",  label:{da:"Kommentarer",en:"Comments"}},
];

// ─── CLIENT-SIDE: produktdata til beregninger (injiceres via doGet) ───────────
// Felter: p=pris, s=lagerantal, w=vægt(kg), v=volumen(m³), c=custom-flag

const UI_PRODUCT_DATA = {
  "1007":{p:20,s:678,w:3.14,v:0.0165,c:0},"2005":{p:52,s:524,w:4.6,v:0.0685,c:0},
  "2085":{p:98,s:346,w:6.6,v:0.0691,c:0},"2185":{p:67,s:304,w:5.0,v:0.07,c:0},
  "192037":{p:159,s:232,w:5.0,v:0.09,c:0},"2039":{p:71,s:218,w:4.0,v:0.0576,c:0},
  "194784":{p:173,s:160,w:7.0,v:0.07,c:0},"2037":{p:96,s:149,w:4.5,v:0.15,c:0},
  "194782":{p:173,s:140,w:7.0,v:0.07,c:0},"1133":{p:113,s:103,w:13.0,v:0.22,c:0},
  "194766":{p:139,s:97,w:10.0,v:0.139,c:0},"192084":{p:142,s:92,w:6.6,v:0.0691,c:0},
  "4610":{p:81,s:75,w:5.3,v:0.035,c:0},"4647":{p:123,s:66,w:6.5,v:0.05,c:0},
  "1040":{p:49,s:53,w:2.9,v:0.0926,c:0},"1960521":{p:38,s:46,w:19.7,v:0.22,c:0},
  "194772":{p:99,s:41,w:7.0,v:0.06,c:0},"4611":{p:81,s:40,w:5.3,v:0.035,c:0},
  "2167":{p:145,s:39,w:5.0,v:0.07,c:0},"1960520":{p:144,s:39,w:31.0,v:0.44,c:0},
  "5824":{p:1302,s:37,w:21.0,v:0.65,c:0},"2056":{p:200,s:35,w:8.0,v:0.12,c:0},
  "2624":{p:1085,s:33,w:21.0,v:0.65,c:0},"194095":{p:807,s:33,w:16.0,v:0.35,c:0},
  "1960233":{p:204,s:30,w:17.0,v:0.225,c:0},"192539":{p:600,s:30,w:10.0,v:0.4,c:0},
  "4648":{p:168,s:26,w:8.5,v:0.075,c:0},"1960309":{p:230,s:26,w:17.0,v:0.225,c:0},
  "192536":{p:600,s:26,w:10.0,v:0.4,c:0},"1122":{p:118,s:23,w:22.0,v:0.2215,c:0},
  "1123":{p:177,s:23,w:32.5,v:0.288,c:0},"192537":{p:600,s:20,w:10.0,v:0.4,c:0},
  "2054":{p:200,s:19,w:8.0,v:0.12,c:0},"192538":{p:600,s:19,w:10.0,v:0.4,c:0},
  "195717":{p:44,s:19,w:0.1,v:0,c:0},"6015":{p:91,s:18,w:5.0,v:0.12,c:0},
  "6017":{p:91,s:18,w:5.0,v:0.12,c:0},"2617":{p:592,s:18,w:16.0,v:0.4,c:0},
  "1960237":{p:198,s:18,w:15.0,v:0.2,c:0},"1193":{p:35,s:17,w:5.06,v:0.0288,c:0},
  "6018":{p:91,s:16,w:5.0,v:0.12,c:0},"1960231":{p:198,s:16,w:15.0,v:0.2,c:0},
  "195714":{p:44,s:16,w:0.1,v:0,c:0},"195718":{p:44,s:16,w:0.1,v:0,c:0},
  "195719":{p:44,s:16,w:0.1,v:0,c:0},"6582":{p:483,s:15,w:22.0,v:0.2,c:0},
  "195716":{p:44,s:15,w:0.1,v:0,c:0},"194091":{p:807,s:14,w:16.0,v:0.35,c:0},
  "195715":{p:44,s:14,w:0.1,v:0,c:0},"4628":{p:271,s:12,w:15.0,v:0.55,c:0},
  "6016":{p:91,s:11,w:5.0,v:0.12,c:0},"2653":{p:227,s:11,w:8.0,v:0.08,c:0},
  "4646":{p:419,s:11,w:12.0,v:0.125,c:0},"192518":{p:740,s:10,w:16.0,v:0.35,c:0},
  "195713":{p:44,s:10,w:0.1,v:0,c:0},"2186":{p:67,s:9,w:5.0,v:0.07,c:0},
  "2635":{p:1518,s:9,w:36.0,v:0.75,c:0},"192520":{p:740,s:9,w:16.0,v:0.35,c:0},
  "192642":{p:621,s:9,w:7.46,v:0.48,c:0},"5825":{p:1085,s:8,w:19.0,v:0.5,c:0},
  "60237":{p:227,s:8,w:14.0,v:0.2,c:0},"192655":{p:350,s:8,w:17.5,v:0.2,c:0},
  "192519":{p:740,s:8,w:16.0,v:0.35,c:0},"2615":{p:434,s:7,w:13.0,v:0.3,c:0},
  "2613":{p:217,s:6,w:6.5,v:0.15,c:0},"2655":{p:365,s:6,w:17.5,v:0.2,c:0},
  "5092":{p:276,s:6,w:6.0,v:0.08,c:0},"192658":{p:340,s:6,w:17.5,v:0.2,c:0},
  "194783":{p:173,s:6,w:7.0,v:0.07,c:0},"60235":{p:316,s:5,w:18.0,v:0.3,c:0},
  "194092":{p:807,s:5,w:16.0,v:0.35,c:0},"194096":{p:807,s:5,w:16.0,v:0.35,c:0},
  "4302":{p:409,s:4,w:20.0,v:0.12,c:0},"60231":{p:217,s:4,w:14.0,v:0.2,c:0},
  "192668":{p:340,s:4,w:17.5,v:0.2,c:0},"192641":{p:621,s:4,w:7.46,v:0.48,c:0},
  "2626":{p:917,s:3,w:19.0,v:0.5,c:0},"6581":{p:316,s:3,w:12.0,v:0.08,c:0},
  "194066":{p:1099,s:3,w:65.55,v:1.12,c:0},"2303":{p:1726,s:2,w:50.0,v:1.2,c:0},
  "2604":{p:740,s:2,w:18.0,v:0.2,c:0},"2658":{p:365,s:2,w:17.5,v:0.2,c:0},
  "60233":{p:246,s:2,w:16.0,v:0.225,c:0},"194090":{p:807,s:2,w:16.0,v:0.35,c:0},
  "194093":{p:807,s:2,w:16.0,v:0.35,c:0},"194094":{p:807,s:2,w:16.0,v:0.35,c:0},
  "5815":{p:483,s:1,w:16.0,v:0.3,c:0},"194086":{p:807,s:1,w:16.0,v:0.35,c:0},
  "72106":{p:1972,s:0,w:0,v:0,c:0},"72206":{p:1972,s:0,w:0,v:0,c:0},
  "72208":{p:2810,s:0,w:0,v:0,c:0},"72210":{p:4190,s:0,w:0,v:0,c:0},
  "72691":{p:2307,s:0,w:0,v:0,c:0},"72351":{p:3066,s:0,w:0,v:0,c:0},
  "70251":{p:165,s:0,w:0,v:0,c:0},"70252":{p:165,s:0,w:0,v:0,c:0},
  "70253":{p:165,s:0,w:0,v:0,c:0},"70289":{p:173,s:0,w:0,v:0,c:0},
  "70351":{p:101,s:0,w:0,v:0,c:0},"70354":{p:101,s:0,w:0,v:0,c:0},
  "70491":{p:207,s:0,w:0,v:0,c:0},"71061":{p:244,s:0,w:0,v:0,c:0},
  "71150":{p:266,s:0,w:0,v:0,c:0},"71151":{p:266,s:0,w:0,v:0,c:0},
  "71152":{p:266,s:0,w:0,v:0,c:0},"71153":{p:266,s:0,w:0,v:0,c:0},
  "2656":{p:227,s:0,w:8.0,v:0.08,c:0},"3995":{p:2810,s:0,w:11.0,v:0.55,c:0},
  "3996":{p:2218,s:0,w:11.0,v:0.55,c:0},"3997":{p:2218,s:0,w:11.0,v:0.55,c:0},
  "4321":{p:3698,s:0,w:21.0,v:0.9,c:0},"4322":{p:3402,s:0,w:21.0,v:0.9,c:0},
  "4323":{p:3402,s:0,w:21.0,v:0.9,c:0},"4983":{p:779,s:0,w:19.0,v:0.5,c:0},
  "71212":{p:695,s:0,w:0,v:0,c:0},"71214":{p:1380,s:0,w:0,v:0,c:0},
  "71215":{p:976,s:0,w:0,v:0,c:0},"71246":{p:690,s:0,w:0,v:0,c:0},
  "71247":{p:1218,s:0,w:0,v:0,c:0},"71248":{p:1745,s:0,w:0,v:0,c:0},
  "71249":{p:2997,s:0,w:0,v:0,c:0},"71250":{p:463,s:0,w:0,v:0,c:0},
  "71565":{p:2352,s:0,w:0,v:0,c:0},"71566":{p:2352,s:0,w:0,v:0,c:0},
  "71580":{p:1316,s:0,w:0,v:0,c:0},"71581":{p:1316,s:0,w:0,v:0,c:0},
  "71582":{p:1316,s:0,w:0,v:0,c:0},"71583":{p:1316,s:0,w:0,v:0,c:0},
  "71584":{p:1755,s:0,w:0,v:0,c:0},"71585":{p:1755,s:0,w:0,v:0,c:0},
  "72091":{p:271,s:0,w:0,v:0,c:0},"72096":{p:394,s:0,w:0,v:0,c:0},
  "60039":{p:680,s:0,w:0,v:0,c:0},"60040":{p:789,s:0,w:0,v:0,c:0},
  "60041":{p:809,s:0,w:0,v:0,c:0},"60042":{p:848,s:0,w:0,v:0,c:0},
  "60043":{p:449,s:0,w:0,v:0,c:0},"60045":{p:508,s:0,w:0,v:0,c:0},
  "60047":{p:1099,s:0,w:0,v:0,c:0},"60062":{p:991,s:0,w:0,v:0,c:0},
  "60074":{p:283,s:0,w:0,v:0,c:0},"60076":{p:306,s:0,w:0,v:0,c:0},
  "60180":{p:759,s:0,w:0,v:0,c:0},"60181":{p:794,s:0,w:0,v:0,c:0},
  "60183":{p:394,s:0,w:0,v:0,c:0},"60194":{p:345,s:0,w:0,v:0,c:0},
  "60241":{p:316,s:0,w:18.0,v:0.3,c:0},"60627":{p:1070,s:0,w:0,v:0,c:0},
  "60628":{p:922,s:0,w:0,v:0,c:0},"60701":{p:848,s:0,w:0,v:0,c:0},
  "60702":{p:907,s:0,w:0,v:0,c:0},"191377":{p:312,s:0,w:0,v:0,c:0},
  "191378":{p:246,s:0,w:0,v:0,c:0},"192588":{p:167,s:0,w:0,v:0,c:0},
  "192589":{p:167,s:0,w:0,v:0,c:0},"1960191":{p:670,s:0,w:0,v:0,c:0},
  "1960192":{p:705,s:0,w:0,v:0,c:0},"1960236":{p:624,s:0,w:0,v:0,c:0},
  "1960238":{p:624,s:0,w:0,v:0,c:0},"1960771":{p:759,s:0,w:0,v:0,c:0},
  "1960772":{p:818,s:0,w:0,v:0,c:0},"1971564":{p:726,s:0,w:0,v:0,c:0},
  "1971565":{p:1227,s:0,w:0,v:0,c:0}
};
