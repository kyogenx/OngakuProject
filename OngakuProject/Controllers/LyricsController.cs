using Microsoft.AspNetCore.Mvc;
using OngakuProject.Interfaces;
using OngakuProject.Models;
using OngakuProject.ViewModels;
using System.Security.Claims;

namespace OngakuProject.Controllers
{
    public class LyricsController : Controller
    {
        private readonly ILyric _lyric;
        private readonly IProfile _profile;
        public LyricsController(ILyric lyric, IProfile profile)
        {
            _lyric = lyric;
            _profile = profile;
        }

        [HttpPost]
        public async Task<IActionResult> AddLyrics(Lyrics_VM Model)
        {
            if (User.Identity.IsAuthenticated)
            {
                string? UserId_Str = User.FindFirstValue(ClaimTypes.NameIdentifier);
                Model.UserId = _profile.ParseCurrentUserId(UserId_Str);
                if (ModelState.IsValid)
                {
                    int Result = await _lyric.AddrLyricsAsync(Model);
                    if (Result > 0) return Json(new { success = true, result = Model, id = Result });
                }
            }      
            return Json(new { success = false });
        }

        [HttpPost]
        public async Task<IActionResult> EditLyrics(Lyrics_VM Model)
        {
            if(User.Identity.IsAuthenticated)
            {
                string? UserId_Str = User.FindFirstValue(ClaimTypes.NameIdentifier);
                Model.UserId = _profile.ParseCurrentUserId(UserId_Str);
                if (ModelState.IsValid)
                {
                    int Result = await _lyric.EditLyricsAsync(Model);
                    if (Result > 0) return Json(new { success = true, result = Model, id = Result });
                }
            }
            return Json(new { success = false });
        }

        [HttpPost]
        public async Task<IActionResult> DeleteLyrics(int Id, int TrackId)
        {
            if(User.Identity.IsAuthenticated)
            {
                string? UserId_Str = User.FindFirstValue(ClaimTypes.NameIdentifier);
                int UserId = _profile.ParseCurrentUserId(UserId_Str);

                int Result = await _lyric.DeleteLyricsAsync(Id, TrackId, UserId);
                if (Result > 0) return Json(new { success = true, id = Result });
            }
            return Json(new { success = false });
        }

        [HttpPost]
        public async Task<IActionResult> Sync(LyricSync_VM Model)
        {
            if(User.Identity.IsAuthenticated)
            {
                string? UserId_Str = User.FindFirstValue(ClaimTypes.NameIdentifier);
                Model.UserId = _profile.ParseCurrentUserId(UserId_Str);
                if (ModelState.IsValid)
                {
                    string? Result = await _lyric.AddLyricSyncAsync(Model);
                    if (Result is not null) return Json(new { success = true });
                }
                return Json(new { success = false, error = 0 });
            }
            else return Json(new { success = false, error = -1 });
        }

        [HttpPost]
        public async Task<IActionResult> Resync(LyricSync_VM Model)
        {
            if(User.Identity.IsAuthenticated)
            {
                string? UserId_Str = User.FindFirstValue(ClaimTypes.NameIdentifier);
                Model.UserId = _profile.ParseCurrentUserId(UserId_Str);
                if (ModelState.IsValid)
                {
                    string? Result = await _lyric.EditLyricSyncAsync(Model);
                    if (Result is not null) return Json(new { success = true, id = Result });
                }
                return Json(new { success = false, error = 0 });
            }
            else return Json(new { success = false, error = -1 });
        }
    }
}
