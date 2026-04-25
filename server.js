const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();

app.get('/', async (req, res) => {
  try {
    const url = 'https://hydroinfo.hu/tables/dunhid.html';
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    let maReggelIndex = -1;
    let value = 'N/A';

    // 🔍 1. MA REGGEL OSZLOP MEGTALÁLÁSA
    $('tr').first().find('th, td').each((i, el) => {
      const text = $(el).text().trim().replace(/\s+/g, ' ');

      if (text === 'Ma reggel') {
        maReggelIndex = i;
        console.log('👉 Ma reggel index:', maReggelIndex);
      }
    });

    // 🔍 2. NAGYMAROS SOR + OSZLOP KIVÉTELE
    $('tr').each((i, row) => {
      const cells = $(row).find('td');

      if (cells.length > 0) {
        const name = $(cells[1]).text().trim();

        if (name.includes('Nagymaros')) {

          const values = [];
          cells.each((i, el) => values.push($(el).text().trim()));

          console.log('👉 Nagymaros sor:', values);

          if (maReggelIndex !== -1) {
            value = values[maReggelIndex];
          }
        }
      }
    });

    res.send(`Nagymaros (ma reggel): ${value} cm`);

  } catch (err) {
    console.error(err);
    res.send('Hiba történt');
  }
});

app.listen(3000, () => console.log('Server fut'));
