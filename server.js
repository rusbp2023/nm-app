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

        if (name.includes('Nagymaros')) {

          // 👉 2. cella (index 1) = amit kérsz
          value = $(cells[4]).text().trim();

          console.log('👉 Nagymaros sor megtalálva');
          console.log('👉 2. cella érték:', value);
        }
      }
    });

    res.send(`Nagymaros (2. cella): ${value}`);

  } catch (err) {
    console.error(err);
    res.send('Hiba történt');
  }
});

app.listen(3000, () => console.log('Server fut'));
