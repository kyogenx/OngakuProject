using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OngakuProject.Data;
using OngakuProject.Interfaces;
using OngakuProject.Models;
using OngakuProject.ViewModels;
using System.ComponentModel.DataAnnotations;
using System.Security.Claims;

namespace OngakuProject.Controllers
{
    public class TrackController : Controller
    {
        private readonly Context _context;
        private readonly ITrack _track;
        private readonly IProfile _profile;
        private readonly IGenre _genre;
        private readonly ITrackAnalytic _trackAnalytic;
        private readonly IWebHostEnvironment _webHostEnvironment;

        public TrackController(Context context, ITrack track, IProfile profile, IGenre genre, ITrackAnalytic trackAnalytic, IWebHostEnvironment webHostEnvironment)
        {
            _context = context;
            _track = track;
            _profile = profile;
            _genre = genre;
            _trackAnalytic = trackAnalytic;
            _webHostEnvironment = webHostEnvironment;
        }

        [HttpPost]
        public async Task<IActionResult> Release(Track_VM Model)
        {
            if (User.Identity.IsAuthenticated)
            {
                string? Id = User.FindFirstValue(ClaimTypes.NameIdentifier);
                Model.UserId = _profile.ParseCurrentUserId(Id);
                if (ModelState.IsValid)
                {
                    int Result = await _track.UploadTrackAsync(Model);
                    if (Result > 0)
                    {
                        await _track.UpdateGenresAsync(new TrackGenre_VM { Id = Result, Genres = Model.Genres });
                        if (Model.FeaturingArtists != null) await _track.UpdateFeaturingArtistsAsync(new TrackArtist_VM { Id = Result, FeaturingArtists = Model.FeaturingArtists });
                        return Json(new { success = true, result = Model });
                    }
                    else return Json(new { success = false, alert = "The track upload process was interrupted by an internal server error. Please try again later" });
                }
                else
                {
                    if (ModelState.ErrorCount > 1) return Json(new { success = false, alert = "Please provide the correct fields to upload your track. There are " + ModelState.ErrorCount + " incorrect fields" });
                    else return Json(new { success = false, alert = "One of the fields is incorrect. Please review your form before uploading your track" });
                }
            }
            else return Json(new { success = false, alert = "You need to sign in before uploading a track" });
        }

        //[HttpPost]
        //public async Task<IActionResult> UpdateCreditsInfo(TrackCredits_VM Model)
        //{
        //    if (ModelState.IsValid)
        //    {
        //        int Result = await _track.UpdateCreditsAsync(Model);
        //        if (Result > 0) return Json(new { success = true, result = Model, id = Result });
        //    }
        //    return Json(new { success = false });
        //}

        [HttpPost]
        public async Task<IActionResult> UpdateCoverImage(TrackURL_VM Model)
        {
            string? Id = User.FindFirstValue(ClaimTypes.NameIdentifier);
            Model.UserId = _profile.ParseCurrentUserId(Id);
            if (ModelState.IsValid)
            {
                string? Result = await _track.UpdateCoverImageAsync(Model);
                if (Result != null) return Json(new { success = true, id = Model.Id, result = Result });
            }
            return Json(new { success = false });
        }

        [HttpPost]
        public async Task<IActionResult> UpdateCredits(TrackCredits_VM Model)
        {
            string? Id = User.FindFirstValue(ClaimTypes.NameIdentifier);
            Model.MainArtistId = _profile.ParseCurrentUserId(Id);
            if (ModelState.IsValid)
            {
                int Result = await _track.UpdateCreditsAsync(Model);
                if (Result > 0) return Json(new { success = true, id = Result, result = Model });
            }
            return Json(new { success = false });
        }

        [HttpPost]
        public async Task<IActionResult> UpdateLyrics(Lyrics_VM Model)
        {
            string? UserIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
            Model.UserId = _profile.ParseCurrentUserId(UserIdStr);
            int Result = await _track.UpdateLyricsAsync(Model);

            if (Result > 0) return Json(new { success = true, result = Model, id = Result });
            else return Json(new { success = false });
        }

