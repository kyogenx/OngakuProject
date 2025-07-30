using OngakuProject.DTO;
using OngakuProject.ViewModels;

namespace OngakuProject.Interfaces
{
    public interface IPollComment
    {
        public Task<int> SendAsync(PollComment_VM Model);
        public Task<int> EditAsync(PollComment_VM Model);
        public Task<int> DeleteAsync(int Id, int UserId);
        public IQueryable<PollComment_DTO>? Get(int Id, int SkipQty = 0, int TakeQty = 25);

        public Task<int> ReplyAsync(PollCommentReply_VM Model);
        public Task<int> EditReplyAsync(PollCommentReply_VM Model);
        public Task<int> DeleteReplyAsync(int Id, int UserId);
        public IQueryable<PollRecomment_DTO>? GetReplies(int Id, int SkipQty, int TakeQty = 20);
    }
}
