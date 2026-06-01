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
Hay About A Chair White/Oak Art.70491 DKK 207
Hay About A Chair Black/Oak Art.70492 DKK 207
Hay About A Chair Swivel Black/Pepper-Salt Art.4628 DKK 271
DSW Eames Chair White/Maple Art.70251 DKK 165
DSW Eames Chair Mustard/Maple Art.70252 DKK 165
DSW Eames Chair Sea Blue/Maple Art.70289 DKK 165
Hay Hee Dining Chair Black Art.4647 DKK 123
Skool Chair Wood/Black Art.2039 DKK 71
Alanya Bistro Chair Chrome Art.1040 DKK 49
Panton Design Chair White Art.2167 DKK 162
PRDK Industrial Chair Black Art.194766 DKK 145
PRDK Industrial Stool Black Art.194772 DKK 105
Crossback Chair Whitewash Art.2037 DKK 96
Folding Chair w. Cushion White/White Art.wm1123 DKK 26
Chiavari Chair w. Cushion White/White Art.wm1115 DKK 70
Chairik Model 107 Black/Chrome Art.4611 DKK 81
Chairik Model 107 White/Chrome Art.4610 DKK 81
Chairik Model 107 cushion Black/Chrome Art.70351 DKK 101
Chairik Model 107 cushion White/Chrome Art.70354 DKK 101
Nancy Design Chair White Art.2185 DKK 67
Nancy Design Chair Black Art.2186 DKK 67
Folding Chair Black/Metal Art.1007 DKK 20
Dallas Upholstered Chair Black/Metal Art.2005 DKK 52
Linda Chair Black/Chrome Art.wm1104 DKK 25
DSW Eames Chair Mustard/Maple Art.70253 DKK 165

BARSTOLE:
Padova Bar Stool Leather, White Art.2054 DKK 200
Padova Bar Stool Leather, Black Art.2056 DKK 200
Hay About A Stool White/Oak Art.71150 DKK 266
Hay About A Stool Black/Black Art.71153 DKK 266
Pedrali Kuadra Barstool White/Chrome Art.192084 DKK 142
Bonello Barstool White Art.2085 DKK 98
PRDK Industrial Barstool Metallic Grey Art.194782 DKK 172
PRDK Industrial Barstool Black Art.194784 DKK 172
PRDK Industrial Barstool White Art.194783 DKK 172
PRDK Upholstered Barstool Cognac/Black Art.192086 DKK 198
Skool Barstool Wood/Black Art.192037 DKK 159
Lem Adjustable Barstool White/Chrome Art.71061 DKK 244
Hee Barstool Black Art.4648 DKK 167
Hay About A Stool White/Oak (low) Art.71151 DKK 266
Hay About A Stool White/Black Art.71152 DKK 266

HØJE BORDE & BARBORDE:
Sylt High Table Oak/Chrome Art.1960192 DKK 705
Marseille High Bridge Table Black Art.60062 DKK 991
St. Tropez High Bridge Table White Art.60042 DKK 848
Bristol Bornholm High Table Wood/Black Art.60702 DKK 907
Bornholm High Table Wood/Chrome Art.60181 DKK 793
Kranich High Table White/Black Art.60627 DKK 1069
PRDK High Table Black Art.192588 DKK 166
Brio High Table Black Art.60241 DKK 316
Brio High Table White Art.60235 DKK 316
Standing Table Black Laminate Art.wm1008 DKK 142
Ibiza High Table White/Chrome Art.60074 DKK 283
Helsinki Bar Table + LED White + Colored LED Art.1133-LED DKK 623
Kubus Bar Table White Art.192655 DKK 350
Kubus Bar Table Black Art.192658 DKK 340
Kubus LED Bar Table White + LED Art.2604 DKK 740
Kubus Bornholm Piedestal Wood Art.6595 DKK 1627
Bristol Sylt High Table Oak/Chrome Art.1960772 DKK 793
St. Tropez Bridge Table (high) White Art.60045 DKK 508
PRDK High Table Black Art.192589 DKK 166
Bornholm Bar Table Wood/Chrome Art.60183 DKK 394
Sylt Bar Table Oak/Chrome Art.60194 DKK 345
Ibiza High Table White/Chrome Art.60076 DKK 306
Bar Table Wood Art.wm1027 DKK 79
Helsinki Bar Table White Art.1133 DKK 113
Helsinki Bar Table + Cover White Art.1133-COVER DKK 315
Kubus Bar Table White Art.2658 DKK 365
Kubus Bar Table Grey Art.192668 DKK 340
Kubus Bar Table Brown Art.2655 DKK 365
Kubus Bornholm Bar Table Wood Art.6582 DKK 483

