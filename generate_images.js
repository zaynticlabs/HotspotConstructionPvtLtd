const fs = require('fs');

function svgToBase64(svgString) {
  return "data:image/svg+xml;base64," + Buffer.from(svgString).toString('base64');
}

const generateBuildingSVG = (title, floors, width, height, skyColor1, skyColor2) => `
<svg viewBox="0 0 800 500" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="sky-${title.replace(/\\s/g, '')}" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="${skyColor1}"/>
      <stop offset="100%" stop-color="${skyColor2}"/>
    </linearGradient>
  </defs>
  <rect width="800" height="500" fill="url(#sky-${title.replace(/\\s/g, '')})"/>
  
  <!-- Ground -->
  <path d="M0 480 h800 v20 h-800 z" fill="#111"/>
  
  <!-- Building Silhouette -->
  <rect x="${400 - width/2}" y="${480 - height}" width="${width}" height="${height}" fill="#1a1a1a"/>
  
  <!-- Title -->
  <text x="400" y="50" font-family="sans-serif" font-size="28" font-weight="bold" fill="#fff" text-anchor="middle">${title}</text>
  
  <!-- Windows -->
  <g fill="#f0a500" opacity="0.8">
    ${Array.from({ length: floors }).map((_, f) => 
      Array.from({ length: Math.floor(width / 60) }).map((_, w) => 
        `<rect x="${400 - width/2 + 20 + w*60}" y="${480 - height + 20 + f*60}" width="30" height="40"/>`
      ).join('')
    ).join('')}
  </g>
  
  <!-- Trees -->
  <polygon points="100,480 130,380 160,480" fill="#1c3315"/>
  <polygon points="140,480 160,400 180,480" fill="#203a18"/>
  <polygon points="650,480 680,360 710,480" fill="#1c3315"/>
</svg>`;

const generateHeroSVG = () => `
<svg viewBox="0 0 1920 1080" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="herosky" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#111111"/>
      <stop offset="100%" stop-color="#e8620a"/>
    </linearGradient>
  </defs>
  <rect width="1920" height="1080" fill="url(#herosky)"/>
  
  <path d="M0 1000 h1920 v80 h-1920 z" fill="#000"/>
  
  <!-- Distant city -->
  <path d="M100 1000 v-200 h100 v200 M250 1000 v-300 h150 v300 M450 1000 v-150 h120 v150 M1400 1000 v-250 h150 v250" fill="#1a1a1a" opacity="0.5"/>
  
  <!-- Construction Building Skeleton -->
  <g stroke="#2c2c2c" stroke-width="6" fill="none">
    ${Array.from({length: 8}).map((_, f) => `<line x1="700" y1="${900 - f*80}" x2="1200" y2="${900 - f*80}"/>`).join('')}
    ${Array.from({length: 6}).map((_, c) => `<line x1="${700 + c*100}" y1="1000" x2="${700 + c*100}" y2="340"/>`).join('')}
  </g>
  
  <!-- Crane 1 -->
  <g stroke="#e8620a" stroke-width="8" fill="none">
    <line x1="600" y1="1000" x2="600" y2="200"/>
    <line x1="500" y1="200" x2="1100" y2="200"/>
    <line x1="600" y1="200" x2="800" y2="100"/>
    <line x1="1100" y1="200" x2="1100" y2="500" stroke-width="2"/>
  </g>
</svg>`;

const generateTeamSVG = (name, bgColor) => `
<svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
  <rect width="400" height="400" fill="${bgColor}"/>
  <!-- Shoulders / Suit -->
  <path d="M100 400 Q200 250 300 400 Z" fill="#2c2c2c"/>
  <!-- Neck -->
  <rect x="180" y="220" width="40" height="50" fill="#e0ac69"/>
  <!-- Face -->
  <rect x="150" y="120" width="100" height="120" rx="40" fill="#e0ac69"/>
  <!-- Hard Hat -->
  <path d="M130 140 Q200 60 270 140 Q200 120 130 140 Z" fill="#e8620a"/>
  <!-- Glasses/Eyes -->
  <rect x="170" y="170" width="20" height="10" fill="#1a1a1a"/>
  <rect x="210" y="170" width="20" height="10" fill="#1a1a1a"/>
  <!-- Collar / Tie -->
  <polygon points="180,270 200,320 220,270" fill="#fff"/>
  <polygon points="195,270 200,340 205,270" fill="#e8620a"/>
</svg>`;

