const fs = require("fs");
const path = require("path");

const src = path.resolve(__dirname, "../src/templates");
const dest = path.resolve(__dirname, "../dist/templates");

function copyFolder(srcDir, destDir) {
  if (!fs.existsSync(srcDir)) return;
  fs.mkdirSync(destDir, { recursive: true });
  const items = fs.readdirSync(srcDir);
  for (const item of items) {
    const s = path.join(srcDir, item);
    const d = path.join(destDir, item);
    if (fs.statSync(s).isDirectory()) {
      copyFolder(s, d);
    } else {
      fs.copyFileSync(s, d);
    }
  }
}

copyFolder(src, dest);
console.log("Templates copied to dist/templates");