SPISE- & BISTROBORDE:
Nordisk Bistro Table Black Art.1960309 DKK 229
Nordisk Bistro Table White Art.1960233 DKK 204
Brio Bistro Table White Art.60234 DKK 295
Bristol Bornholm Dinner Wood/Black Art.60701 DKK 848
Bornholm Dinner Table Wood/Chrome Art.60180 DKK 759
Sylt Dinner Table Oak/Chrome Art.1960191 DKK 670
St. Tropez Bridge Table White Art.60041 DKK 809
Astana 160 Dinner Black Art.191377 DKK 312
PRDK Nordisk Dinner Table White Art.1960238 DKK 624
Kranich Dinner Table White/Black Art.60628 DKK 922
Round Dinner Table Wood Art.1122 DKK 118
Round Dinner Table Wood Art.1123 DKK 177
Berliner Table & Bench Set Black Art.1960520-SET DKK 220
Bench Table Black Art.wm1025 DKK 144
Table Wood Art.1127 DKK 89
Folding Table, Plastic Grey Art.191127 DKK 88
Nordisk Bistro Table Black Art.60239 DKK 247
Brio Bistro Table White Art.60233 DKK 246
Nordisk Bistro Table White (square) Art.1960234 DKK 239
Nordisk Bistro Table Black (square) Art.1960240 DKK 239
PRDK Nordisk Dinner Table Black Art.1960236 DKK 624
Bristol Sylt Dinner Table Oak/Black Art.1960771 DKK 759
Astana 70 Dinner Black Art.191378 DKK 246
St. Tropez Bridge Table White (small) Art.60044 DKK 467
Lasa Bistro Table White/Chrome Art.191134 DKK 132
Lasa Bistro Table Black/Chrome Art.191135 DKK 132
Nikla Bistro Table White/Chrome Art.191112 DKK 148
Berliner Table Black Art.1960520 DKK 144
Berliner Bench Black Art.1960521 DKK 38
Bench Black Art.wm1026 DKK 38
Table Wood Art.1126 DKK 74
Adjustable Plastic Table White (large) Art.wm1030 DKK 150
Adjustable Plastic Table White (medium) Art.wm1031 DKK 115
Table Wood (large) Art.wm1043 DKK 450

LOUNGEBORDE og side tables:
Wooden Cube Lounge Table Bornholm/Black Art.6581 DKK 315
Wooden Cube Lounge Table Dark Wood/Black Art.2653 DKK 226
Wooden Cube Lounge Table White/Black Art.2656 DKK 227
Tree Trunk Lounge Table Wood Art.4302 DKK 409
LED Cube Lounge Table White/LED Art.192601 DKK 376
Komodo Lounge Table Taupe/Glass top Art.71250 DKK 463
Granada Lounge Table Black/Glass top Art.71215 DKK 976
R40 Side Table White Art.194608 DKK 156
R40 Side Table Black Art.194609 DKK 156
PRDK Side Table Navy Grey Art.1960250 DKK 252
Hay Tray Table Black Art.72091 DKK 271
Hay Tray Table Black Art.72096 DKK 394
St. Tropez Lounge Table White Art.60040 DKK 789
Brio Lounge Table White Art.60231 DKK 217
Wooden Cube Lounge Table Sylt/Black Art.5092 DKK 276
St. Tropez Lounge Table White Art.60043 DKK 449
Nordisk Lounge Table Black Art.1960237 DKK 198
Nordisk Lounge Table White Art.1960231 DKK 198
Nordisk Lounge Table Black Art.1960242 DKK 220
Nordisk Lounge Table White Art.1960232 DKK 220
Brio Lounge Table Black Art.60237 DKK 227
Brio Lounge Table White Art.60232 DKK 262

