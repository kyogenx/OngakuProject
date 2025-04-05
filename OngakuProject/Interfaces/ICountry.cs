using OngakuProject.Models;

namespace OngakuProject.Interfaces
{
    public interface ICountry
    {
        public Task<List<Country>?> GetCountriesAsync(string? Keyword);
        public Task<List<Country>?> GetCountriesWPhoneCodesAsync(string? Keyword);
        public Task<Country?> GetCountryInfoAsync(int Id);
    }
}
