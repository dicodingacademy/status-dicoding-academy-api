const dicodingAPIs = [
  {
    name: 'Restaurant API',
    url: 'https://restaurant-api.dicoding.dev/',
  },
  {
    name: 'Quote API',
    url: 'https://quote-api.dicoding.dev/',
  },
  {
    name: 'Tourism API',
    url: 'https://tourism-api.dicoding.dev/',
  },
  {
    name: 'Coffee API',
    url: 'https://coffee-api.dicoding.dev/',
  },
  {
    name: 'Books API',
    url: 'https://books-api.dicoding.dev/',
  },
  {
    name: 'Sports API',
    url: 'https://sports-api.dicoding.dev/',
  },
  {
    name: 'Movie API',
    url: 'https://movie-api.dicoding.dev/',
  },
  {
    name: 'Story API',
    url: 'https://story-api.dicoding.dev/v1/',
  },
  {
    name: 'Contact API',
    url: 'https://contact-api.dicoding.dev/v1/',
  },
  {
    name: 'Notes API',
    url: 'https://notes-api.dicoding.dev/v1/',
  },
  {
    name: 'OpenSpace API',
    url: 'https://openspace-api.netlify.app/v1/',
  },
  {
    name: 'Forum API',
    url: 'https://forum-api.dicoding.dev/v1/',
  },
  {
    name: 'Tracker Money API',
    url: 'https://tracker-money-api.dicoding.dev/v1',
  },
  {
    name: 'Classification API',
    url: 'https://classification-api.dicoding.dev',
  },
];

async function isAPIOk({ name, url }) {
  try {
    const { ok, status } = await fetch(url);
    return { name, url, ok, status };
  } catch (error) {
    return { name, url, ok: false, status: false };
  }
}

async function getDicodingAPIsStatus() {
  const promises = dicodingAPIs.map(isAPIOk);
  return Promise.all(promises);
}

export { getDicodingAPIsStatus };
