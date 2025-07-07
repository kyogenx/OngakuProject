using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OngakuProject.Data;
using OngakuProject.Interfaces;
using OngakuProject.Models;
using OngakuProject.ViewModels;
using StackExchange.Redis;
using System.Security.Claims;

namespace OngakuProject.Controllers
{
    public class CommentController : Controller
    {
        private readonly Context _context;
        private readonly IProfile _profile;
        private readonly ITrackComment _trackComment;

        public CommentController(Context context, IProfile profile, ITrackComment trackComment)
        {
            _context = context;
            _profile = profile;
            _trackComment = trackComment;
        }

        [HttpPost]
        public async Task<IActionResult> Send(Comment_VM Model)
        {
            if (User.Identity.IsAuthenticated)
            {
                string? UserId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                Model.UserId = _profile.ParseCurrentUserId(UserId);

                if (ModelState.IsValid)
                {
                    int Result = await _trackComment.SendCommentAsync(Model);
                    if (Result > 0) return Json(new { success = true, currentUserId = Model.UserId, result = Model, id = Result });
                }
                return Json(new { success = false, error = 0 });
            }
            else return Json(new { success = false, error = -1 });
        }

        [HttpGet]
        public async Task<IActionResult> TrackComments(int Id, int SkipQty)
        {
            int UserId = 0;
            if(User.Identity.IsAuthenticated)
            {
                string? UserId_Str = User.FindFirstValue(ClaimTypes.NameIdentifier);
                UserId = _profile.ParseCurrentUserId(UserId_Str);
            }

            IQueryable<TrackComment>? CommentsPreview = _trackComment.GetComments(Id, 35);
            if(CommentsPreview != null)
            {
                List<TrackComment>? Comments = await CommentsPreview.ToListAsync();
                if (Comments.Count > 0) return Json(new { success = true, id = Id, currentUserId = UserId, result = Comments });
                else return Json(new { success = true, id = Id, currentUserId = UserId });
            }
            return Json(new { success = false, currentUserId = UserId });
        }
    }
}
