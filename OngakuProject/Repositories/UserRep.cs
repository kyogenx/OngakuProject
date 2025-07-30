using Microsoft.EntityFrameworkCore;
using OngakuProject.Data;
using OngakuProject.Interfaces;
using OngakuProject.Models;

namespace OngakuProject.Repositories
{
    public class UserRep : BaseRep<User>, IUser
    {
        private readonly Context _context;
        public UserRep(Context context) : base(context)
        {
            _context = context;
        }

        public async Task<User?> GetUserInfoAsync(int Id)
        {
            if (Id > 0) return await _context.Users.AsNoTracking().Where(u => u.Id == Id && u.IsVisible).Select(u => new User { Id = Id, Nickname = u.Nickname, RealName = u.RealName, CountryId = u.CountryId, Country = u.Country != null ? new Country { Name = u.Country.Name } : null, Searchname = u.Searchname, ImgUrl = u.ImgUrl, LastSeenAt = u.LastSeenAt, Description = u.Description, WhoCanChat = u.WhoCanChat, WhoCanDownload = u.WhoCanDownload, WhoCanSeeLastSeenInfo = u.WhoCanSeeLastSeenInfo, Webpage = u.Webpage }).FirstOrDefaultAsync();
            else return null;
        }

        public async Task<User?> FindUserCompressedAsync(int Id)
        {
            if (Id > 0) return await _context.Users.AsNoTracking().Where(u => u.Id == Id && u.IsVisible).Select(u => new User { Id = Id, Nickname = u.Nickname, Searchname = u.Searchname, RealName = u.RealName, ImgUrl = u.ImgUrl }).FirstOrDefaultAsync();
            else return null;
        }

        public IQueryable<User?> FindUsers(string? Keyword)
        {
            return _context.Users.Where(u => u.IsVisible && (Keyword != null && ((u.Nickname != null && u.Nickname!.ToLower().Contains(Keyword.ToLower())) || (u.Searchname != null && u.Searchname!.ToLower().Contains(Keyword.ToLower())) || (u.RealName != null && u.RealName.ToLower().Contains(Keyword.ToLower())) || (u.Webpage != null && u.Webpage.ToLower().Contains(Keyword.ToLower()))))).Select(u => new User { Id = u.Id, Nickname = u.Nickname, ImgUrl = u.ImgUrl }).Take(24);
        }

        public IQueryable<User?>? MentionSearch(string? Searchname)
        {
            if (!String.IsNullOrWhiteSpace(Searchname)) return _context.Users.Where(u => (u.Searchname != null && u.Searchname.ToLower().Contains(Searchname.ToLower())) || (u.Nickname != null && u.Nickname.ToLower().Contains(Searchname.ToLower()))).Select(u => new User { Id = u.Id, ImgUrl = u.UserImages != null ? u.UserImages.Select(i => i.ImgUrl).FirstOrDefault() : null, Nickname = u.Nickname, Searchname = u.Searchname });
            else return null;
        }
    }
}
