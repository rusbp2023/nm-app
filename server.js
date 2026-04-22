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

    // 🔹 soronként megyünk
    $('tr').each((i, row) => {
      const cells = $(row).find('td');

      if (cells.length > 0) {

        const name = $(cells[1]).text().trim();

        if (name === 'Nagymaros') {

          // 🔥 PRÓBÁLJUK A "2. SZÁMOS OSZLOPOT" (ez általában a reggeli)
          value = $(cells[3]).text().trim();

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