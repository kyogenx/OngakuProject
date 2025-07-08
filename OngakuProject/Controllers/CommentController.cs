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
        private readonly ITrack _track;
        private readonly IProfile _profile;
        private readonly ITrackComment _trackComment;

        public CommentController(Context context, ITrack track, IProfile profile, ITrackComment trackComment)
        {
            _context = context;
            _track = track;
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

        [HttpPost]
        public async Task<IActionResult> Edit(Comment_VM Model)
        {
            if (User.Identity.IsAuthenticated)
            {
                string? UserId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                Model.UserId = _profile.ParseCurrentUserId(UserId);

                if (Model.Id > 0 && ModelState.IsValid)
                {
                    string? Result = await _trackComment.EditCommentAsync(Model);
                    if (Result is not null) return Json(new { success = true, id = Model.Id, result = Result });
                }
                return Json(new { success = false, error = 0 });
            }
            else return Json(new { success = false, error = -1 });
        }

        [HttpPost]
        public async Task<IActionResult> EditReply(Recomment_VM Model)
        {
            if (User.Identity.IsAuthenticated)
            {
                string? UserId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                Model.UserId = _profile.ParseCurrentUserId(UserId);
                if (ModelState.IsValid)
                {
                    string? Result = await _trackComment.EditRecommentAsync(Model);
                    if (Result is not null) return Json(new { success = true, id = Model.Id, result = Result });
                }
                return Json(new { success = false, error = 0 });
            }
            else return Json(new { success = false, error = -1 });
        }

        [HttpPost]
        public async Task<IActionResult> Reply(Recomment_VM Model) 
        {
            if (User.Identity.IsAuthenticated)
            {
                string? UserId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                Model.UserId = _profile.ParseCurrentUserId(UserId);

                if (ModelState.IsValid && Model.TrackCommentId > 0)
                {
                    int Result = await _trackComment.RecommentAsync(Model);
                    if (Result > 0) return Json(new { success = true, id = Result, currentUserId = UserId, result = Model });
                }
                return Json(new { success = false, error = 0 });
            }
            else return Json(new { success = false, error = -1 });
        }

        [HttpPost]
        public async Task<IActionResult> Pin(int Id, int TrackId)
        {
            if (User.Identity.IsAuthenticated)
            {
                string? UserId_Str = User.FindFirstValue(ClaimTypes.NameIdentifier);
                int UserId = _profile.ParseCurrentUserId(UserId_Str);

                int Result = await _trackComment.PinTheCommentAsync(Id, TrackId, UserId);
                if (Result > 0) return Json(new { success = true, result = Result });
            }
            return Json(new { success = false });
        }

        [HttpPost]
        public async Task<IActionResult> Unpin(int Id, int TrackId)
        {
            if(User.Identity.IsAuthenticated)
            {
                string? UserId_Str = User.FindFirstValue(ClaimTypes.NameIdentifier);
                int UserId = _profile.ParseCurrentUserId(UserId_Str);

                int Result = await _trackComment.UnpinTheCommentAsync(Id, TrackId, UserId);
                if (Result > 0) return Json(new { success = true, result = Result });
            }
            return Json(new { success = false });
        }

        [HttpPost]
        public async Task<IActionResult> Delete(int Id)
        {
            if(User.Identity.IsAuthenticated)
            {
                string? UserId_Str = User.FindFirstValue(ClaimTypes.NameIdentifier);
                int UserId = _profile.ParseCurrentUserId(UserId_Str);

                int Result = await _trackComment.DeleteCommentAsync(Id, UserId);
                if (Result > 0) return Json(new { success = true, result = Id });
                else return Json(new { success = false, error = 0 });
            }
            return Json(new { success = false, error = -1 });
        }

        [HttpPost]
        public async Task<IActionResult> DeleteReply(int Id)
        {
            if (User.Identity.IsAuthenticated)
            {
                string? UserId_Str = User.FindFirstValue(ClaimTypes.NameIdentifier);
                int UserId = _profile.ParseCurrentUserId(UserId_Str);

                int Result = await _trackComment.DeleteRecommentAsync(Id, UserId);
                if (Result > 0) return Json(new { success = true, result = Id });
                else return Json(new { success = false, error = 0 });
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
                bool CheckTrackOwnership = await _track.CheckTrackOwnership(Id, UserId);
                List<TrackComment>? Comments = await CommentsPreview.ToListAsync();
                if (Comments.Count > 0) return Json(new { success = true, id = Id, isOwner = CheckTrackOwnership, currentUserId = UserId, result = Comments });
                else return Json(new { success = true, isOwner = false, id = Id, currentUserId = UserId });
            }
            return Json(new { success = false, currentUserId = UserId });
        }

        [HttpGet]
        public async Task<IActionResult> TrackRecomments(int Id)
        {
            int UserId = 0;
            if (User.Identity.IsAuthenticated)
            {
                string? UserId_Str = User.FindFirstValue(ClaimTypes.NameIdentifier);
                UserId = _profile.ParseCurrentUserId(UserId_Str);
            }

            IQueryable<TrackRecomment>? RecommentsPreview = _trackComment.GetRecomments(Id);
            if (RecommentsPreview != null)
            {
                List<TrackRecomment>? Recomments = await RecommentsPreview.ToListAsync();
                if (Recomments.Count > 0) return Json(new { success = true, id = Id, currentUserId = UserId, result = Recomments });
                else return Json(new { success = true, id = Id, currentUserId = UserId });
            }
            return Json(new { success = false, currentUserId = UserId });
        }
    }
}
