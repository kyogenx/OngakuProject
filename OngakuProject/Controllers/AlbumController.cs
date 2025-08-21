using Microsoft.AspNetCore.Mvc;
using OngakuProject.Data;
using OngakuProject.DTO;
using OngakuProject.Interfaces;
using OngakuProject.ViewModels;
using System.Security.Claims;

namespace OngakuProject.Controllers
{
    public class AlbumController : Controller
    {
        private readonly IAlbum _album;
        private readonly IProfile _profile;
        private readonly Context _context;

        public AlbumController(IAlbum album, IProfile profile, Context context)
        {
            _album = album;
            _profile = profile;
            _context = context;
        }

        [HttpPost]
        public async Task<IActionResult> Create(Album_VM Model)
        {
            if(User.Identity.IsAuthenticated)
            {
                string? UserId_Str = User.FindFirstValue(ClaimTypes.NameIdentifier);
                Model.UserId = _profile.ParseCurrentUserId(UserId_Str);

                if(ModelState.IsValid)
                {
                    int Result = await _album.UploadNewAlbumAsync(Model);
                    if (Result > 0) return Json(new { success = true, result = Result, model = Model });
                }
                return Json(new { success = false, error = 0 });
            }
            else return Json(new { success = false, error = -1 });
        }

        [HttpPost]
        public async Task<IActionResult> EditMetadata(AlbumMetadata_VM Model)
        {
            if(User.Identity.IsAuthenticated)
            {
                string? UserId_Str = User.FindFirstValue(ClaimTypes.NameIdentifier);
                Model.UserId = _profile.ParseCurrentUserId(UserId_Str);

                if (ModelState.IsValid)
                {
                    int Result = await _album.EditMetadataAsync(Model);
                    if (Result > 0) return Json(new { success = true, result = Result, model = Model });
                }
                return Json(new { success = false, error = 0 });
            }
            else return Json(new { success = false, error = -1 });
        }

        [HttpPost]
        public async Task<IActionResult> EditCoverImage(int Id, IFormFile CoverImage)
        {
            if (User.Identity.IsAuthenticated)
            {
                string? UserId_Str = User.FindFirstValue(ClaimTypes.NameIdentifier);
                int UserId = _profile.ParseCurrentUserId(UserId_Str);

                string? Result = await _album.EditCoverImageAsync(Id, UserId, CoverImage);
                if (Result is not null) return Json(new { success = true, result = Result });
                else return Json(new { success = false, error = 0 });
            }
            else return Json(new { success = false, error = -1 });
        }

        [HttpPost]
        public async Task<IActionResult> EditVersion(int Id, int Version)
        {
            if(User.Identity.IsAuthenticated)
            {
                string? UserId_Str = User.FindFirstValue(ClaimTypes.NameIdentifier);
                int UserId = _profile.ParseCurrentUserId(UserId_Str);

                int Result = await _album.EditVersionAsync(Id, UserId, Version);
                if (Result > 0) return Json(new { success = true, id = Id, version = Version });
                else return Json(new { success = false, error = 0 });
            }
            return Json(new { success = false, error = -1 });
        }

        [HttpPost]
        public async Task<IActionResult> EditPremiereDate(int Id, DateTime PremiereDate)
        {
            if (User.Identity.IsAuthenticated)
            {
                string? UserId_Str = User.FindFirstValue(ClaimTypes.NameIdentifier);
                int UserId = _profile.ParseCurrentUserId(UserId_Str);

                int Result = await _album.EditPremiereDateAsync(Id, UserId, PremiereDate);
                if (Result > 0) return Json(new { success = true, result = Result, date = PremiereDate });
                else return Json(new { success = false, error = 0 });
            }
            else return Json(new { success = false, error = -1 });
        }

        [HttpPost]
        public async Task<IActionResult> Submit(int Id)
        {
            if(User.Identity.IsAuthenticated)
            {
                string? UserId_Str = User.FindFirstValue(ClaimTypes.NameIdentifier);
                int UserId = _profile.ParseCurrentUserId(UserId_Str);

                int Result = await _album.SubmitAsync(Id, UserId);
                if (Result > 0) return Json(new { success = true, result = Result });
                else return Json(new { success = false, error = 0 });
            }
            else return Json(new { success = false, error = -1 });
        }

        [HttpPost]
        public async Task<IActionResult> Disable(int Id)
        {
            if (User.Identity.IsAuthenticated)
            {
                string? UserId_Str = User.FindFirstValue(ClaimTypes.NameIdentifier);
                int UserId = _profile.ParseCurrentUserId(UserId_Str);

                int Result = await _album.DisableAsync(Id, UserId);
                if (Result > 0) return Json(new { success = true, result = Result });
                else return Json(new { success = false, error = 0 });
            }
            else return Json(new { success = false, error = -1 });
        }

        [HttpPost]
        public async Task<IActionResult> Enable(int Id)
        {
            if (User.Identity.IsAuthenticated)
            {
                string? UserId_Str = User.FindFirstValue(ClaimTypes.NameIdentifier);
                int UserId = _profile.ParseCurrentUserId(UserId_Str);

                int Result = await _album.EnableAsync(Id, UserId);
                if (Result > 0) return Json(new { success = true, result = Result });
                else return Json(new { success = false, error = 0 });
            }
            else return Json(new { success = false, error = -1 });
        }

        [HttpPost]
        public async Task<IActionResult> PushTracks(int Id, List<int> TrackId, List<int> Order)
        {
            if (User.Identity.IsAuthenticated && TrackId.Count == Order.Count)
            {
                List<AlbumTrack_VM> IncludedTracks = new List<AlbumTrack_VM>();
                IncludedTracks.AddRange(TrackId.Select((TrackId, Index) => new AlbumTrack_VM
                {
                    Id = TrackId,
                    OrderNumber = Order[Index]
                }));

                string? UserId_Str = User.FindFirstValue(ClaimTypes.NameIdentifier);
                int UserId = _profile.ParseCurrentUserId(UserId_Str);

                int Result = await _album.ApplyTracklistToAlbumAsync(Id, UserId, IncludedTracks);
                if (Result > 0) return Json(new { success = true, result = Result, count = IncludedTracks.Count, model = IncludedTracks });
                else return Json(new { success = false, error = 0 });
            }
            else return Json(new { success = false, error = -1 });
        }

        [HttpGet]
        public async Task<IActionResult> GetInfo(int Id, byte Type)
        {
            int UserId = 0;
            Album_DTO? AlbumInfo = null;
            if (User.Identity.IsAuthenticated)
            {
                string? UserId_Str = User.FindFirstValue(ClaimTypes.NameIdentifier);
                UserId = _profile.ParseCurrentUserId(UserId_Str);

                AlbumInfo = Type == 0 ? await _album.GetInfoAsync(Id, UserId, true) : await _album.GetInfoAsync(Id, UserId, false);
            }
            else AlbumInfo = await _album.GetInfoAsync(Id);

            if (AlbumInfo is not null) return Json(new { success = true, userId = UserId, result = AlbumInfo, type = Type });
            else return Json(new { success = false });
        }
    }
}
