const fs = require('fs');
const txt = fs.readFileSync('./src/views/cafeData.ts','utf8');
const lists = ['coffee','nonCoffee','tea','smoothie','ade','juice','dessert','bakery','icecream'];
for (const name of lists) {
  const re = new RegExp(name + "\\s*=\\s*\\[(.*?)\\]", 's');
  const m = re.exec(txt);
  if (!m) { console.log(name, 'not found'); continue; }
  const items = m[1].split('\n').map(l => l.trim()).filter(l => l.startsWith("'"));
  console.log(name, items.length);
}
