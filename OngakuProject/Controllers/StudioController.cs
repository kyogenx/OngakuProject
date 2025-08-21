using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OngakuProject.Data;
using OngakuProject.DTO;
using OngakuProject.Interfaces;
using OngakuProject.Models;
using System.Security.Claims;

namespace OngakuProject.Controllers
{
    public class StudioController : Controller
    {
        private readonly Context _context;
        private readonly IAlbum _album;
        private readonly ITrack _track;
        private readonly IProfile _profile;

        public StudioController(Context context, IAlbum album, ITrack track, IProfile profile)
        {
            _context = context;
            _album = album;
            _track = track;
            _profile = profile;
        }

        [HttpGet]
        public async Task<IActionResult> GetSingles()
        {
            if (User.Identity.IsAuthenticated)
            {
                string? Id = User.FindFirstValue(ClaimTypes.NameIdentifier);
                int UserId = _profile.ParseCurrentUserId(Id);

                IQueryable<Track>? TracksPreview = _track.GetStudioItems(UserId, true);
                if (TracksPreview is not null)
                {
                    List<Track>? Tracks = await TracksPreview.ToListAsync();
                    int AlbumsQty = await _album.GetQuantityAsync(UserId, true);
                    if (Tracks != null) return Json(new { success = true, result = Tracks, count = Tracks.Count, albumsCount = AlbumsQty });
                    else Json(new { success = true, count = 0, albumsCount = AlbumsQty });
                }
            }
            return Json(new { success = false });
        }

        [HttpGet]
        public async Task<IActionResult> GetAlbums()
        {
            if (User.Identity.IsAuthenticated)
            {
                string? Id = User.FindFirstValue(ClaimTypes.NameIdentifier);
                int UserId = _profile.ParseCurrentUserId(Id);

                IQueryable<Album_DTO>? AlbumsPreview = _album.Get(UserId, true);
                if (AlbumsPreview is not null)
                {
                    List<Album_DTO>? Albums = await AlbumsPreview.ToListAsync();
                    if (Albums is not null) return Json(new { success = true, result = Albums, count = Albums.Count });
                }
            }
            return Json(new { success = false });
        }
    }
}
