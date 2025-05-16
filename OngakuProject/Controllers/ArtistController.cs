using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OngakuProject.Data;
using OngakuProject.Interfaces;
using OngakuProject.Models;
using System.Security.Claims;

namespace OngakuProject.Controllers
{
    public class ArtistController : Controller
    {
        private readonly Context _context;
        private readonly IArtistInfo _artistInfo;
        private readonly IProfile _profile;

        public ArtistController(Context context, IArtistInfo artistInfo, IProfile profile)
        {
            _context = context;
            _artistInfo = artistInfo;
            _profile = profile;
        }

        [HttpGet]
        public async Task<IActionResult> GetInfo(int Id)
        {
            User? ArtistInfo = await _artistInfo.GetArtistPageInfoAsync(Id);
            if (ArtistInfo is not null)
            {
                int UserId = 0;
                if (User.Identity.IsAuthenticated)
                {
                    string? UserId_Str = User.FindFirstValue(ClaimTypes.NameIdentifier);
                    UserId = _profile.ParseCurrentUserId(UserId_Str);
                }

                Track? LatestRelease = await _artistInfo.GetLatestReleaseAsync(Id, UserId);
                IQueryable<Track>? PopularReleasesPreview = _artistInfo.GetMostPopularTracks(Id, UserId);
                List<Track>? PopularReleases = PopularReleasesPreview != null ? await PopularReleasesPreview.ToListAsync() : null;
                PopularReleases = PopularReleases?.OrderByDescending(t => t.TrackHistory != null ? t.TrackHistory.Count : 0).ToList();

                return Json(new { success = true, latestRelease = LatestRelease, releases = PopularReleases, result = ArtistInfo });
            }
            return Json(new { success = false });
        }
    }
}