LOUNGEMØBLER - LÆNESTOLE & SOFAER:
Hay About A Lounge Chair Petrol/Oak Art.71582 DKK 1316
Hay About A Lounge Chair Grey/Black Art.71581 DKK 1316
Hay Lounge Chair Swivel Red/Black Art.71585 DKK 1316
Hay About A Lounge Chair Petrol/Black Art.71583 DKK 1316
Hay Lounge Chair Swivel Curry/Black Art.71584 DKK 1316
Hay About A Lounge Sofa Grey/Black Art.71565 DKK 2351
Arne Jacobsen The Egg White Yacht Leather Art.4322 DKK 3401
Arne Jacobsen The Egg Black Yacht Leather Art.4323 DKK 3401
Arne Jacobsen The Swan White Yacht Leather Art.3996 DKK 2218
Arne Jacobsen The Swan Black Yacht Leather Art.3997 DKK 2218
Arne Jacobsen The Swan Beige Yacht Leather Art.3995 DKK 2218
Heelack Lounge Chair Black Art.4646 DKK 419
Freistil 173 Lounge Chair Navy Blue Art.4983 DKK 779
Freistil 173 Lounge Chair Bordeaux Red Art.4986 DKK 779
Freistil 173 Lounge Chair Anthracite Grey Art.4987 DKK 779
Nordic Touch Lounge Sofa Grey/Black Art.1971565 DKK 1227
Nordic Touch Lounge Chair Grey/Black Art.1971564 DKK 726
Soft Peak Beanbag Sand Grey Art.192642 DKK 621
Soft Peak Beanbag Twist Charcoal Art.192641 DKK 621
Hollywood Sofa 2-seater White Art.2635 DKK 1518
Hollywood Settee 2-seater White Art.2624 DKK 1085
Hollywood Corner Element White Art.2626 DKK 917
Hollywood Lounge-Cube White Art.2613 DKK 217
Ontario 2-seater Settee Grey Art.5824 DKK 1302
Ontario Corner Armchair Grey Art.5825 DKK 1085
Ontario Lounge Triangle Grey Art.5811 DKK 542
Hay About A Lounge Chair Grey/Oak Art.71580 DKK 1316
Hay About A Lounge Sofa Grey/Black (alt) Art.71566 DKK 2351
Arne Jacobsen The Egg Beige Yacht Leather Art.4321 DKK 3401
Hollywood Lounge Stool White (2-seater) Art.2617 DKK 592
Hollywood Lounge Stool White (triangle) Art.2611 DKK 444
Hollywood Lounge Stool White Art.2615 DKK 434
Lounge-Bar Brown Art.2793 DKK 99
Hollywood Backrest White Art.2619 DKK 365

Puffer:
Pouf Mochi Deep Blue Art.192539 DKK 600
Pouf Mochi Light Blue Art.192538 DKK 600
Pouf Mochi Light Grey Art.192537 DKK 600
Pouf Mochi Charcoal Black Art.192536 DKK 600
Leather Pouf Grey Art.192518 DKK 650
Leather Pouf Cognac Art.192520 DKK 650
Leather Pouf Olive Green Art.192519 DKK 650
Lounge Stool Beige Art.6048 DKK (pris mangler)

