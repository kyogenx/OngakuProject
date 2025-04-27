using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OngakuProject.Data;
using OngakuProject.Interfaces;
using OngakuProject.Models;
using OngakuProject.ViewModels;
using System.Security.Claims;

namespace OngakuProject.Controllers
{
    public class PlaylistsController : Controller
    {
        private readonly Context _context;
        private readonly IPlaylist _playlist;
        private readonly IProfile _profile;

        public PlaylistsController(Context context, IPlaylist playlist, IProfile profile)
        {
            _context = context;
            _playlist = playlist;
            _profile = profile;
        }

        [HttpPost]
        public async Task<IActionResult> Create(Playlist_VM Model)
        {
            if (ModelState.IsValid && User.Identity.IsAuthenticated)
            {
                string? UserId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                Model.UserId = _profile.ParseCurrentUserId(UserId);

                Playlist? Result = await _playlist.CreatePlaylistAsync(Model);
                if (Result is not null) {
                    Model.ImgUrl = Result.ImageUrl;
                    return Json(new { success = true, result = Model, id = Result.Id });
                }
                else return Json(new { success = false, alert = "Something’s not right with your playlist details. Please review and resubmit" });
            }
            return Json(new { sucess = false, alert = "Sign in to manage your playlists" });
        }

        [HttpPost]
        public async Task<IActionResult> EditShortname(int Id, string? Shortname)
        {
            string? UserId_Str = User.FindFirstValue(ClaimTypes.NameIdentifier);
            int UserId = _profile.ParseCurrentUserId(UserId_Str);

            string? Result = await _playlist.EditPlaylistShortnameAsync(Id, UserId, Shortname);
            if (Result != null) return Json(new { success = true, result = Result, id = Id });
            else return Json(new { success = false });
        }

        [HttpPost]
        public async Task<IActionResult> AddToFavorites(Favorites_VM Model)
        {
            if(User.Identity.IsAuthenticated)
            {
                string? UserId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                Model.UserId = _profile.ParseCurrentUserId(UserId);
                if (ModelState.IsValid)
                {
                    int Result = await _playlist.AddToFavoritesAsync(Model);
                    if (Result > 0) return Json(new { success = true, isAdded = true, id = Result, result = Model });
                }
                return Json(new { success = false, alert = "This track isn’t available to be added to your favorites" });
            }
            return Json(new { success = false, alert = "Please sign in to add this track to your favorites" });
        }

        [HttpPost]
        public async Task<IActionResult> RemoveFromFavorites(int TrackId)
        {
            if (TrackId > 0)
            {
                string? UserIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
                int UserId = _profile.ParseCurrentUserId(UserIdStr);

                int Result = await _playlist.RemoveFromFavoritesAsync(TrackId, UserId);
                if (Result > 0) return Json(new { success = true, isAdded = false, id = Result });
                else return Json(new { success = false, alert = "Removing this track from favorites is temporarily unavailable. Try again soon" });
            }
            else return Json(new { success = false, alert = "Looks like this track is already off your favorites list" });
        }

        [HttpGet]
        public async Task<IActionResult> GetFavorites()
        {
            if (User.Identity.IsAuthenticated)
            {
                string? UserIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
                int Id = _profile.ParseCurrentUserId(UserIdStr);

                IQueryable<Favorite>? FavoritesPreview = _playlist.GetFavorites(Id);
                List<Favorite>? Favorites = FavoritesPreview != null ? await FavoritesPreview.ToListAsync() : null;
                if (Favorites is not null) return Json(new { success = true, result = Favorites, count = Favorites.Count });
                else return Json(new { success = true, count = 0 });
            }
            else return Json(new { success = false });
        }

        [HttpGet]
        public async Task<IActionResult> IsTheTrackFavorited(int Id, int UserId)
        {
            bool Result = await _playlist.IsFavoritedAsync(Id, UserId);
            return Json(new { success = Result, id = Id });
        }

        [HttpGet]
        public async Task<IActionResult> Get()
        {
            string? UserIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
            int Id = _profile.ParseCurrentUserId(UserIdStr);

            IQueryable<UserPlaylist>? PlaylistsPreview = _playlist.GetPlaylists(Id);
            List<UserPlaylist>? Playlists = PlaylistsPreview is not null ? await PlaylistsPreview.ToListAsync() : null;
            int FavoriteSongsQty = await _playlist.GetFavoriteSongsQuantityAsync(Id);

            return Json(new { success = true, result = Playlists, count = Playlists?.Count, favoriteSongsQty = FavoriteSongsQty });
        }

        [HttpGet]
        public async Task<IActionResult> GetInfo(int Id, int UserId)
        {
            Playlist? PlaylistInfo = await _playlist.GetPlaylistInfoAsync(Id);
            if (PlaylistInfo is not null)
            {
                bool IsSaved = await _playlist.IsPlaylistSavedAsync(Id, UserId);
                return Json(new { success = true, result = PlaylistInfo });
            }
            else return Json(new { success = false });
        }

        [HttpGet]
        public async Task<IActionResult> GetShortname(int Id)
        {
            string? Shortname = await _playlist.GetPlaylistShortnameAsync(Id);
            return Json(new { success = true, result = Shortname });
        }

        [HttpGet]
        public async Task<IActionResult> CheckShortnameAvailability(int Id, string? Shortname)
        {
            bool Result = await _playlist.CheckPlaylistShortnameAsync(Id, Shortname);
            return Json(new { success = Result });
        }
    }
}
