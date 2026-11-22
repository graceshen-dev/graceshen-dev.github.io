// =========================================================
// script.js: the interactive bits
// =========================================================

// ---------- Fun fact "carousel" ----------
const facts = [
  "I can name any Conan Gray song if you play the first second",
  "My go-to café order is fruit tea.",
  "I can name 80 digits of pi on a good day",
  "I can recite the alphabet backwards",
  "My hidden talent is mickey mouse voice"
];

let current = 0; // which fact is showing 

const factText = document.getElementById("factText");
const factCount = document.getElementById("factCount");

function showFact() {
  factText.style.opacity = 0;          // fade out...
  setTimeout(() => {
    factText.textContent = facts[current];
    factCount.textContent = `${current + 1} / ${facts.length}`;
    factText.style.opacity = 1;        // ...then fade back in with the new fact
  }, 200);
}

document.getElementById("nextFact").addEventListener("click", () => {
  current = (current + 1) % facts.length;
  showFact();
});

document.getElementById("prevFact").addEventListener("click", () => {
  current = (current - 1 + facts.length) % facts.length;
  showFact();
});

showFact(); 


// ---------- 2. Draw the winding journey path ----------
function drawJourneyPath() {
  const wrap = document.querySelector(".journey-path");
  if (!wrap) return;

  const svg = wrap.querySelector(".journey-line");
  const path = svg.querySelector("path");
  const stops = wrap.querySelectorAll(".journey-stop");
  if (stops.length < 2) return;   // need at least two points to draw a line

  // getBoundingClientRect() gives an element's position on screen.
  // Subtracting the container's position converts to "position inside the container".
  const box = wrap.getBoundingClientRect();
  const points = [];
  stops.forEach((stop) => {
    const media = stop.querySelector(".journey-media").getBoundingClientRect();
    points.push({
      x: media.left - box.left + media.width / 2,   // centre of the picture
      y: media.top - box.top + media.height / 2
    });
  });

  // The viewBox makes the SVG's coordinates match real pixels
  svg.setAttribute("viewBox", `0 0 ${box.width} ${box.height}`);

  // Build the path string: "M" = move to, "C" = cubic curve.
  // Putting both control points at the halfway height gives a smooth S-bend.
  let d = `M ${points[0].x} ${points[0].y}`;
  for (let i = 1; i < points.length; i++) {
    const from = points[i - 1];
    const to = points[i];
    const midY = (from.y + to.y) / 2;
    d += ` C ${from.x} ${midY}, ${to.x} ${midY}, ${to.x} ${to.y}`;
  }
  path.setAttribute("d", d);
}

// Redraw after images load (they change the layout) and whenever the window resizes
window.addEventListener("load", drawJourneyPath);
window.addEventListener("resize", drawJourneyPath);
drawJourneyPath();


// ---------- 3. Random tilts for the "scattered" look ----------
// For every interest tag and polaroid, pick a random angle between -6 and 6 degrees
document.querySelectorAll(".interest-tag, .polaroid").forEach((el) => {
  const angle = (Math.random() * 12 - 6).toFixed(1);
  el.style.setProperty("--tilt", `${angle}deg`);
});