const projects = {
  nashemanPlaza: generateBuildingSVG("Nasheman Plaza", 4, 300, 300, "#1a2a6c", "#b21f1f"),
  satyapremiPlaza: generateBuildingSVG("Satyapremi Plaza", 2, 400, 160, "#000000", "#e8620a"),
  malikComplex: generateBuildingSVG("Malik Complex", 3, 350, 240, "#141E30", "#243B55"),
  mitraShoppingCenter: generateBuildingSVG("Mitra Shopping Center", 2, 500, 150, "#373B44", "#4286f4"),
  hotspotMart: generateBuildingSVG("Hotspot Mart", 2, 450, 180, "#232526", "#414345"),
  shivPrabhaComplex: generateBuildingSVG("ShivPrabha Complex", 5, 250, 350, "#0f2027", "#203a43"),
  surenderComplex: generateBuildingSVG("Surender Complex", 4, 320, 280, "#2C3E50", "#FD746C"),
  asPlaza: generateBuildingSVG("A.S. Plaza", 3, 280, 200, "#4B79A1", "#283E51"),
  houseConstruction: generateBuildingSVG("House Construction", 2, 200, 150, "#1D2B64", "#F8CDDA"),
  upcomingMiniMallA: generateBuildingSVG("Upcoming Mini-Mall A", 3, 600, 240, "#000000", "#f0a500"),
  upcomingMiniMallB: generateBuildingSVG("Upcoming Mini-Mall B", 4, 600, 320, "#1a1a1a", "#e8620a"),
  upcomingMiniMallC: generateBuildingSVG("Upcoming Mini-Mall C", 6, 600, 420, "#2c2c2c", "#f0a500"),
};

const output = "const projectImages = {\\n" +
  '  nashemanPlaza: "' + svgToBase64(projects.nashemanPlaza) + '",\\n' +
  '  satyapremiPlaza: "' + svgToBase64(projects.satyapremiPlaza) + '",\\n' +
  '  malikComplex: "' + svgToBase64(projects.malikComplex) + '",\\n' +
  '  mitraShoppingCenter: "' + svgToBase64(projects.mitraShoppingCenter) + '",\\n' +
  '  hotspotMart: "' + svgToBase64(projects.hotspotMart) + '",\\n' +
  '  shivPrabhaComplex: "' + svgToBase64(projects.shivPrabhaComplex) + '",\\n' +
  '  surenderComplex: "' + svgToBase64(projects.surenderComplex) + '",\\n' +
  '  asPlaza: "' + svgToBase64(projects.asPlaza) + '",\\n' +
  '  houseConstruction: "' + svgToBase64(projects.houseConstruction) + '",\\n' +
  '  upcomingMiniMallA: "' + svgToBase64(projects.upcomingMiniMallA) + '",\\n' +
  '  upcomingMiniMallB: "' + svgToBase64(projects.upcomingMiniMallB) + '",\\n' +
  '  upcomingMiniMallC: "' + svgToBase64(projects.upcomingMiniMallC) + '",\\n' +
  '  heroBackground: "' + svgToBase64(generateHeroSVG()) + '",\\n' +
  '  teamFaraz: "' + svgToBase64(generateTeamSVG("Er. Faraz Akhtar", "#d3e2e8")) + '",\\n' +
  '  teamAkram: "' + svgToBase64(generateTeamSVG("Akram Rasul", "#e8d8d3")) + '"\\n' +
"};\\n";

fs.writeFileSync('images.js', output);
console.log('images.js generated successfully.');
