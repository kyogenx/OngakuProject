using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OngakuProject.Data;
using OngakuProject.Interfaces;
using OngakuProject.Models;

namespace OngakuProject.Controllers
{
    public class GenreController : Controller
    {
        private readonly Context _context;
        private readonly IGenre _genre;

        public GenreController(Context context, IGenre genre)
        {
            _context = context;
            _genre = genre;
        }

        [HttpGet]
        public async Task<IActionResult> Search(byte Type, string? Keyword)
        {
            IQueryable<Genre>? GenresPreview = null;
            if (Keyword == null) GenresPreview = _genre.GetAllGenres();
            else GenresPreview = _genre.GetAllGenres(Keyword);
            if(GenresPreview != null)
            {
                List<Genre>? Genres = await GenresPreview.ToListAsync();
                return Json(new { success = true, type = Type, result = Genres, count = Genres.Count, keyword = Keyword });
            }
            return Json(new { success = false });
        }
    }
}
