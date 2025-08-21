using OngakuProject.DTO;
using OngakuProject.Models;
using OngakuProject.ViewModels;

namespace OngakuProject.Interfaces
{
    public interface IPoll
    {
        public Task<int> CreateAsync(Poll_VM PollModel);
        public Task<int> EndAsync(int Id, int UserId);
        public Task<int> DeleteAsync(int Id, int UserId);
        public Task<bool> CheckPollOwnership(int Id, int UserId);
        public Task<bool> CheckPollDatasAvailabilityAsync(int Id, int UserId);
        public Task<int> VoteAsync(int Id, int UserId, int OptionId);
        public Task<int> LikeAsync(int Id, int UserId);
        public Task<int> RemoveLikeAsync(int Id, int UserId);
        public Task<int> UserVotedOptionIndexAsync(int Id, int UserId);

        public Task<bool> UpdateLikesQtyAsync();
        public Task<int> TempSaveLikeInfoAsync(PollHasBeenLiked_VM Model);
        public Task<bool> UpdateCommsQtyAsync();
        public Task<int> TempSaveCommsInfoAsync(PollHasBeenLiked_VM Model);
        
        public Task<HashSet<PollVote_DTO>?> GetUserVotesAsync(int Id);
        public Task<HashSet<PollLike_DTO>?> GetUserLikedPollsAsync(int Id);
        public Task<HashSet<PollLike_DTO>?> GetUserPollsLikesQty(int Id);
        public IQueryable<Poll_DTO>? GetPolls(int UserId, int SkipQty = 0, int GetQty = 25, bool OnlyActiveOnes = false);
        public Task<List<PollOption>?> GetPollOptionsAsync(int PollId);
        public IQueryable<PollOptionVote>? GetPollVotesByOptionsAsync(int PollId);
        public Task<int> GetTotalVotesQtyAsync(int PollId);
    }
}
