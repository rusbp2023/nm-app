const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();

app.get('/', async (req, res) => {
  try {
    const url = 'https://hydroinfo.hu/tables/dunelotH.html';
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    let value = 'N/A';

    $('tr').each((i, row) => {
      const cells = $(row).find('td');

      if (cells.length > 0) {
        const name = $(cells[0]).text().trim(); // ⚠️ itt lehet 0!

        if (name.includes('Nagymaros')) {

          // 👉 "Ma reggel" oszlop
          value = $(cells[9]).text().trim();

          console.log('👉 Nagymaros sor megtalálva');
          console.log('👉 Ma reggel érték:', value);
        }
      }
    });

    res.send(`Nagymaros (Ma reggel): ${value}`);

  } catch (err) {
    console.error(err);
    res.send('Hiba történt');
  }
});

app.listen(3000, () => console.log('Server fut'));
