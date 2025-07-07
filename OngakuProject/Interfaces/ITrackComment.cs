using OngakuProject.Models;
using OngakuProject.ViewModels;

namespace OngakuProject.Interfaces
{
    public interface ITrackComment
    {
        public Task<int> SendCommentAsync(Comment_VM Model);
        public Task<string?> EditCommentAsync(Comment_VM Model);
        public Task<int> DeleteCommentAsync(int Id, int UserId);
        public Task<int> PinTheCommentAsync(int Id, int UserId);
        public Task<int> UnpinTheCommentAsync(int Id, int UserId);
        public IQueryable<TrackComment>? GetComments(int Id, int Qty = 40, int Skip = 0);
    }
}