        [HttpPost]
        public async Task<IActionResult> DeleteLyrics(int Id)
        {
            string? UserIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
            int UserId = _profile.ParseCurrentUserId(UserIdStr);
            int Result = await _track.DeleteLyricsAsync(Id, UserId);

            if (Result > 0) return Json(new { success = true, id = Result });
            else return Json(new { success = false });
        }

        [HttpPost]
        public async Task<IActionResult> UpdateStatus(int Id, int Status)
        {
            string? UserIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
            int UserId = _profile.ParseCurrentUserId(UserIdStr);
            if(UserId > 0)
            {
                int Result = await _track.UpdateStatusAsync(Id, UserId, Status);
                if (Result != -1) return Json(new { success = true, id = Id, status = Status, updatedStatus = Result });
            }
            return Json(new { success = false });
        }

        [HttpGet]
        public async Task<IActionResult> GetStudioItems()
        {
            if (User.Identity.IsAuthenticated)
            {
                string? Id = User.FindFirstValue(ClaimTypes.NameIdentifier);
                int UserId = _profile.ParseCurrentUserId(Id);

                IQueryable<Track>? TracksPreview = _track.GetStudioItems(UserId, true);
                if(TracksPreview is not null)
                {
                    List<Track>? Tracks = await TracksPreview.ToListAsync();
                    if (Tracks is not null) return Json(new { success = true, result = Tracks, count = Tracks.Count });
                }
            }
            return Json(new { success = false });
        }

        [HttpGet]
        public async Task<IActionResult> GetSingleInfo(int Id, bool IsForAuthor = false)
        {
            int UserId = 0;
            if (User.Identity.IsAuthenticated)
            {
                string? UserId_Str = User.FindFirstValue(ClaimTypes.NameIdentifier);
                UserId = _profile.ParseCurrentUserId(UserId_Str);
            }

            Track? TrackInfo = await _track.GetTrackInfoAsync(Id, UserId, IsForAuthor);
            if (TrackInfo is not null) return Json(new { success = true, userId = UserId, isForAuthor = IsForAuthor, result = TrackInfo });
            else return Json(new { success = false });
        }

        [HttpGet]
        public async Task<IActionResult> Load(int Id, int PlaylistId, byte Type = 0)
        {
            int UserId = 0;
            if (User.Identity.IsAuthenticated)
            {
                string? UserId_Str = User.FindFirstValue(ClaimTypes.NameIdentifier);
                UserId = _profile.ParseCurrentUserId(UserId_Str);
            }

            Track? TrackResult = Type == 0 ? await _track.LoadTheTrackAsync(Id, PlaylistId, UserId) : await _track.LoadTheTrackAsync(Id, PlaylistId);
            if (TrackResult is not null)
            {
                if(Type == 0) await _trackAnalytic.AddTrackListenQueueAsync(UserId, Id);
                return Json(new { success = true, type = Type, playlistId = PlaylistId, result = TrackResult });
            }
            else return Json(new { success = false });
        }

        [HttpGet]
        public async Task<IActionResult> StreamAudio(int Id, string? Url)
        {
            if(!String.IsNullOrWhiteSpace(Url) && Id > 0)
            {
                string? PathInfo = Path.Combine(_webHostEnvironment.WebRootPath, "Tracks", Url);
                if(System.IO.File.Exists(PathInfo))
                {
                    FileStream? FileInfo = System.IO.File.OpenRead(PathInfo);
                    if (FileInfo is not null)
                    {
                        return File(FileInfo, "audio/mpeg", enableRangeProcessing: true);
                    }
                }
            }
            return NotFound();
        }

        [HttpGet]
        public async Task<IActionResult> GetTrackCredits(int Id, byte Type)
        {
            TrackCredit? Result = await _track.GetCreditsAsync(Id);
            if (Result is not null) return Json(new { success = true, type = Type, id = Id, result = Result });
            else return Json(new { success = false, id = Id, type = Type });
        }

        [HttpGet]
        public async Task<IActionResult> GetLyrics(int Id, byte Type)
        {
            Lyrics? Result = await _track.GetLyricsAsync(Id);
            if (Result is not null) return Json(new { success = true, type = Type, id = Id, result = Result });
            return Json(new { success = false, id = Id, type = Type });
        }
    }
}
