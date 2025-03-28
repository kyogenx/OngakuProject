using OngakuProject.Models;
using OngakuProject.ViewModels;

namespace OngakuProject.Interfaces
{
    public interface IProfile
    {
        public Task<User?> GetUserByIdAsync(int Id);
        public Task<User?> GetUserGutsByIdAsync(int Id);
        public Task<string?> GetUserDescriptionAsync(int Id);
        public Task<bool> UpdateMainInfoAsync(ProfileInfo_VM Model);
        public Task<string?> UpdateSearchnameAsync(int Id, string? Searchname);
        public Task<string?> UpdateImagesAsync(int Id, IFormFileCollection Files);
        public Task<string?> UpdateMainImageAsync(int Id, string? ImgUrl);
        public Task<string?> DeleteImageAsync(int Id, string? ImgUrl);
        public Task<bool> DeleteAllImagesAsync(int Id);
        public Task<string?> GetAnImageAsync(int Id, int Skip);
        public Task<int> GetImagesQtyAsync(int Id);
        public int ParseCurrentUserId(string? UserId);
    }
}
