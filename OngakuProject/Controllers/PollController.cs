using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OngakuProject.Data;
using OngakuProject.DTO;
using OngakuProject.Interfaces;
using OngakuProject.Models;
using OngakuProject.ViewModels;
using System.Security.Claims;

namespace OngakuProject.Controllers
{
    public class PollController : Controller
    {
        private readonly IPoll _poll;
        private readonly IProfile _profile;
        public PollController(IPoll poll, IProfile profile)
        {
            _poll = poll;
            _profile = profile;
        }

        [HttpGet]
        public async Task<IActionResult> GetByUser(int Id, byte Type, int SkipQty = 0)
        {
            int UserId = 0;
            IQueryable<Poll_DTO>? PollsPreview = null;

            if (User.Identity.IsAuthenticated)
            {
                string? CurrentUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                UserId = _profile.ParseCurrentUserId(CurrentUserId);
            }

            if (Id > 0) PollsPreview = _poll.GetPolls(Id, UserId, SkipQty);
            else
            {
                PollsPreview = _poll.GetPolls(UserId, UserId, SkipQty);
            }

            if(PollsPreview is not null)
            {
                List<Poll_DTO>? Polls = await PollsPreview.ToListAsync();     
                if(Polls is not null)
                {
                    foreach(Poll_DTO Poll in Polls)
                    {
                        if(Poll.VotedOptionId == null || Poll.VotedOptionId <= 0)
                        {
                            Poll.PollOptions.ForEach(o => o.VotesQty = 0);
                        }
                    }
                }
                return Json(new { success = true, result = Polls, type = Type, skip = SkipQty });
            }
            return Json(new { success = false, error = 0 });
        }

        [HttpGet]
        public async Task<IActionResult> GetLiveDatas(int Id)
        {
            if (Id > 0)
            {
                int UserId = 0;
                if(User.Identity.IsAuthenticated)
                {
                    string? CurrentUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                    UserId = _profile.ParseCurrentUserId(CurrentUserId);
                }

                bool PollOwnership = await _poll.CheckPollDatasAvailabilityAsync(Id, UserId);
                if (PollOwnership)
                {
                    IQueryable<PollOptionVote>? VotesPreview = _poll.GetPollVotesByOptionsAsync(Id);
                    if (VotesPreview is not null)
                    {
                        List<PollOptionVote>? Result = await VotesPreview.ToListAsync();
                        if (Result is not null)
                        {
                            int VotedOptionId = 0;
                            if (UserId > 0) VotedOptionId = await _poll.UserVotedOptionIndexAsync(Id, UserId);
                            return Json(new { success = true, id = Id, result = Result, totalVotesQty = Result.Sum(r => r.GroupVotesQty), votedOptionId = VotedOptionId });
                        }
                    }
                }
            }
            return Json(new { success = false });
        }

        [HttpPost]
        public async Task<IActionResult> Create(Poll_VM Model)
        {
            if (User.Identity.IsAuthenticated)
            {
                string? CurrentUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                Model.UserId = _profile.ParseCurrentUserId(CurrentUserId);

                if (ModelState.IsValid)
                {
                    int Result = await _poll.CreateAsync(Model);
                    if (Result > 0) return Json(new { success = true, result = Result, model = Model, options = Model.Options });
                }
                return Json(new { success = false, error = 0 });
            }
            return Json(new { success = false, error = -1 });
        }

        [HttpPost]
        public async Task<IActionResult> End(int Id)
        {
            if (User.Identity.IsAuthenticated)
            {
                string? CurrentUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                int UserId = _profile.ParseCurrentUserId(CurrentUserId);

                int Result = await _poll.EndAsync(Id, UserId);
                if (Result > 0) return Json(new { success = true, result = Result });
                else return Json(new { success = false, error = 0 });
            }
            else return Json(new { success = false, error = -1 });
        }

        [HttpPost]
        public async Task<IActionResult> Vote(int Id, int PollId, bool LoadResults = false)
        {
            if (User.Identity.IsAuthenticated)
            {
                string? CurrentUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                int UserId = _profile.ParseCurrentUserId(CurrentUserId);
                int Result = await _poll.VoteAsync(PollId, UserId, Id);

                if (Result > 0)
                {
                    List<PollOptionVote>? LiveDatas = null;
                    if (LoadResults)
                    {
                        IQueryable<PollOptionVote>? LiveDatasPreview = _poll.GetPollVotesByOptionsAsync(PollId);
                        LiveDatas = LiveDatasPreview != null ? await LiveDatasPreview.ToListAsync() : null;
                    }
                    return Json(new { success = true, result = Id, pollId = PollId, id = Result, liveDatas = LiveDatas, totalVotesQty = LiveDatas != null ? LiveDatas.Sum(l => l.GroupVotesQty) : 0 });
                }
                else return Json(new { success = false, error = 0 });
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

                int Result = await _poll.DeleteAsync(Id, UserId);
                if (Result > 0) return Json(new { success = true, result = Result });
                else return Json(new { success = false, error = 0 });
            }
            else return Json(new { success = false, error = -1 });
        }
    }
}
