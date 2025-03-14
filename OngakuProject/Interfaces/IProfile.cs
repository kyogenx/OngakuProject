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
        public int ParseCurrentUserId(string? UserId);
    }
}
