using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OngakuProject.Data;
using OngakuProject.DTO;
using OngakuProject.Interfaces;
using OngakuProject.Models;
using OngakuProject.ViewModels;
using Org.BouncyCastle.Bcpg;
using System.Security.Claims;

namespace OngakuProject.Controllers
{
    public class PollCommentController : Controller
    {
        private readonly Context _context;
        private readonly IProfile _profile;
        private readonly IPollComment _pollComment;

        public PollCommentController(Context context, IProfile profile, IPollComment pollComment)
        {
            _context = context;
            _profile = profile;
            _pollComment = pollComment;
        }

        [HttpGet]
        public async Task<IActionResult> Get(int Id, int SkipQty)
        {
            int UserId = 0;
            IQueryable<PollComment_DTO>? ResultsPreview = _pollComment.Get(Id, SkipQty);
            if(ResultsPreview != null)
            {
                List<PollComment_DTO>? Results = await ResultsPreview.ToListAsync();
                if (Results != null) {
                    if (User.Identity.IsAuthenticated)
                    {
                        string? CurrentUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                        UserId = _profile.ParseCurrentUserId(CurrentUserId);
                    }
                    return Json(new { success = true, pollId = Id, result = Results, skip = SkipQty, userId = UserId });
                }
                else return Json(new { success = true, pollId = Id, skip = SkipQty });
            }
            return Json(new { success = false, skipQty = SkipQty });
        }

        [HttpPost]
        public async Task<IActionResult> Send(PollComment_VM Model)
        {
            if (User.Identity.IsAuthenticated)
            {
                string? CurrentUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                Model.UserId = _profile.ParseCurrentUserId(CurrentUserId);

                if (ModelState.IsValid)
                {
                    int Result = await _pollComment.SendAsync(Model);
                    if (Result > 0)
                    {
                        string? CurrentUserImg = await _profile.GetUserProfileImgAsync(Model.UserId);
                        return Json(new { success = true, result = Result, model = Model, userImg = CurrentUserImg });
                    }
                }
                return Json(new { success = false, error = 0 });
            }
            else return Json(new { success = false, error = -1 });
        }

        [HttpPost]
        public async Task<IActionResult> Edit(PollComment_VM Model)
        {
            if (User.Identity.IsAuthenticated && Model.Id > 0)
            {
                string? CurrentUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                Model.UserId = _profile.ParseCurrentUserId(CurrentUserId);

                if (ModelState.IsValid)
                {
                    int Result = await _pollComment.EditAsync(Model); ;
                    if (Result > 0) return Json(new { success = true, result = Result, text = Model.Text });
                }
                return Json(new { success = false, error = 0 });
            }
            else return Json(new { success = false, error = -1 });
        }

        [HttpPost]
        public async Task<IActionResult> Delete(int Id)
        {
            if (User.Identity.IsAuthenticated)
            {
                string? CurrentUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                int UserId = _profile.ParseCurrentUserId(CurrentUserId);

                int Result = await _pollComment.DeleteAsync(Id, UserId);
                if (Result > 0) return Json(new { success = true, result = Id });
                else return Json(new { success = false, error = 0 });
            }
            else return Json(new { success = false, error = -1 });
        }

        [HttpGet]
        public async Task<IActionResult> GetReplies(int Id, int SkipQty)
        {
            IQueryable<PollRecomment_DTO>? RepliesPreview = _pollComment.GetReplies(Id, SkipQty);
            if (RepliesPreview is not null)
            {
                List<PollRecomment_DTO>? Result = await RepliesPreview.ToListAsync();
                if (Result is not null)
                {
                    int UserId = 0;
                    string? UserImg = null;
                    if (User.Identity.IsAuthenticated)
                    {
                        string? CurrentUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                        UserId = _profile.ParseCurrentUserId(CurrentUserId);
                        UserImg = await _profile.GetUserProfileImgAsync(UserId);
                    }
                    return Json(new { success = true, result = Result, id = Id, skip = SkipQty, userId = UserId, userImg = UserImg });
                }
                return Json(new { success = false, error = 0 });
            }
            else return Json(new { success = false, error = -1 });
        }

        [HttpPost]
        public async Task<IActionResult> Reply(PollCommentReply_VM Model)
        {
            if (User.Identity.IsAuthenticated)
            {
                string? CurrentUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                Model.UserId = _profile.ParseCurrentUserId(CurrentUserId);

                if(ModelState.IsValid)
                {
                    int Result = await _pollComment.ReplyAsync(Model);
                    if (Result > 0) return Json(new { success = true, result = Result, model = Model });
                }
                return Json(new { success = false, error = 0 });
            }
            else return Json(new { success = false, error = -1 });
        }

        [HttpPost]
        public async Task<IActionResult> EditReply(PollCommentReply_VM Model)
        {
            if (User.Identity.IsAuthenticated)
            {
                string? CurrentUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                Model.UserId = _profile.ParseCurrentUserId(CurrentUserId);

                if (ModelState.IsValid)
                {
                    int Result = await _pollComment.EditReplyAsync(Model);
                    if (Result > 0) return Json(new { success = true, result = Result, text = Model.Text });
                }
                return Json(new { success = false, error = 0 });
            }
            else return Json(new { success = false, error = -1 });
        }

        [HttpPost]
        public async Task<IActionResult> DeleteReply(int Id)
        {
            if (User.Identity.IsAuthenticated)
            {
                string? CurrentUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                int UserId = _profile.ParseCurrentUserId(CurrentUserId);

                int Result = await _pollComment.DeleteReplyAsync(Id, UserId);
                if (Result > 0) return Json(new { success = true, result = Result });
                else return Json(new { success = false, error = 0 });
            }
            else return Json(new { success = false, error = -1 });
        }
    }
}
