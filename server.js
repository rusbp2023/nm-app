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

    console.log('--- START ---');

    // 🔍 1. CSAK FEJLÉC SOR
    $('tr').first().find('th, td').each((i, el) => {
      const text = $(el).text().trim().replace(/\s+/g, ' ');

      if (text === 'Ma reggel') {
        maReggelIndex = i;
        console.log('👉 Ma reggel index:', maReggelIndex);
      }
    });

    // 🔍 2. NAGYMAROS SOR
    $('tr').each((i, row) => {
      const cells = $(row).find('td');

      if (cells.length > 0) {
        const name = $(cells[3]).text().trim();

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

    console.log('👉 EREDMÉNY:', value);

    res.send(`Nagymaros (ma reggel): ${value} cm`);

    console.log('--- END ---');

  } catch (err) {
    console.error(err);
    res.send('Hiba');
  }
});

app.listen(3000);
