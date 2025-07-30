using Microsoft.EntityFrameworkCore;
using OngakuProject.Data;
using OngakuProject.DTO;
using OngakuProject.Interfaces;
using OngakuProject.Models;
using OngakuProject.ViewModels;

namespace OngakuProject.Repositories
{
    public class PollRep : IPoll
    {
        private readonly Context _context;
        public PollRep(Context context)
        {
            _context = context;
        }

        public IQueryable<Poll_DTO>? GetPolls(int UserId, int FetchingUserId = 0, int SkipQty = 0, int GetQty = 25, bool OnlyActiveOnes = false)
        {
            if (UserId > 0)
            {
                if (!OnlyActiveOnes) return _context.Polls.AsNoTracking().Where(p => p.UserId == UserId && !p.IsDeleted).Select(p => new Poll_DTO { Id = p.Id, ExpiresAt = p.ExpiresAt, IsAnonymous = p.IsAnonymous, IsSkippable = p.IsSkippable, Question = p.Question, IsCompleted = p.IsCompleted, MaxChoicesQty = p.IsCompleted == true ? (byte)0 : p.MaxChoicesQty, PollOptions = p.PollOptions.Select(p => new PollOption { Id = p.Id, Option = p.Option, VotesQty = p.Votes.Count(v => !v.IsDeleted) }).ToList(), TotalVotesQty = p.PollOptionVotes.Count(p => !p.IsDeleted), VotedOptionId = FetchingUserId > 0 ? p.PollOptionVotes.Where(v => v.UserId == FetchingUserId && !v.IsDeleted).Select(v => v.PollOptionId).FirstOrDefault() : null }).OrderBy(p => p.ExpiresAt).Skip(SkipQty).Take(GetQty);
                else return _context.Polls.AsNoTracking().Where(p => p.UserId == UserId && !p.IsDeleted && !p.IsCompleted).Select(p => new Poll_DTO { Id = p.Id, ExpiresAt = p.ExpiresAt, IsAnonymous = p.IsAnonymous, IsSkippable = p.IsSkippable, Question = p.Question, IsCompleted = false, MaxChoicesQty = p.MaxChoicesQty, PollOptions = p.PollOptions.Select(p => new PollOption { Id = p.Id, Option = p.Option, VotesQty = p.Votes.Count(v => !v.IsDeleted) }).ToList(), TotalVotesQty = p.PollOptionVotes.Count(p => !p.IsDeleted), VotedOptionId = FetchingUserId > 0 ? p.PollOptionVotes.Where(v => v.UserId == FetchingUserId && !v.IsDeleted).Select(v => v.PollOptionId).FirstOrDefault() : null }).OrderBy(p => p.ExpiresAt).Skip(SkipQty).Take(GetQty);
            }
            else return null;
        }

        public async Task<List<PollOption>?> GetPollOptionsAsync(int PollId)
        {
            if (PollId > 0) return await _context.PollOptions.AsNoTracking().Where(p => p.PollId == PollId && !p.IsDeleted).Select(p => new PollOption { Id = p.Id, Option = p.Option }).ToListAsync();
            else return null;
        }

        public IQueryable<PollOptionVote>? GetPollVotesByOptionsAsync(int PollId)
        {
            if (PollId > 0) return _context.PollOptionVotes.AsNoTracking().Where(p => p.PollId == PollId && !p.IsDeleted).GroupBy(p => p.PollOptionId).Select(p => new PollOptionVote { PollOptionId = p.Key, GroupVotesQty = p.Count() });
            else return null;
        }

        public IQueryable<PollOptionVote>? GetPollVotesAsync(int PollId)
        {
            if (PollId > 0) return _context.PollOptionVotes.AsNoTracking().Where(p => p.PollId == PollId && !p.IsDeleted).Select(p => new PollOptionVote { Id = p.Id, PollOptionId = p.PollOptionId });
            else return null;
        }

        public async Task<int> GetTotalVotesQtyAsync(int PollId)
        {
            if (PollId > 0) return await _context.PollOptionVotes.AsNoTracking().CountAsync(p => p.Id == PollId && !p.IsDeleted);
            else return 0;
        }

