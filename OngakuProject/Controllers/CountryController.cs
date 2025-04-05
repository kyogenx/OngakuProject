using Microsoft.AspNetCore.Mvc;
using OngakuProject.Data;
using OngakuProject.Interfaces;
using OngakuProject.Models;

namespace OngakuProject.Controllers
{
    public class CountryController : Controller
    {
        private readonly Context _context;
        private readonly ICountry _country;

        public CountryController(Context context, ICountry country)
        {
            _context = context;
            _country = country;
        }

        [HttpGet]
        public async Task<IActionResult> GetCountries(string? Keyword)
        {
            List<Country>? Countries = await _country.GetCountriesAsync(Keyword);
            if (Countries is not null) return Json(new { success = true, result = Countries });
            else return Json(new { success = false });
        }
    }
}
