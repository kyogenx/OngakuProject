using Microsoft.EntityFrameworkCore;
using OngakuProject.Data;
using OngakuProject.Interfaces;
using OngakuProject.Models;
using OngakuProject.ViewModels;

namespace OngakuProject.Repositories
{
    public class ProfileRep : IProfile
    {
        private readonly Context _context;
        public ProfileRep(Context context)
        {
            _context = context;
        }

        public async Task<User?> GetUserByIdAsync(int Id)
        {
            if (Id > 0) return await _context.Users.AsNoTracking().Where(u => u.Id == Id).Select(u => new User { Id = Id, Nickname = u.Nickname, Searchname = u.Searchname, ImgUrl = u.ImgUrl }).FirstOrDefaultAsync();
            else return null;
        }

        public async Task<User?> GetUserGutsByIdAsync(int Id)
        {
            if (Id > 0) return await _context.Users.AsNoTracking().Where(u => u.Id == Id).Select(u => new User { Id = u.Id, Nickname = u.Nickname, Searchname = u.Searchname, Email = u.Email, ImgUrl = u.ImgUrl }).FirstOrDefaultAsync();
            else return null;
        }

        public async Task<string?> GetUserDescriptionAsync(int Id)
        {
            if (Id > 0) return await _context.Users.AsNoTracking().Where(u => u.Id == Id).Select(u => u.Description).FirstOrDefaultAsync();
            else return null;
        }

        public int ParseCurrentUserId(string? UserId)
        {
            if(!String.IsNullOrWhiteSpace(UserId))
            {
                bool TryParseResult = Int32.TryParse(UserId, out int Id);
                if (TryParseResult) return Id;
            }
            return 0;
        }

        public async Task<string?> UpdateSearchnameAsync(int Id, string? Searchname)
        {
            if(Id > 0 && !String.IsNullOrWhiteSpace(Searchname))
            {
                bool IsFree = await _context.Users.AsNoTracking().AnyAsync(s => s.Id != Id && s.Searchname != null && s.Searchname.ToLower() == Searchname.ToLower());
                if(!IsFree)
                {
                    int Result = await _context.Users.AsNoTracking().Where(u => u.Id == Id).ExecuteUpdateAsync(u => u.SetProperty(u => u.Searchname, Searchname));
                    if (Result > 0) return Searchname;
                }
            }
            return null;
        }

        public async Task<bool> UpdateMainInfoAsync(ProfileInfo_VM Model)
        {
            if(Model.Id > 0 && !String.IsNullOrWhiteSpace(Model.Nickname))
            {
                int Result = await _context.Users.AsNoTracking().Where(u => u.Id == Model.Id).ExecuteUpdateAsync(u => u.SetProperty(u => u.Nickname, Model.Nickname).SetProperty(u => u.Description, Model.Description));
                if (Result > 0) return true;
            }
            return false;
        }
    }
}
