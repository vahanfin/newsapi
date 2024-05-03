const express = require('express');
const cors = require('cors');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

// Function to scrape news articles
const scrapeNews = async () => {
  try {
    const url = 'https://www.lokmat.com/topics/rto-office/news/';
    const response = await axios.get(url);
    const html = response.data;
    const $ = cheerio.load(html);
    const newsArticles = [];

    $('section.list-view figure').each((index, element) => {
      const titleElement = $(element).find('figcaption h2 a').eq(1); // Get the second <a> element
      const link = titleElement.attr('href');
      const title = titleElement.text();
      const content = $(element).find('figcaption h3').text().trim();
      const image = $(element).find('img').attr('data-original');
      newsArticles.push({ title, link, content, image });
    });

    return newsArticles;
  } catch (error) {
    console.error('Error scraping news:', error);
    return null;
  }
};

app.get('/', (req, res)=>{ 
  res.status(200); 
  res.send("Welcome to root URL of Server"); 
});

// API endpoint to fetch news articles
app.get('/rto-news', async (req, res) => {
  try {
    const articles = await scrapeNews();
    if (articles) {
      res.json({ news: articles });
    } else {
      res.status(500).json({ message: 'Failed to retrieve news articles' });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});





