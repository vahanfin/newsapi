const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors());


app.get('/', (req, res)=>{ 
  res.status(200); 
  res.send("Welcome to root URL of Server"); 
});

// Define a route to fetch and serve the news data
app.get('/api/news', async (req, res) => {
  try {
    const { page = 1 } = req.query;
    // Fetch HTML content from the website
    const response = await axios.get(`https://auto.economictimes.indiatimes.com/tag/rto/${page}`);

    // Load HTML content into Cheerio
    const $ = cheerio.load(response.data);

    // Extract data from the specified panel
    const extractedStories = [];
    $('ul.news-listing-infinite li').each((index, element) => {
      const title = $(element).find('h3.heading a').text().trim();
      const link = $(element).find('h3.heading a').attr('href');
      const imageUrl = $(element).find('img').attr('data-src');
      const description = $(element).find('p.desktop-view').text().trim();

      // Push data to the extractedStories array
      extractedStories.push({
        title,
        link,
        imageUrl,
        description
      });
    });

    // Send the extracted data as the response
    res.json(extractedStories);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'An error occurred while fetching data' });
  }
});

app.get('/api/news2', async (req, res) => {
    try {
        const { page = 1 } = req.query;
      // Fetch HTML content from the website
      const response = await axios.get(`https://auto.economictimes.indiatimes.com/tag/rto/${page}`);
      
      // Load HTML content into Cheerio
      const $ = cheerio.load(response.data);
      
      // Extract data from the specified panel
      const extractedStories = [];
      $('ul.top-story-panel__listing--row-2 li.top-story-panel__item').each((index, element) => {
        const title = $(element).find('h3').text().trim();
        const link = $(element).find('a.top-story-panel__link').attr('href');
        const imageUrl = $(element).find('img.story__image--img').attr('data-src');
        
        // Push data to the extractedStories array
        extractedStories.push({
          title,
          link,
          imageUrl
        });
      });
      
      // Send the extracted data as the response
      res.json(extractedStories);
    } catch (error) {
      console.error('Error fetching data:', error);
      res.status(500).json({ error: 'An error occurred while fetching data' });
    }
  });

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
