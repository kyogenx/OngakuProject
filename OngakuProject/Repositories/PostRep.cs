using Microsoft.EntityFrameworkCore;
using OngakuProject.Data;
using OngakuProject.Interfaces;
using OngakuProject.Models;
using OngakuProject.ViewModels;

namespace OngakuProject.Repositories
{
    public class PostRep : IPost
    {
        private readonly Context _context;
        public PostRep(Context context)
        {
            _context = context;
        }

        public async Task<int> CreatePostAsync(Post_VM Model)
        {
            if(!String.IsNullOrWhiteSpace(Model.Text))
            {
                bool CheckPollAvailability = false;
                bool CheckTrackAvailability = false;

                Model.PollId = Model.TrackId > 0 ? 0 : Model.PollId;
                if(Model.TrackId > 0) CheckTrackAvailability = await _context.Tracks.AsNoTracking().AnyAsync(c => c.Id == Model.TrackId && !c.IsDeleted && c.Status == 3);
                if (Model.PollId > 0) CheckPollAvailability = await _context.Polls.AsNoTracking().AnyAsync(c => c.Id == Model.PollId && !c.IsDeleted);

                Model.MaxRepostsPerUser = Model.MaxRepostsPerUser > 45 ? 45 : Model.MaxRepostsPerUser;
                Post postSample = new Post
                {
                    Text = Model.Text,
                    UserId = Model.UserId,
                    CreatedAt = DateTime.Now,
                    PollId = CheckPollAvailability ? Model.PollId : 0,
                    MaxRepostsPerUser = Model.MaxRepostsPerUser,
                    TrackId = CheckTrackAvailability ? Model.TrackId : 0
                };
                await _context.AddAsync(postSample);
                await _context.SaveChangesAsync();

                return postSample.Id;
            }
            return 0;
        }

        public async Task<string?> EditPostAsync(Post_VM Model)
        {
            if(Model.Id > 0 && !String.IsNullOrWhiteSpace(Model.Text))
            {
                int Result = await _context.Posts.AsNoTracking().Where(p => p.Id == Model.Id && p.UserId == Model.UserId && !p.IsDeleted && DateTime.Now.Subtract(p.CreatedAt).TotalDays <= 2).ExecuteUpdateAsync(p => p.SetProperty(p => p.Text, Model.Text));
                if (Result > 0) return Model.Text;
            }
            return null;
        }

        public async Task<int?> EditPostPollAttachmentAsync(Post_VM Model)
        {
            if(Model.Id > 0 && Model.PollId > 0)
            {
                bool CheckPollAvailability = await _context.Polls.AsNoTracking().AnyAsync(p => p.Id == Model.PollId && !p.IsDeleted);
                if(CheckPollAvailability)
                {
                    int Result = await _context.Posts.AsNoTracking().Where(p => p.Id == Model.Id && p.UserId == Model.UserId && !p.IsDeleted).ExecuteUpdateAsync(p => p.SetProperty(p => p.TrackId, 0).SetProperty(p => p.PollId, Model.PollId));
                    if (Result > 0) return Model.PollId;
                }
            }
            return 0;
        }

        public async Task<int?> EditPostTrackAttachmentAsync(Post_VM Model)
        {
            if(Model.Id > 0 && Model.TrackId > 0)
            {
                bool CheckTrackAvailability = await _context.Tracks.AsNoTracking().AnyAsync(t => t.Id == Model.TrackId && !t.IsDeleted && t.Status == 3);
                if(CheckTrackAvailability)
                {
                    int Result = await _context.Posts.AsNoTracking().Where(p => p.Id == Model.Id && p.UserId == Model.UserId && !p.IsDeleted).ExecuteUpdateAsync(p => p.SetProperty(p => p.PollId, 0).SetProperty(p => p.TrackId, Model.TrackId));
                    if (Result > 0) return Model.TrackId;
                }
            }
            return 0;
        }

        public async Task<int> EnablePostAsync(int Id, int UserId)
        {
            if(Id > 0 && UserId > 0)
            {
                int Result = await _context.Posts.AsNoTracking().Where(p => p.Id == Id && p.UserId == UserId && p.IsDisabled).ExecuteUpdateAsync(p => p.SetProperty(p => p.IsDisabled, false));
                if (Result > 0) return Id;
            }
            return 0;
        }

        public async Task<int> DisablePostAsync(int Id, int UserId)
        {
            if(Id > 0 && UserId > 0)
            {
                int Result = await _context.Posts.AsNoTracking().Where(p => p.Id == Id && p.UserId == UserId && !p.IsDeleted).ExecuteUpdateAsync(p => p.SetProperty(p => p.IsDisabled, true));
                if (Result > 0) return Id;
            }
            return 0;
        }

        public async Task<int> DeletePostAsync(int Id, int UserId)
        {
            if(Id > 0 && UserId > 0)
            {
                int Result = await _context.Posts.AsNoTracking().Where(p => p.Id == Id && p.UserId == UserId && !p.IsDeleted).ExecuteUpdateAsync(p => p.SetProperty(p => p.IsDeleted, true));
                if (Result > 0) return Id;
            }
            return 0;
        }
    }
}
