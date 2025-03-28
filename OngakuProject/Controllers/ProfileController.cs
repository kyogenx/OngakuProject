using Microsoft.AspNetCore.Mvc;
using OngakuProject.Data;
using OngakuProject.Interfaces;
using OngakuProject.Models;
using OngakuProject.ViewModels;
using System.Security.Claims;

namespace OngakuProject.Controllers
{
    public class ProfileController : Controller
    {
        private readonly Context _context;
        private readonly IProfile _profile;

        public ProfileController(Context context, IProfile profile)
        {
            _context = context;
            _profile = profile;
        }

        public async Task<IActionResult> P()
        {
            if(User.Identity.IsAuthenticated)
            {
                string? CurrentUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                int Id = _profile.ParseCurrentUserId(CurrentUserId);
                User? UserInfo = await _profile.GetUserByIdAsync(Id);
                if (UserInfo is not null)
                {
                    ViewBag.UserInfo = UserInfo;
                    return View();
                }
                else return RedirectToAction("Index", "Home");
            }
            return RedirectToAction("Initiate", "Account");
        }

        [HttpPost]
        public async Task<IActionResult> UpdateSearchname(string? Searchname)
        {
            string? CurrentUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            int Id = _profile.ParseCurrentUserId(CurrentUserId);

            string? Result = await _profile.UpdateSearchnameAsync(Id, Searchname);
            if (Result is not null) return Json(new { success = true, result = Result });
            else return Json(new { success = false });
        }

        [HttpPost]
        public async Task<IActionResult> UpdateMainInfo(ProfileInfo_VM Model)
        {
            if(ModelState.IsValid)
            {
                string? CurrentUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                Model.Id = _profile.ParseCurrentUserId(CurrentUserId);

                bool Result = await _profile.UpdateMainInfoAsync(Model);
                if (Result) return Json(new { success = true, result = Model });
            }
            return Json(new { success = false });
        }

        [HttpPost]
        public async Task<IActionResult> EditImages(IFormFileCollection Files)
        {
            string? Id = User.FindFirstValue(ClaimTypes.NameIdentifier);
            int UserId = _profile.ParseCurrentUserId(Id);
            if(Files.Count > 0 && UserId > 0)
            {
                string? Result = await _profile.UpdateImagesAsync(UserId, Files);
                if (Result is not null) return Json(new { success = true, result = Result });
            }
            return Json(new { success = false });
        }

        [HttpPost]
        public async Task<IActionResult> SetImageAsMain(string? ImageUrl)
        {
            string? Id = User.FindFirstValue(ClaimTypes.NameIdentifier);
            int UserId = _profile.ParseCurrentUserId(Id);
            string? Result = await _profile.UpdateMainImageAsync(UserId, ImageUrl);

            if (Result is not null) return Json(new { success = true, result = Result });
            else return Json(new { success = false });
        }

        [HttpPost]
        public async Task<IActionResult> DeleteImage(string? ImageUrl)
        {
            string? Id = User.FindFirstValue(ClaimTypes.NameIdentifier);
            int UserId = _profile.ParseCurrentUserId(Id);

            string? Result = await _profile.DeleteImageAsync(UserId, ImageUrl);
            if(Result is not null) return Json(new { success = true, deleted = ImageUrl, result = Result });
            else return Json(new { success = false });
        }

        [HttpPost]
        public async Task<IActionResult> DeleteAllImages()
        {
            string? Id = User.FindFirstValue(ClaimTypes.NameIdentifier);
            int UserId = _profile.ParseCurrentUserId(Id);

            bool Result = await _profile.DeleteAllImagesAsync(UserId);
            return Json(new { success = Result });
        }

        [HttpGet]
        public async Task<IActionResult> GetImage(int Skip)
        {
            string? Id = User.FindFirstValue(ClaimTypes.NameIdentifier);
            int UserId = _profile.ParseCurrentUserId(Id);

            string? Result = await _profile.GetAnImageAsync(UserId, Skip);
            if (Result is not null) return Json(new { success = true, result = Result, skip = Skip });
            else return Json(new { success = false });
        }

        [HttpGet]
        public async Task<IActionResult> GetImagesQty(int Id)
        {
            int Result = await _profile.GetImagesQtyAsync(Id);
            return Json(new { success = true, result = Result });
        }
    }
}
