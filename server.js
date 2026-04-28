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
          value = $(cells[1]).text().trim();

          console.log('👉 Nagymaros sor megtalálva');
          console.log('👉 Ma reggel érték:', value);
        }
      }
    });

  res.send(`
  <html>
    <head>
      <meta charset="UTF-8">
      <title>Nagymaros vízállás</title>
      <style>
        body {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          margin: 0;
          font-family: Arial, sans-serif;
          background: #f4f4f4;
        }
        .box {
          text-align: center;
          font-size: 40px;
          font-weight: bold;
          background: white;
          padding: 40px 60px;
          border-radius: 12px;
          box-shadow: 0 10px 25px rgba(0,0,0,0.1);
        }
        .label {
          font-size: 20px;
          color: #666;
          margin-bottom: 10px;
        }
      </style>
    </head>
    <body>
      <div class="box">
        <div class="label">Nagymaros (Ma reggel)</div>
        <div>${value} cm</div>
      </div>
    </body>
  </html>
`);

  } catch (err) {
    console.error(err);
    res.send('Hiba történt');
  }
});

app.listen(3000, () => console.log('Server fut'));
