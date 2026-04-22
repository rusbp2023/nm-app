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
      const text = $(row).text();

      // 🔥 ha benne van a Nagymaros
      if (text.includes('Nagymaros')) {

        const cells = $(row).find('td');

        const values = [];

        cells.each((i, el) => {
          const t = $(el).text().trim();
          if (t !== '') values.push(t);
        });

        console.log('Nagymaros parsed:', values);

        // 🔥 itt keresünk egy számot (37 környéke)
        // általában az utolsó vagy utolsó előtti szám
        const numbers = values.filter(v => !isNaN(v) && v !== '');

        console.log('Numbers:', numbers);

        // 👉 EZ LESZ A MEGOLDÁS (általában az utolsó vagy utolsó előtti)
        value = numbers[numbers.length - 1] || 'N/A';
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