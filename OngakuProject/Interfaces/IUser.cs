using OngakuProject.Models;

namespace OngakuProject.Interfaces
{
    public interface IUser 
    {
        public IQueryable<User?> FindUsers(string? Keyword);
        public IQueryable<User?>? MentionSearch(string? Searchname);
        public Task<User?> GetUserInfoAsync(int Id);
        public Task<User?> FindUserCompressedAsync(int Id);
    }
}
