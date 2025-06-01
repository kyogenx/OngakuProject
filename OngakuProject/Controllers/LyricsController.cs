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
