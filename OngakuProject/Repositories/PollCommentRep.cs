using Microsoft.EntityFrameworkCore;
using OngakuProject.Data;
using OngakuProject.DTO;
using OngakuProject.Interfaces;
using OngakuProject.Models;
using OngakuProject.ViewModels;

namespace OngakuProject.Repositories
{
    public class PollCommentRep : IPollComment
    {
        public Context _context;
        public PollCommentRep(Context context)
        {
            _context = context;
        }

        public async Task<int> SendAsync(PollComment_VM Model)
        {
            if(!String.IsNullOrWhiteSpace(Model.Text) && Model.PollId > 0)
            {
                PollComment pollCommentSample = new PollComment
                {
                    Text = Model.Text,
                    PollId = Model.PollId,
                    UserId = Model.UserId,
                    SentAt = DateTime.Now
                };
                await _context.AddAsync(pollCommentSample);
                await _context.SaveChangesAsync();

                return pollCommentSample.Id;
            }
            return 0;
        }

        public async Task<int> EditAsync(PollComment_VM Model)
        {
            if(Model.Id > 0 && !String.IsNullOrWhiteSpace(Model.Text))
            {
                int Result = await _context.PollComments.AsNoTracking().Where(pc => pc.Id == Model.Id && pc.UserId == Model.UserId && !pc.IsDeleted && pc.Text != Model.Text).ExecuteUpdateAsync(p => p.SetProperty(p => p.Text, Model.Text).SetProperty(p => p.IsEdited, true));
                if (Result > 0) return Model.Id;
            }
            return 0;
        }

        public async Task<int> DeleteAsync(int Id, int UserId)
        {
            if(Id > 0 && UserId > 0)
            {
                int Result = await _context.PollComments.AsNoTracking().Where(pc => pc.Id == Id && pc.UserId == UserId && !pc.IsDeleted).ExecuteUpdateAsync(pc => pc.SetProperty(pc => pc.IsDeleted, true));
                if (Result > 0) return Id;
            }
            return 0;
        }

        public IQueryable<PollComment_DTO>? Get(int Id, int SkipQty = 0, int TakeQty = 25)
        {
            if (Id > 0) return _context.PollComments.AsNoTracking().Where(pc => pc.Id == Id && !pc.IsDeleted).Select(pc => new PollComment_DTO { Id = pc.Id, Text = pc.Text, PollId = Id, SentAt = pc.SentAt, UserId = pc.UserId, User = new User { Nickname = pc.User.Nickname, ImgUrl = pc.User.UserImages.Select(i => i.ImgUrl).FirstOrDefault() }, IsEdited = pc.IsEdited }).OrderByDescending(pc => pc.SentAt).Skip(SkipQty).Take(TakeQty);
            else return null;
        }

        public async Task<int> ReplyAsync(PollCommentReply_VM Model)
        {
            if(!String.IsNullOrWhiteSpace(Model.Text) && Model.PollCommentId > 0)
            {
                PollRecomment pollRecommentSample = new PollRecomment()
                {
                    Text = Model.Text,
                    UserId = Model.UserId,
                    SentAt = DateTime.Now,
                    PollCommentId = Model.PollCommentId
                };
                await _context.AddAsync(pollRecommentSample);
                await _context.SaveChangesAsync();

                return pollRecommentSample.Id;
            }
            return 0;
        }

        public async Task<int> EditReplyAsync(PollCommentReply_VM Model)
        {
            if(!String.IsNullOrWhiteSpace(Model.Text) && Model.Id > 0)
            {
                int Result = await _context.PollRecomments.AsNoTracking().Where(r => !r.IsDeleted && r.Id == Model.Id && r.UserId == Model.UserId && Model.SentAt.Date.AddDays(3) <= DateTime.Now).ExecuteUpdateAsync(r => r.SetProperty(r => r.Text, Model.Text).SetProperty(r => r.IsEdited, true));
                if (Result > 0) return Result;
            }
            return 0;
        }

        public async Task<int> DeleteReplyAsync(int Id, int UserId)
        {
            if(Id > 0 && UserId > 0)
            {
                int Result = await _context.PollRecomments.AsNoTracking().Where(r => r.Id == Id && r.UserId == UserId && !r.IsDeleted).ExecuteUpdateAsync(r => r.SetProperty(r => r.IsDeleted, true));
                if (Result > 0) return Id;
            }
            return 0;
        }

        public IQueryable<PollRecomment_DTO>? GetReplies(int Id, int SkipQty, int TakeQty = 20)
        {
            if (Id > 0) return _context.PollRecomments.AsNoTracking().Where(r => r.PollCommentId == Id && !r.IsDeleted).Select(r => new PollRecomment_DTO { Id = r.Id, Text = r.Text, IsEdited = r.IsEdited, SentAt = r.SentAt, UserId = r.UserId, User = new User { Nickname = r.User.Nickname, ImgUrl = r.User.UserImages.Select(i => i.ImgUrl).FirstOrDefault() } }).OrderByDescending(r => r.SentAt).Skip(SkipQty).Take(TakeQty);
            else return null;
        }
    }
}