UDENDØRS LOUNGE:
Net Relax Chair Ocean Art.6015 DKK 91
Net Relax Chair Taupe Art.6016 DKK 91
Net Relax Chair Mustard Art.6017 DKK 91
Net Relax Chair Coral Red Art.6018 DKK 91
Net Bench Ocean Art.6042 DKK 320
Net Bench Coral Red Art.6043 DKK 320
PRDK String Chair Petrol Art.192846 DKK 474
PRDK String Chair Beige Art.192847 DKK 474
PRDK String Chair White Art.192845 DKK 474
Komodo 5-Seater L-shape Taupe Art.71249 DKK 2997
Komodo 3-Seater Taupe Art.71248 DKK 1745
Komodo Armchair Taupe Art.71246 DKK 690
Granada Lounge Chair Black/Creme Art.71212 DKK 695
Granada Lounge Sofa Black/Creme Art.71214 DKK 1380
Beach Lounger Blue/Poplar Tree Art.1971450 DKK 172
Net Relax Chair w. Seat Ocean Art.71270 DKK 116
Net Relax Chair w. Seat Taupe Art.71271 DKK 116
Net Relax Chair w. Seat Mustard Art.71272 DKK 116
Net Relax Chair w. Seat Coral Red Art.71273 DKK 116
Net Bench w. Seat Ocean Art.71274 DKK 369
Net Bench w. Seat Coral Red Art.71275 DKK 369
Komodo 2-Seater Taupe Art.71247 DKK 1217
Komodo Lounge Stool Taupe Art.71245 DKK 315
Bench Black Art.195086 DKK 501

BAR & RECEPTION:
Bornholm Bar / Buffet Wood/Steel Top Art.72208 DKK 2810
Bornholm Bar with Front Wood/Steel Top Art.72210 DKK 4191
Bar / Buffet Black/Steel Top Art.72691 DKK 2307
Bar / Buffet White/Steel Top Art.72206 DKK 1972
Bar / Buffet White/Black Top Art.72106 DKK 1972
Bar 1/8 Round LED Front White/Steel Top Art.72656 DKK 4521
Buffet Bar White with LED White/White Top Art.72351 DKK 3066
Bar with LED Front White/Silver/Grey Art.72116 DKK 2736
St. Tropez High Counter White Art.60039 DKK 680
St. Tropez High Counter White Art.60047 DKK 1099
St. Tropez Counter White Art.60046 DKK 1030
Plano Info Counter White Art.2303 DKK 1725
Plano-1 Info Counter White/Black Art.72741 DKK 2095
Nordic Counter Bar Black Art.9010NCB DKK 450

REOLER:
Bornholm Rack, 5 Shelves Wood/Black Steel Art.72231 DKK 2538
Bornholm Rack, 5 Shelves Wood/Black Steel Art.72230 DKK 2267
Design Shelf w. Wheels White Art.3156 DKK 2711
Design Shelf w. Wheels White Art.3152 DKK 1626
Metal Rack Basic Chrome Art.76120 DKK 574
Wardrobe Shelves Grey Art.3446 DKK 1084
Shelving Unit Double White Art.1972230 DKK (pris mangler)
Shelving Unit Double Black Art.1972231 DKK (pris mangler)
Shelving Unit Double White Art.1972233 DKK 557
Shelving Unit Double Black Art.1972234 DKK 557
Shelving Unit Single White Art.1972236 DKK 557
Shelving Unit Single Black Art.1972235 DKK 557

GULVTÆPPER:
Carpet Natural Art.194082 DKK 807
Carpet Caramel Art.194083 DKK 807
Carpet Sand Grey Art.194084 DKK 807
Carpet Burnt Curry Art.194091 DKK 807
Carpet Silky White Art.194092 DKK 807
Carpet Orange Art.194097 DKK 807
Carpet Anthracite Green Art.194085 DKK 807
Carpet Light Grey Art.194086 DKK 807
Carpet Dark Green Art.194087 DKK 807
Carpet Forest Green Art.194088 DKK 807
Carpet Warm Brown Art.194089 DKK 807
Carpet Terracotta Art.194090 DKK 807
Carpet Dark Blue Art.194093 DKK 807
Carpet Bordeaux Art.194095 DKK 807
Carpet Persian Pattern Art.194096 DKK 807
Carpet Moss Green Art.194094 DKK 807
Carpet Pink Art.194098 DKK 807
Carpet Blush Rose Art.194099 DKK 807
Carpet Artificial Grass Green Art.194066 DKK 1099
Carpet Tile Anthracite Art.1193 DKK 35
Sheep Skin Off White Art.194392 DKK 73
Sheep Skin Salt & Pepper Art.194393 DKK 73

