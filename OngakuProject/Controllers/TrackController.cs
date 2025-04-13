using Microsoft.AspNetCore.Mvc;
using OngakuProject.Data;
using OngakuProject.Interfaces;
using OngakuProject.ViewModels;
using System.Security.Claims;

namespace OngakuProject.Controllers
{
    public class TrackController : Controller
    {
        private readonly Context _context;
        private readonly ITrack _track;
        private readonly IProfile _profile;

        public TrackController(Context context, ITrack track, IProfile profile)
        {
            _context = context;
            _track = track;
            _profile = profile;
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
    }
}
