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
    let maReggelIndex = -1;

    console.log('--- TÁBLÁZAT ELEMZÉS INDUL ---');

    // 🔍 FEJLÉC KERESÉS
    $('tr').each((i, row) => {
      const headers = $(row).find('th, td');

      headers.each((j, el) => {
        const text = $(el).text().trim().replace(/\s+/g, ' ');

        if (text.toLowerCase().includes('ma reggel')) {
          maReggelIndex = j;
          console.log('👉 Ma reggel oszlop index:', maReggelIndex);
        }
      });
    });

    // 🔍 SOROK KERESÉSE
    $('tr').each((i, row) => {
      const cells = $(row).find('td');

      if (cells.length > 0) {
        const name = $(cells[1]).text().trim();

        if (name === 'Nagymaros') {

          const values = [];

          cells.each((i, el) => {
            values.push($(el).text().trim());
          });

          console.log('👉 Nagymaros sor teljes:', values);

          if (maReggelIndex !== -1) {
            value = values[maReggelIndex];
            console.log('👉 Kiválasztott Ma reggel érték:', value);
          } else {
            console.log('❌ Nincs Ma reggel oszlop találat!');
          }
        }
      }
    });

    res.send(`Nagymaros (ma reggel): ${value} cm`);

    console.log('--- VÉGE ---');

  } catch (err) {
    console.error('HIBA:', err);
    res.send('Hiba történt');
  }
});

app.listen(3000, () => console.log('Server fut a 3000-es porton'));
