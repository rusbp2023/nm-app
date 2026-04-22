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

    $('tr').each((i, row) => {
      const cells = $(row).find('td');

      if (cells.length > 0) {

        const name = $(cells[1]).text().trim();

        if (name === 'Nagymaros') {

          // 🔥 ÖSSZES CELL KIOLVASÁSA (DEBUG + BIZTOS LOGIKA)
          const values = [];

          cells.each((i, el) => {
            values.push($(el).text().trim());
          });

          console.log('Nagymaros sor:', values);

          // 🔥 A VÍZÁLLÁS TÖBBNYIRE AZ 4. SZÁMOS OSZLOP
          // (itt fogjuk belőni pontosan)
          value = values[4]; // <-- EZ LESZ A 37 (vagy körülötte)

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