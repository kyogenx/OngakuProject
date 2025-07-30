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
        private readonly IUser _user;
        public SearchController(Context context, ISearch search, IUser user)
        {
            _context = context;
            _search = search;
            _user = user;
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

        [HttpGet]
        public async Task<IActionResult> MentionSearch(string? Searchname)
        {
            IQueryable<User?>? ResultPreview = _user.MentionSearch(Searchname);
            if (ResultPreview != null)
            {
                List<User?>? Result = await ResultPreview.ToListAsync();
                if (Result is not null) return Json(new { success = true, result = Result });
            }
            return Json(new { success = false });
        }
    }
}
