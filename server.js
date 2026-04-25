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

    // 🔍 1. FEJLÉCBEN MEGKERESSÜK A "Ma reggel" OSZLOPOT
    $('tr').each((i, row) => {
      const headers = $(row).find('th, td');

      headers.each((j, el) => {
        const text = $(el).text().trim().toLowerCase();

        if (text.includes('ma reggel')) {
          maReggelIndex = j;
        }
      });
    });

    // 🔍 2. NAGYMAROS SOR KERESÉSE
    $('tr').each((i, row) => {
      const cells = $(row).find('td');

      if (cells.length > 0) {
        const name = $(cells[1]).text().trim();

        if (name === 'Nagymaros' && maReggelIndex !== -1) {
          value = $(cells[maReggelIndex]).text().trim();
        }
      }
    });

    res.send(`Nagymaros (ma reggel): ${value} cm`);

  } catch (error) {
    console.error(error);
    res.send('Hiba történt');
  }
});

app.listen(3000, () => console.log('Server fut a 3000-es porton'));
