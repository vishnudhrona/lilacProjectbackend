const { default: axios } = require("axios");

const CACHE_DURATION = 3600;

const fetchingCountry = async (req, res) => {
    try{
      const cachedData = await req.redisClient.get('all_countries');
        
      if (cachedData) {
          return res.status(200).json(JSON.parse(cachedData));
      }

        const response = await axios.get('https://restcountries.com/v3.1/all');
        await req.redisClient.setEx(
          'all_countries',
          CACHE_DURATION,
          JSON.stringify(response.data)
      );

        res.status(200).json(response.data);        
    } catch(error) {
        res.status(500).json({ message: 'Error fetching countries', error });
    }
}

const searchingCountry = async (req, res) => {
    try {
        
        const { region, timezone, capital, name } = req.query;

        const cacheKey = `search_${region || ''}_${timezone || ''}_${capital || ''}_${name || ''}`;
        
        const cachedResults = await req.redisClient.get(cacheKey);
        
        if (cachedResults) {
            return res.status(200).json(JSON.parse(cachedResults));
        }
        
        let url = 'https://restcountries.com/v3.1/all';
        const response = await axios.get(url);
        let filteredCountries = response.data;        

        if (name) {
            filteredCountries = filteredCountries.filter((country) =>
                country.name.common.toLowerCase().includes(name.toString().toLowerCase())
              );
        }
    
        if (region) {
          filteredCountries = filteredCountries.filter((country) =>
            country.region.toLowerCase().includes(region.toString().toLowerCase())
          );
        }
    
        if (timezone) {
          filteredCountries = filteredCountries.filter((country) =>
            country.timezones.some((tz) => tz.toLowerCase().includes(timezone.toString().toLowerCase()))
          );
        }
    
        if (capital) {
          filteredCountries = filteredCountries.filter((country) =>
            country.capital && country.capital[0].toLowerCase().includes(capital.toString().toLowerCase())
          );
        }

        if (Object.keys(req.query).length > 0) {
          await req.redisClient.setEx(
              cacheKey,
              CACHE_DURATION,
              JSON.stringify(filteredCountries)
          );
      }
    
        res.status(200).json(filteredCountries);
      } catch (error) {
        res.status(500).json({ message: 'Error searching countries', error });
      }
}

const clearCache = async (req, res) => {
  try {
      await req.redisClient.flushAll();
      res.status(200).json({ message: 'Cache cleared successfully' });
  } catch (error) {
      res.status(500).json({ message: 'Error clearing cache', error });
  }
}

module.exports = {
    fetchingCountry,
    searchingCountry,
    clearCache
}