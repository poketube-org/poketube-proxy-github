/*
  Copyright (C) 2021-2022 POKETUBE (https://github.com/iamashley0/poketube)
  
  This program is free software: you can redistribute it and/or modify
  it under the terms of the GNU General Public License as published by
  the Free Software Foundation, either version 3 of the License, or
  (at your option) any later version.

  This program is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  GNU General Public License for more details.

  You should have received a copy of the GNU General Public License
  along with this program. If not, see https://www.gnu.org/licenses/.
*/

import express from 'express';
import fetch from 'node-fetch';
import htmlParser from 'node-html-parser';

const app = express();

app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

const proxy = async (req, res) => {
  const url = `https://${req.originalUrl.slice(10)}`;

  const res_ = await fetch(url, { method: req.method });

  if (false && res_.headers.get('content-type').includes('html')) {
    const body = await res_.text();

    if (false && !htmlParser.valid(body)) {
      console.warn(`[ERROR] Invalid HTML at ${url}`);

      res_.body.pipe(res);

      return;
    }

    const root = htmlParser.parse(body);
    const html = root.childNodes.find(
      (x) => x.tagName != null && x.tagName.toLowerCase() == 'html'
    );

    if (html === undefined) {
      console.warn(`[ERROR] No <html> at ${url}`);

      res.send(body);

      return;
    }

    res.send(html.toString());
  } else res_.body.pipe(res);
};

app.get('/', (_, res) =>
  res.redirect(
    'https://poketube.fun/watch?v=l3eww1dnd0k&trck=we_dont_lol&hi=mom&i_like_this=yes&omgfr=tru&AAAAA=BBBBBB&unclebenwhathappend=squidgames'
  )
);

app.all('/*', proxy);

app.listen(3000);
