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
        private readonly ITrack _track;

        public PlaylistsController(Context context, IPlaylist playlist, IProfile profile, ITrack track)
        {
            _context = context;
            _playlist = playlist;
            _profile = profile;
            _track = track;
        }

        [HttpPost]
        public async Task<IActionResult> Create(Playlist_VM Model)
        {
            if (ModelState.IsValid && User.Identity.IsAuthenticated)
            {
                string? UserId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                Model.UserId = _profile.ParseCurrentUserId(UserId);

                Playlist? Result = await _playlist.CreateAsync(Model);
                if (Result is not null) {
                    Model.ImgUrl = Result.ImageUrl;
                    return Json(new { success = true, result = Model, id = Result.Id });
                }
                else return Json(new { success = false, alert = "Something’s not right with your playlist details. Please review and resubmit" });
            }
            return Json(new { sucess = false, alert = "Sign in to manage your playlists" });
        }

        [HttpPost]
        public async Task<IActionResult> Edit(Playlist_VM Model)
        {
            string? UserId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            Model.UserId = _profile.ParseCurrentUserId(UserId);

            int Result = await _playlist.EditAsync(Model);
            if (Result > 0) return Json(new { success = true, id = Result, result = Model });
            else return Json(new { success = false });
        }

        [HttpPost]
        public async Task<IActionResult> EditShortname(int Id, string? Shortname)
        {
            string? UserId_Str = User.FindFirstValue(ClaimTypes.NameIdentifier);
            int UserId = _profile.ParseCurrentUserId(UserId_Str);

            string? Result = await _playlist.EditShortnameAsync(Id, UserId, Shortname);
            if (Result != null) return Json(new { success = true, result = Result, id = Id });
            else return Json(new { success = false });
        }

        [HttpPost]
        public async Task<IActionResult> EditCoverImage(int Id, IFormFile? ImageUrl)
        {
            string? UserId_Str = User.FindFirstValue(ClaimTypes.NameIdentifier);
            int UserId = _profile.ParseCurrentUserId(UserId_Str);

            string? Result = await _playlist.EditImageAsync(Id, UserId, ImageUrl);
            if (Result is not null) return Json(new { success = true, result = Result, id = Id });
            else return Json(new { success = false });
        }

        [HttpPost]
        public async Task<IActionResult> Remove(int Id)
        {
            string? UserId_Str = User.FindFirstValue(ClaimTypes.NameIdentifier);
            int UserId = _profile.ParseCurrentUserId(UserId_Str);

            int Result = await _playlist.RemoveAsync(Id, UserId);
            if (Result > 0) return Json(new { success = true, id = Result });
            else return Json(new { success = false });
        }

        [HttpPost]
        public async Task<IActionResult> Pin(int Id)
        {
            string? UserId_Str = User.FindFirstValue(ClaimTypes.NameIdentifier);
            int UserId = _profile.ParseCurrentUserId(UserId_Str);

            int Result = await _playlist.PinAsync(Id, UserId);
            if (Result > 0) return Json(new { success = true, id = Result });
            else return Json(new { success = false });
        }

        [HttpPost]
        public async Task<IActionResult> Unpin(int Id)
        {
            string? UserId_Str = User.FindFirstValue(ClaimTypes.NameIdentifier);
            int UserId = _profile.ParseCurrentUserId(UserId_Str);

            int Result = await _playlist.UnpinAsync(Id, UserId);
            if (Result > 0) return Json(new { success = true, id = Result });
            else return Json(new { success = false });
        }

        [HttpPost]
        public async Task<IActionResult> Delete(int Id)
        {
            string? UserId_Str = User.FindFirstValue(ClaimTypes.NameIdentifier);
            int UserId = _profile.ParseCurrentUserId(UserId_Str);

            int Result = await _playlist.DeleteAsync(Id, UserId);
            if (Result > 0) return Json(new { success = true, id = Result });
            else return Json(new { success = false });
        }

        [HttpPost]
        public async Task<IActionResult> AddToPlaylist(TrackManagement_VM Model)
        {
            string? UserId_Str = User.FindFirstValue(ClaimTypes.NameIdentifier);
            Model.UserId = _profile.ParseCurrentUserId(UserId_Str);
            if (ModelState.IsValid)
            {
                int Result = await _track.AddToPlaylistAsync(Model);
                if (Result > 0) return Json(new { success = true, trackId = Model.Id, id = Result });
            }
            return Json(new { success = false });
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
                    int Result = await _track.AddToFavoritesAsync(Model);
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

                int Result = await _track.RemoveFromFavoritesAsync(TrackId, UserId);
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
                if (Favorites is not null) return Json(new { success = true, userId = Id, result = Favorites, count = Favorites.Count });
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
        public async Task<IActionResult> Get(byte Type)
        {
            string? UserIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
            int Id = _profile.ParseCurrentUserId(UserIdStr);

            IQueryable<UserPlaylist>? PlaylistsPreview = _playlist.GetPlaylists(Id, Type > 0 ? true : false);
            List<UserPlaylist>? Playlists = PlaylistsPreview is not null ? await PlaylistsPreview.ToListAsync() : null;
            int FavoriteSongsQty = await _playlist.GetFavoriteSongsQuantityAsync(Id);

            return Json(new { success = true, type = Type, result = Playlists, count = Playlists?.Count, favoriteSongsQty = FavoriteSongsQty });
        }

        [HttpGet]
        public async Task<IActionResult> GetInfo(int Id, int UserId)
        {
            Playlist? PlaylistInfo = await _playlist.GetPlaylistInfoAsync(Id, false);
            if (PlaylistInfo is not null)
            {
                bool IsSaved = await _playlist.IsPlaylistSavedAsync(Id, UserId);
                return Json(new { success = true, userId = UserId, isSaved = IsSaved, result = PlaylistInfo });
            }
            return Json(new { success = false });
        }

        [HttpGet]
        public async Task<IActionResult> GetTracks(int Id, int UserId, int Skip, int TakeQty)
        {
            IQueryable<Track?>? PlaylistTracksPreview = _playlist.GetPlaylistTracks(Id, UserId, Skip, TakeQty);
            List<Track?>? PlaylistTracks = PlaylistTracksPreview != null ? await PlaylistTracksPreview.ToListAsync() : null;
            
            if (PlaylistTracks is not null) return Json(new { success = true, result = PlaylistTracks, skip = Skip });
            return Json(new { success = false });
        }

        [HttpGet]
        public async Task<IActionResult> GetEditInfo(int Id)
        {
            Playlist? Result = await _playlist.GetPlaylistEditInfoAsync(Id);
            if (Result is not null) return Json(new { success = true, result = Result });
            else return Json(new { success = false });
        }

        [HttpGet]
        public async Task<IActionResult> GetShortname(int Id)
        {
            string? Shortname = await _playlist.GetPlaylistShortnameAsync(Id);
            return Json(new { success = true, id = Id, result = Shortname });
        }

        [HttpGet]
        public async Task<IActionResult> CheckShortnameAvailability(int Id, string? Shortname)
        {
            bool Result = await _playlist.CheckPlaylistShortnameAsync(Id, Shortname);
            return Json(new { success = Result });
        }
    }
}
