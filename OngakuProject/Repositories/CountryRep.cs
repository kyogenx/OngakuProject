using Microsoft.EntityFrameworkCore;
using OngakuProject.Data;
using OngakuProject.Interfaces;
using OngakuProject.Models;

namespace OngakuProject.Repositories
{
    public class CountryRep : ICountry
    {
        private readonly Context _context;
        public CountryRep(Context context)
        {
            _context = context;
        }

        public async Task<List<Country>?> GetCountriesAsync(string? Keyword)
        {
            if (Keyword == null) return await _context.Countries.AsNoTracking().Select(c => new Country { Id = c.Id, Name = c.Name, Shortname = c.Shortname }).ToListAsync();
            else return await _context.Countries.AsNoTracking().Where(c => c.Name!.ToLower().Contains(Keyword.ToLower()) || c.Shortname!.ToLower().Contains(Keyword.ToLower()) || c.PhoneCode.ToString().Contains(Keyword.ToLower())).Select(c => new Country { Id = c.Id, Name = c.Name, Shortname = c.Shortname }).OrderByDescending(c => c.Id).ToListAsync();           
        }

        public async Task<List<Country>?> GetCountriesWPhoneCodesAsync(string? Keyword)
        {
            if (Keyword == null) return await _context.Countries.AsNoTracking().Select(c => new Country { Id = c.Id, Name = c.Name, Shortname = c.Shortname, PhoneCode = c.PhoneCode }).ToListAsync();
            else return await _context.Countries.AsNoTracking().Where(c => c.Name!.ToLower().Contains(Keyword.ToLower()) || c.Shortname!.ToLower().Contains(Keyword.ToLower()) || c.PhoneCode.ToString().Contains(Keyword.ToLower())).Select(c => new Country { Id = c.Id, Name = c.Name, Shortname = c.Shortname, PhoneCode = c.PhoneCode }).OrderByDescending(c => c.Id).ToListAsync();
        }

        public async Task<Country?> GetCountryInfoAsync(int Id)
        {
            if (Id > 0) return await _context.Countries.AsNoTracking().Where(c => c.Id == Id).Select(c => new Country { Id = c.Id, Name = c.Name, Shortname = c.Shortname, PhoneCode = c.PhoneCode }).FirstOrDefaultAsync();
            else return null;
        }
    }
}
