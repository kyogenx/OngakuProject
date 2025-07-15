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
        private readonly ITrack _track;
        public TrackCommentRep(Context context, ITrack track)
        {
            _context = context;
            _track = track;
        }

        public IQueryable<int?>? GetLikedComments(int UserId)
        {
            if (UserId > 0) return _context.TrackCommentsReaction.AsNoTracking().Where(tcr => tcr.UserId == UserId && !tcr.IsDeleted).Select(tcr => tcr.TrackCommentId);
            else return null;
        }

        public IQueryable<TrackComment>? GetComments(int Id, int Qty = 40, int Skip = 0)
        {
            if (Id > 0) return _context.TrackComments.AsNoTracking().Where(t => t.TrackId == Id && !t.IsDeleted).OrderByDescending(c => c.IsPinned).ThenByDescending(c => c.SentAt).Select(t => new TrackComment { Id = t.Id, UserId = t.UserId, LikesQty = t.TrackCommentReactions != null ?t.TrackCommentReactions.Count(r => !r.IsDeleted) : 0, User = t.User != null ? new User { ImgUrl = t.User.UserImages != null ? t.User.UserImages.Select(t => t.ImgUrl).FirstOrDefault() : null, IsOfficial = t.User.IsOfficial, Nickname = t.User.Nickname, } : null, Text = t.Text, SentAt = t.SentAt, IsEdited = t.EditedAt.HasValue, IsPinned = t.IsPinned }).Skip(Skip).Take(Qty);
            else return null;
        }

        public IQueryable<TrackRecomment>? GetRecomments(int Id, int Qty, int Skip = 0)
        {
            if (Id > 0) return _context.TrackRecomments.AsNoTracking().Where(r => r.TrackCommentId == Id && !r.IsDeleted).OrderByDescending(r => r.SentAt).Select(r => new TrackRecomment { Id = r.Id, Text = r.Text, SentAt = r.SentAt, IsEdited = r.EditedAt.HasValue, UserId = r.UserId, User = r.User != null ? new User { ImgUrl = r.User.UserImages != null ? r.User.UserImages.Select(i => i.ImgUrl).FirstOrDefault() : null, Nickname = r.User.Nickname } : null }).Skip(Skip).Take(Qty);
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

        public async Task<int> DeleteRecommentAsync(int Id, int UserId)
        {
            if(Id > 0 && UserId > 0)
            {
                int Result = await _context.TrackRecomments.AsNoTracking().Where(tr => tr.Id == Id && tr.UserId == UserId && !tr.IsDeleted).ExecuteUpdateAsync(tr => tr.SetProperty(tr => tr.IsDeleted, true));
                if(Result > 0) return Id;
            }
            return 0;
        }

        public async Task<string?> EditCommentAsync(Comment_VM Model)
        {
            if(Model.Id > 0 && !String.IsNullOrWhiteSpace(Model.Text))
            {
                string? CurrentText = await _context.TrackComments.AsNoTracking().Where(tc => tc.Id == Model.Id && !tc.IsDeleted).Select(tc => tc.Text).FirstOrDefaultAsync();
                if (CurrentText != Model.Text) 
                {
                    int Result = await _context.TrackComments.AsNoTracking().Where(t => t.Id == Model.Id && !t.IsDeleted).ExecuteUpdateAsync(t => t.SetProperty(t => t.Text, Model.Text).SetProperty(t => t.EditedAt, DateTime.Now));
                    if (Result > 0) return Model.Text;
                }
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

        public async Task<int> RecommentAsync(Recomment_VM Model)
        {
            if(!String.IsNullOrWhiteSpace(Model.Text))
            {
                TrackRecomment trackRecommentSample = new TrackRecomment()
                {
                    Text = Model.Text,
                    UserId = Model.UserId,
                    SentAt = DateTime.Now,
                    TrackCommentId = Model.TrackCommentId
                };
                await _context.AddAsync(trackRecommentSample);
                await _context.SaveChangesAsync();

                return trackRecommentSample.Id;
            }
            return 0;
        }

        public async Task<string?> EditRecommentAsync(Recomment_VM Model)
        {
            if(!String.IsNullOrWhiteSpace(Model.Text) && Model.Id > 0)
            {
                string? BaseContent = await _context.TrackRecomments.AsNoTracking().Where(r => r.Id == Model.Id && !r.IsDeleted).Select(r => r.Text).FirstOrDefaultAsync();
                if(BaseContent != Model.Text)
                {
                    int Result = await _context.TrackRecomments.AsNoTracking().Where(tr => tr.Id == Model.Id && !tr.IsDeleted && tr.UserId == Model.UserId).ExecuteUpdateAsync(tr => tr.SetProperty(tr => tr.Text, Model.Text).SetProperty(tr => tr.EditedAt, DateTime.Now));
                    if (Result > 0) return Model.Text;
                }
            }
            return null;
        }

        public async Task<int> PinTheCommentAsync(int Id, int TrackId, int UserId)
        {
            if(Id > 0 && TrackId > 0 && UserId > 0)
            {
                bool CheckTrackOwnership = await _track.CheckTrackOwnership(TrackId, UserId);
                if(CheckTrackOwnership)
                {
                    int Result = await _context.TrackComments.AsNoTracking().Where(t => t.Id == Id && !t.IsDeleted && !t.IsPinned).ExecuteUpdateAsync(t => t.SetProperty(t => t.IsPinned, true));
                    if (Result > 0) return Id;
                }
            }
            return 0;
        }

        public async Task<int> UnpinTheCommentAsync(int Id, int TrackId, int UserId)
        {
            if (Id > 0 && TrackId > 0 && UserId > 0)
            {
                bool CheckTrackOwnership = await _track.CheckTrackOwnership(TrackId, UserId);
                if (CheckTrackOwnership)
                {
                    int Result = await _context.TrackComments.AsNoTracking().Where(t => t.Id == Id && !t.IsDeleted && t.IsPinned).ExecuteUpdateAsync(t => t.SetProperty(t => t.IsPinned, false));
                    if (Result > 0) return Id;
                }
            }
            return 0;
        }

        public async Task<int> LikeAsync(int Id, int UserId)
        {
            if(Id > 0 && UserId > 0)
            {
                var CheckLikeAvailability = await _context.TrackCommentsReaction.AsNoTracking().Where(tr => tr.Id == Id && tr.UserId == UserId).Select(tr => new { tr.Id, tr.IsDeleted }).FirstOrDefaultAsync();
                if (CheckLikeAvailability is not null)
                {
                    if (CheckLikeAvailability.IsDeleted)
                    {
                        int Result = await _context.TrackCommentsReaction.AsNoTracking().Where(tr => tr.Id == CheckLikeAvailability.Id).ExecuteUpdateAsync(tr => tr.SetProperty(tr => tr.IsDeleted, false).SetProperty(tr => tr.ReactedAt, DateTime.Now));
                        if (Result > 0) return Id;
                    }
                    else return -1;
                }
                else
                {
                    TrackCommentReaction trackCommentReactionSample = new TrackCommentReaction()
                    {
                        UserId = UserId,
                        TrackCommentId = Id,
                        ReactedAt = DateTime.Now
                    };
                    await _context.AddAsync(trackCommentReactionSample);
                    await _context.SaveChangesAsync();

                    return trackCommentReactionSample.Id;
                }
            }
            return 0;
        }

        public async Task<int> UnlikeAsync(int Id, int UserId)
        {
            if(Id > 0 && UserId > 0)
            {
                int Result = await _context.TrackCommentsReaction.AsNoTracking().Where(tr => tr.Id == Id && tr.UserId == UserId && !tr.IsDeleted).ExecuteUpdateAsync(tr => tr.SetProperty(tr => tr.IsDeleted, true));
                if (Result > 0) return Id;
            }
            return 0;
        }
    }
}