PUDER:
Pillow Cream White Art.195719 DKK 44
Pillow Yellow Art.195713 DKK 44
Pillow Dark Blue Art.195717 DKK 44
Pillow Curry Art.195718 DKK 44
Pillow Forest Green Art.195716 DKK 44
Pillow Petroleum Art.195715 DKK 44
Pillow Red Art.195714 DKK 44
Pillow Dusty Rose Art.9010PL DKK 44

BELYSNING:
LED Cube White/LED Art.193213 DKK 290
LED Cube White/LED Art.193212 DKK 340
LED Cube White/LED Art.192601L DKK 377
Flowerpot Table Lamp Swim Blue/Battery Art.193394 DKK 202
Fatboy Table Lamp White/Battery Art.1915 DKK 212
Calida Nano Table Lamp Black/Dimmable Art.191915 DKK 283

PLANTER:
Hanging Plants Various Artificial Green Art.193871 DKK (pris mangler)
Potted Plants Various Artificial Green Art.193870 DKK (pris mangler)
Preserved Flower Arrangements Dried Flowers Art.193886 DKK (pris mangler)
Pot Potted Plants Wicker Art.193872 DKK (pris mangler)
Pot Potted Plants Black Art.193882 DKK (pris mangler)
Pot Potted Plants White Art.193883 DKK (pris mangler)

DIVERSE:
Coat Rack Standing Black Wood Art.192262 DKK 272
Wardrobe Stand Mobile 40 hangers Art.2263 DKK 221
Tensabarrier Chrome/Black Art.2302 DKK 251
Barring Rope Deep Red Art.2548 DKK 67
Picket Fence w. Base White Art.192282 DKK 123
Ashtray Standing Chrome Art.1554 DKK 158
Pushboy Trashcan White/Chrome Art.2312 DKK 212
Full Length Mirror Mobile Mirror/Black Art.192269 DKK 190
Lectern Transparent Acrylic Art.192251 DKK 876
Folder Stand Perforated Metal Art.193142 DKK 417
Whiteboard Magnetic White/Metal Art.192297 DKK 1479
MHLB Office Chair Black/Chrome/Wheels Art.195722 DKK 802

SERVICE - PORCELÆN:
Freestyle Craft Plate Green Art.6431 DKK 10.85
Freestyle Craft Plate Green Art.6434 DKK 4.34
Freestyle Craft Bowl Green Art.6435 DKK 4.34
Freestyle Craft Bowl Blue Art.6445 DKK 4.34
Freestyle Craft Plate White Art.6461 DKK 10.85
Freestyle Mysa Plate Sand Grey Art.9791 DKK 4.93
Freestyle Mysa Plate Mountain Blue Art.9785 DKK 4.93
Freestyle Mysa Plate Ocean Art.9782 DKK 4.93
Freestyle Mysa Plate Lake Green Art.9766 DKK 4.93
Jade Plate White Art.4835 DKK 3.25
Jade Deep Plate White Art.4837 DKK 3.25
Jade Coupe Plate White Art.4875 DKK 4.14
Standard Plate White Art.1396 DKK 3.35
Standard Plate White Art.1395 DKK 2.17
Standard Deep Plate White Art.1397 DKK 2.17
Standard Coffee Cup White Art.1391 DKK 2.17
Jade Coffee Cup White Art.4830 DKK 3.25
Jade Cappuccino Cup White Art.4851 DKK 3.25

SERVICE - BESTIK:
Arts Table Fork Stainless Art.4062 DKK 3.06
Arts Table Knife Stainless Art.4061 DKK 3.06
Arts Table Spoon Stainless Art.4063 DKK 3.06
Arts Steak Knife Stainless Art.4075 DKK 3.06
Arts Dessert Fork Stainless Art.4065 DKK 3.06
Arts Dessert Spoon Stainless Art.4066 DKK 3.06
Arts Cake Fork Stainless Art.4068 DKK 3.06
Arts Coffee Spoon Stainless Art.4067 DKK 3.06
Standard Table Fork Stainless Art.1242 DKK 2.27
Standard Table Knife Stainless Art.1241 DKK 2.27
Standard Table Spoon Stainless Art.1243 DKK 2.27

