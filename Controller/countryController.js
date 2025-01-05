const { default: axios } = require("axios");

const fetchingCountry = async (req, res) => {
    try{
        const response = await axios.get('https://restcountries.com/v3.1/all');
        res.status(200).json(response.data);        
    } catch(error) {
        res.status(500).json({ message: 'Error fetching countries', error });
    }
}

const searchingCountry = async (req, res) => {
    try {
        
        const { region, timezone, capital, name } = req.query;
        
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
    
        res.status(200).json(filteredCountries);
      } catch (error) {
        res.status(500).json({ message: 'Error searching countries', error });
      }
}

module.exports = {
    fetchingCountry,
    searchingCountry
}