const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/maharashtra-rto-news', async (req, res) => {
    try {
        const response = await axios.get('https://timesofindia.indiatimes.com/topic/maharashtra-rto/news');
        const $ = cheerio.load(response.data);
        const newsArticles = [];

        $('div.uwU81').each((index, element) => {
            const title = $(element).find('span').text().trim();
            const date = $(element).find('div.ZxBIG').text().trim();
            const image = $(element).find('img').attr('src');
            const link = $(element).find('a').attr('href');
            newsArticles.push({ title, date, image, link });
        });

        res.json({ news: newsArticles });
    } catch (error) {
        console.error(`Error scraping news: ${error}`);
        res.status(500).json({ message: 'Failed to retrieve news articles' });
    }
});

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