SERVICE - GLAS:
Vina Wine Glass Clear Art.4164 DKK 2.96
Vina Claret Glass Clear Art.4165 DKK 2.96
Vina Champagne Flute Clear Art.4170 DKK 2.96
Vina Burgundy Glass Clear Art.4163 DKK 2.96
Vina Water Glass Clear Art.4162 DKK 2.96
Exclusive Small Wine Clear Art.4204 DKK 2.56
Exclusive Large Wine Clear Art.4203 DKK 2.56
Exclusive Champagne Clear Art.4210 DKK 2.56
Schnaps Glass Clear Art.1207 DKK 2.27
Cognac Glass Clear Art.1211 DKK 2.27
Martini Glass Diva Clear Art.4257 DKK 3.35
Whisky Glass Clear Art.1214 DKK 2.27
Longdrink Glass Clear Art.1213 DKK 2.27
Caipirinha Glass Clear Art.1219 DKK 2.27
Water Tumbler Grey, Thin Art.6036 DKK 3.35
Tossa Schnaps Glass Clear Art.4277 DKK 4.14

SERVICE - SERVERING:
Carafe Glass Art.191366 DKK 7.65
Water Carafe Glass Art.1566 DKK 11.83
Hotello Tea Jug Double-walled Thermo Art.1510 DKK 76.42
Table Number Holder Chrome Art.1544 DKK 29.09
Universal Tongs Black Plastic Art.1279 DKK 12.82
Weck Preserving Jar Glass Art.1470 DKK 2.66

KØKKENUDSTYR:
Mondo 2 Coffee Maker 230V/2020W Art.1701 DKK 345.1
Mondo Twin Coffee Maker 230V/3240W Art.1703 DKK 542.3
B5E 10 L Coffee Maker 400V/3kW Art.1705 DKK 1133.9
B20E 2×20 L Coffee Maker 400V/9.3kW Art.1707 DKK 2243.15
Thermo Jug Stainless 18/10 Art.1532 DKK 19.72
Hotello Thermo Jug Double-walled Art.1511 DKK 81.35
Serving Trolley 3 Shelves Art.1845 DKK 384.54
Heating Lamp on Base Warm White/230V Art.1847 DKK 369.75
Hot Pot Soup Kettle 230V/0.4kW Art.1605 DKK 251.43
Chocolate Fountain Sephra 230V/510W Art.1676 DKK 2218.5
Banket Wine Cooler Brushed Stainless Art.191536 DKK 124
Chafing Dish Lid + roller Art.1602 DKK 251.43
Gastronorm Pan 1/1 GN Art.1619 DKK 34.51
Gastronorm Pan 1/1 GN Art.1625 DKK 54.23
Gastronorm Pan 1/2 GN Art.1622 DKK 24.65
Refrigerator w. Glass Door 145 L/2 Grates Art.1753 DKK 517.65
Refrigerator w. Glass Door 360 L/3 Grates Art.1749 DKK 616.25
Refrigerator Mobile 500 L/3 Grates Art.1759 DKK 2415.7
Chest Freezer Mobile 350 L Art.1756 DKK 936.7
Hot Cupboard Mobile 22 Pans/2kW Art.1839 DKK 1479
Sink Unit w. Boiler 10 L/2kW Art.2276 DKK 813.45
Rational SCC 201 20 Pans 400V/37kW Art.1695 DKK 8775.4
Rational SCC 101 10 Pans 400V/19kW Art.1691 DKK 4683.5
Fan Forced Oven 400V/17kW Art.1859 DKK 3204.5
Industrial Dishwasher Push-through Art.2277 DKK 6359.7
Dishwasher Front Loading 230V/3.3kW Art.2274 DKK 2711.5
Induction Counter Top Bartscher/230V Art.1897 DKK 877.54
Electric Range w. Oven 400V/17kW Art.1789 DKK 2711.5
Double Deep Fat Fryer 2×10 L/230V Art.1776 DKK 877.54`;

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

