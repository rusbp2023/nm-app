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

    // 🔹 1. Fejléc kiolvasása
    const headers = [];
    $('tr').first().find('td, th').each((i, el) => {
      headers.push($(el).text().trim());
    });

    // 🔹 2. Megkeressük a "ma reggel" oszlopot
    // (ha pontosabb nevet látsz, pl. "Ma reggel vízállás", ez is működik)
    const idx = headers.findIndex(h =>
      h.toLowerCase().includes('reggel')
    );

    // 🔹 3. Sorok bejárása
    $('tr').each((i, row) => {
      const cells = $(row).find('td');

      if (cells.length > 0) {
        const name = $(cells[1]).text().trim();

        if (name === 'Nagymaros') {
          if (idx !== -1) {
            value = $(cells[idx]).text().trim();
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
    res.send('Hiba a lekérésben');
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('Server fut a porton:', PORT);
});