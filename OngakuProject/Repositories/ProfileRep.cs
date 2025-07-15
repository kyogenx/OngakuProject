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
        private readonly IWebHostEnvironment _webHostEnvironment;
        public ProfileRep(Context context, IWebHostEnvironment webHostEnvironment)
        {
            _context = context;
            _webHostEnvironment = webHostEnvironment;
        }

        public async Task<User?> GetUserByIdAsync(int Id)
        {
            if (Id > 0) return await _context.Users.AsNoTracking().Where(u => u.Id == Id).Select(u => new User { Id = Id, Nickname = u.Nickname, Searchname = u.Searchname, ImgUrl = u.UserImages != null ? u.UserImages.Where(u => !u.IsDeleted).Select(u => u.ImgUrl).FirstOrDefault() : null }).FirstOrDefaultAsync();
            else return null;
        }

        public async Task<User?> GetUserGutsByIdAsync(int Id)
        {
            if (Id > 0) return await _context.Users.AsNoTracking().Where(u => u.Id == Id).Select(u => new User { Id = u.Id, Nickname = u.Nickname, Searchname = u.Searchname, Email = u.Email, ImgUrl = u.UserImages != null ? u.UserImages!.Where(u => !u.IsDeleted).Select(u => u.ImgUrl).FirstOrDefault() : null }).FirstOrDefaultAsync();
            else return null;
        }

        public async Task<User?> GetUserGutsOnlyByIdAsync(int Id)
        {
            if (Id > 0) return await _context.Users.AsNoTracking().Where(u => u.Id == Id).Select(u => new User { Id = Id, Email = u.Email, EmailConfirmed = u.EmailConfirmed, Passcode = u.Passcode }).FirstOrDefaultAsync();
            else return null;
        }

        public async Task<string?> GetUserDescriptionAsync(int Id)
        {
            if (Id > 0) return await _context.Users.AsNoTracking().Where(u => u.Id == Id).Select(u => u.Description).FirstOrDefaultAsync();
            else return null;
        }

        public async Task<User?> GetUserPersonalInformationAsync(int Id)
        {
            if (Id > 0) return await _context.Users.AsNoTracking().Where(u => u.Id == Id).Select(u => new User { Webpage = u.Webpage, RealName = u.RealName, CountryId = u.CountryId, Country = u.Country != null ? new Country { Name = u.Country.Name, Shortname = u.Country.Shortname } : null }).FirstOrDefaultAsync();
            else return null;
        }

        public async Task<User?> GetUserPrivacySettingsAsync(int Id)
        {
            if (Id > 0) return await _context.Users.AsNoTracking().Where(u => u.Id == Id).Select(u => new User { WhoCanChat = u.WhoCanChat, WhoCanDownload = u.WhoCanDownload, WhoCanSeeLastSeenInfo = u.WhoCanSeeLastSeenInfo, IsVisible = u.IsVisible, Id = Id }).FirstOrDefaultAsync();
            else return null;
        }

        public async Task<Country?> GetUserLocationInformationAsync(int Id)
        {
            return await _context.Users.AsNoTracking().Where(u => u.Id == Id).Select(u => u.Country != null ? new Country { Id = u.Country.Id, Name = u.Country.Name, Shortname = u.Country.Shortname } : null).FirstOrDefaultAsync();
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

        public async Task<string?> GetAnImageAsync(int Id, int Skip)
        {
            if (Id > 0)
            {
                string? Result = await _context.UserImages.AsNoTracking().Where(u => u.UserId == Id && !u.IsDeleted).Skip(Skip).Select(u => u.ImgUrl).FirstOrDefaultAsync();
                if (Result is not null) return Result;
            }
            return null;
        }

        public async Task<int> GetImagesQtyAsync(int Id)
        {
            if (Id > 0) return await _context.UserImages.AsNoTracking().CountAsync(u => u.UserId == Id && !u.IsDeleted);
            else return 0;
        }

        public async Task<string?> GetUserEmailAddressAsync(int Id)
        {
            if (Id > 0) return await _context.Users.AsNoTracking().Where(u => u.Id == Id).Select(u => u.Email).FirstOrDefaultAsync();
            else return null;
        }
    }
}
