using OngakuProject.ViewModels;

namespace OngakuProject.Interfaces
{
    public interface IPost
    {
        public Task<int> CreatePostAsync(Post_VM Model);
        public Task<string?> EditPostAsync(Post_VM Model);
        public Task<int?> EditPostPollAttachmentAsync(Post_VM Model);
        public Task<int?> EditPostTrackAttachmentAsync(Post_VM Model);
        public Task<int> EnablePostAsync(int Id, int UserId);
        public Task<int> DisablePostAsync(int Id, int UserId);
        public Task<int> DeletePostAsync(int Id, int UserId);
    }
}
