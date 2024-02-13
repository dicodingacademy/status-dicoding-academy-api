export const handler = async () => {
  const dicodingApi = [
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
  ];

  const status = await Promise.all(dicodingApi.map(async (api) => {
    const response = await fetch(api.url);
    return {
      name: api.name,
      url: api.url,
      success: response.ok,
    };
  }));

  return {
    statusCode: 200,
    body: JSON.stringify(status),
  };
};