        public async Task<int> CreateAsync(Poll_VM PollModel)
        {
            if(!String.IsNullOrWhiteSpace(PollModel.Question) && PollModel.Options is not null)
            {
                if (PollModel.Options.Count > 6) PollModel.Options.RemoveRange(5, PollModel.Options.Count);
                List<PollOption>? PollOptionsSample = [.. PollModel.Options.Where(o => o != null).Select(o => new PollOption { Option = o })];

                Poll pollSample = new Poll
                {
                    CreatedAt = DateTime.Now,             
                    Question = PollModel.Question,
                    IsAnonymous = PollModel.IsAnonym,
                    IsSkippable = PollModel.IsSkippable,
                    MaxChoicesQty = PollModel.MaxChoicesQty,
                    NecessaryVoicesQty = PollModel.NecessaryVoicesQty,
                    ExpiresAt = DateTime.Now.AddMinutes(PollModel.DurationInMinutes),
                    PostId = PollModel.PostId,
                    UserId = PollModel.UserId,
                    PollOptions = PollOptionsSample
                };
                await _context.AddAsync(pollSample);
                await _context.SaveChangesAsync();

                return pollSample.Id;
            }
            return 0;
        }

        public async Task<int> EndAsync(int Id, int UserId)
        {
            if(Id > 0 && UserId > 0)
            {
                int Result = await _context.Polls.AsNoTracking().Where(p => p.Id == Id && p.UserId == UserId && !p.IsDeleted && !p.IsCompleted).ExecuteUpdateAsync(p => p.SetProperty(p => p.IsCompleted, true).SetProperty(p => p.ForceFinishedAt, DateTime.Now));
                if (Result > 0) return Id;
            }
            return 0;
        }

        public async Task<int> DeleteAsync(int Id, int UserId)
        {
            if(Id > 0 && UserId > 0)
            {
                int Result = await _context.Polls.AsNoTracking().Where(p => p.Id == Id && p.UserId == UserId && !p.IsDeleted).ExecuteUpdateAsync(p => p.SetProperty(p => p.IsDeleted, true));
                if (Result > 0) return Id;
            }
            return 0;
        }

        public async Task<int> VoteAsync(int Id, int UserId, int OptionId)
        {
            if (Id > 0 && UserId > 0 && OptionId > 0)
            {
                bool IsPollStillAvailable = await _context.Polls.AsNoTracking().AnyAsync(p => p.Id == Id && !p.IsDeleted && !p.IsCompleted);
                if (IsPollStillAvailable)
                {
                    bool HasntVotedYet = await _context.PollOptionVotes.AsNoTracking().AnyAsync(p => p.PollId == Id && p.UserId == UserId && !p.IsDeleted);
                    if (!HasntVotedYet)
                    {
                        PollOptionVote pollOptionVoteSample = new PollOptionVote
                        {
                            PollId = Id,
                            UserId = UserId,
                            PollOptionId = OptionId,
                            VotedAt = DateTime.Now
                        };
                        await _context.AddAsync(pollOptionVoteSample);
                        await _context.SaveChangesAsync();

                        return pollOptionVoteSample.Id;
                    }
                }
            }
            return 0;
        }

        public async Task<int> UserVotedOptionIndexAsync(int Id, int UserId)
        {
            if (Id > 0 && UserId > 0) return await _context.PollOptionVotes.AsNoTracking().Where(p => p.PollId == Id && p.UserId == UserId && !p.IsDeleted).Select(p => p.PollOptionId).FirstOrDefaultAsync();
            else return 0;
        }

        public async Task<bool> CheckPollOwnership(int Id, int UserId)
        {
            if (Id > 0 && UserId > 0) return await _context.Polls.AsNoTracking().AnyAsync(p => p.Id == Id && p.UserId == UserId && !p.IsDeleted);
            else return false;
        }

        public async Task<bool> CheckPollDatasAvailabilityAsync(int Id, int UserId)
        {
            if (Id > 0 && UserId > 0) return await _context.Polls.AsNoTracking().AnyAsync(p => (p.Id == Id && !p.IsDeleted) && (p.IsSkippable || p.UserId == UserId));
            else return false;
        }
    }
}
