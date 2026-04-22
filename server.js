const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();

app.get('/', async (req, res) => {
  try {
    const url = 'https://hydroinfo.hu/tables/dunhid.html';
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    let value = 'N/A';
    let targetIndex = -1;

    // 🔥 1. megkeressük a fejléc sorát
    const headers = [];

    $('tr').first().find('td, th').each((i, el) => {
      headers.push($(el).text().trim());
    });

    console.log('HEADERS:', headers);

    // 🔥 2. megkeressük a "mai reggeli" oszlopot
    headers.forEach((h, i) => {
      if (h.includes('37') || h.includes('reggel') || h.includes('ma')) {
        targetIndex = i;
      }
    });

    console.log('TARGET INDEX:', targetIndex);

    // 🔥 3. Nagymaros sor keresése
    $('tr').each((i, row) => {
      const cells = $(row).find('td');

      if (cells.length > 0) {
        const name = $(cells[1]).text().trim();

        if (name === 'Nagymaros') {
          if (targetIndex !== -1) {
            value = $(cells[targetIndex]).text().trim();
          }
        }
      }
    });

    res.send(`
      <h1>Nagymaros vízállás</h1>
      <h2>${value} cm</h2>
    `);

  } catch (err) {
    console.error(err);
    res.send('Hiba');
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('Server fut'));