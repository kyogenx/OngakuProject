using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OngakuProject.Data;
using OngakuProject.Interfaces;
using OngakuProject.Models;

namespace OngakuProject.Controllers
{
    public class SearchController : Controller
    {
        private readonly Context _context;
        private readonly ISearch _search;
        public SearchController(Context context, ISearch search)
        {
            _context = context;
            _search = search;
        }


        [HttpGet]
        public async Task<IActionResult> FindPlaylists(string? Keyword)
        {
            IQueryable<Playlist>? PlaylistsPreview = _search.GetAllPlaylists();
            if(PlaylistsPreview != null)
            {
                List<Playlist>? Playlists = await PlaylistsPreview.ToListAsync();
                if (Playlists != null) return Json(new { success = true, result = Playlists });
            }
            return Json(new { success = false });
        }
    }
}
