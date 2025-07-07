using Microsoft.EntityFrameworkCore;
using OngakuProject.Data;
using OngakuProject.Interfaces;
using OngakuProject.Models;
using OngakuProject.ViewModels;

namespace OngakuProject.Repositories
{
    public class TrackCommentRep : ITrackComment
    {
        private readonly Context _context;
        public TrackCommentRep(Context context)
        {
            _context = context;
        }

        public IQueryable<TrackComment>? GetComments(int Id, int Qty = 40, int Skip = 0)
        {
            if (Id > 0) return _context.TrackComments.AsNoTracking().Where(t => t.TrackId == Id && !t.IsDeleted).OrderByDescending(c => c.SentAt).Select(t => new TrackComment { Id = t.Id, UserId = t.UserId, User = t.User != null ? new User { ImgUrl = t.User.UserImages != null ? t.User.UserImages.Select(t => t.ImgUrl).FirstOrDefault() : null, IsOfficial = t.User.IsOfficial, UserName = t.User.UserName, } : null, Text = t.Text, SentAt = t.SentAt, IsEdited = t.EditedAt.HasValue }).Skip(Skip).Take(Qty);
            else return null;
        }

        public async Task<int> DeleteCommentAsync(int Id, int UserId)
        {
            if(Id > 0 && UserId > 0)
            {
                int Result = await _context.TrackComments.AsNoTracking().Where(t => t.Id == Id && t.UserId == UserId && !t.IsDeleted).ExecuteUpdateAsync(t => t.SetProperty(t => t.IsDeleted, true));
                if (Result > 0) return Id;
            }
            return 0;
        }

        public async Task<string?> EditCommentAsync(Comment_VM Model)
        {
            if(Model.Id > 0 && !String.IsNullOrWhiteSpace(Model.Text))
            {
                int Result = await _context.TrackComments.AsNoTracking().Where(t => t.Id == Model.Id && !t.IsDeleted).ExecuteUpdateAsync(t => t.SetProperty(t => t.Text, Model.Text).SetProperty(t => t.EditedAt, DateTime.Now));
                if (Result > 0) return Model.Text;
            }
            return null;
        }

        public async Task<int> SendCommentAsync(Comment_VM Model)
        {
            if(!String.IsNullOrWhiteSpace(Model.Text))
            {
                bool AreTrackCommsOpen = await _context.Tracks.AsNoTracking().AnyAsync(t => t.Id == Model.TrackId && !t.IsDeleted && t.AreCommsOpen);
                if (AreTrackCommsOpen)
                {
                    TrackComment trackCommentSample = new TrackComment()
                    {
                        Text = Model.Text,
                        UserId = Model.UserId,
                        TrackId = Model.TrackId,
                        SentAt = DateTime.Now
                    };
                    await _context.AddAsync(trackCommentSample);
                    await _context.SaveChangesAsync();

                    return trackCommentSample.Id;
                }
            }
            return 0;
        }

        public async Task<int> PinTheCommentAsync(int Id, int UserId)
        {
            if(Id > 0 && UserId > 0)
            {
                int Result = await _context.TrackComments.AsNoTracking().Where(t => t.Id == Id && t.UserId == UserId && !t.IsDeleted && !t.IsPinned).ExecuteUpdateAsync(t => t.SetProperty(t => t.IsPinned, true));
                if (Result > 0) return Id;
            }
            return 0;
        }

        public async Task<int> UnpinTheCommentAsync(int Id, int UserId)
        {
            if (Id > 0 && UserId > 0)
            {
                int Result = await _context.TrackComments.AsNoTracking().Where(t => t.Id == Id && t.UserId == UserId && !t.IsDeleted && t.IsPinned).ExecuteUpdateAsync(t => t.SetProperty(t => t.IsPinned, false));
                if (Result > 0) return Id;
            }
            return 0;
        }
    }
}
