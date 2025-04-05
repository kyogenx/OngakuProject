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

        public async Task<bool> UpdatePersonalInfoAsync(PersonalInfo_VM Model)
        {
            if(Model.Id > 0)
            {
                string? RealName = null;
                if(Model.RealName?.Length > 0)
                {
                    for(int i = 0; i < Model.RealName.Length; i++)
                    {
                        if (i == 0) RealName = Model.RealName[i];
                        else RealName += ", " + Model.RealName[i];
                    }
                }
                int Result = await _context.Users.AsNoTracking().Where(u => u.Id == Model.Id).ExecuteUpdateAsync(u => u.SetProperty(u => u.CountryId, Model.CountryId).SetProperty(u => u.Webpage, Model.WebpageLink).SetProperty(u => u.RealName, RealName));
                if (Result > 0) return true;
            }
            return false;
        }

        public async Task<bool> UpdatePrivacySettingsAsync(PrivacySettings_VM Model)
        {
            if(Model.Id > 0)
            {
                int Result = await _context.Users.AsNoTracking().Where(u => u.Id == Model.Id).ExecuteUpdateAsync(u => u.SetProperty(u => u.WhoCanDownload, Model.WhoCanDownload).SetProperty(u => u.WhoCanChat, Model.WhoCanChat).SetProperty(u => u.WhoCanSeeLastSeenInfo, Model.WhoCanSeeLastSeenInfo).SetProperty(u => u.IsVisible, Model.IsVisible));
                if (Result > 0) return true;
            }
            return false;
        }

        public async Task<string?> UpdateImagesAsync(int Id, IFormFileCollection Files)
        {
            if (Id > 0)
            {
                int CurrentImgsQty = await _context.UserImages.AsNoTracking().CountAsync(c => c.UserId == Id);
                if(CurrentImgsQty < 6)
                {
                    string? FirstImage = null;
                    List<UserImage>? AddingImages = new List<UserImage>();
                    CurrentImgsQty = 6 - CurrentImgsQty;
                    CurrentImgsQty = Files.Count > CurrentImgsQty ? CurrentImgsQty : Files.Count;

                    for (int i = 0; i < CurrentImgsQty; i++)
                    {
                        if (Path.GetExtension(Files[i].FileName).ToLower() == ".jpg" || Path.GetExtension(Files[i].FileName).ToLower() == ".png" || Path.GetExtension(Files[i].FileName).ToLower() == ".jpeg")
                        {
                            string? RandFileName = Guid.NewGuid().ToString("D").Substring(3, 9);
                            RandFileName = RandFileName + Path.GetExtension(Files[i].FileName);
                            if (i == 0) FirstImage = RandFileName;
                            using (FileStream fs = new FileStream(_webHostEnvironment.WebRootPath + "/ProfileImages/" + RandFileName, FileMode.Create))
                            {
                                await Files[i].CopyToAsync(fs);
                                UserImage userImageSample = new UserImage
                                {
                                    UserId = Id,
                                    ImgUrl = RandFileName,
                                };
                                AddingImages.Add(userImageSample);
                            }
                        }
                    }
                    if(AddingImages.Count > 0)
                    {
                        //await _context.Users.AsNoTracking().Where(u => u.Id == Id).ExecuteUpdateAsync(u => u.SetProperty(u => u.ImgUrl, FirstImage));
                        await _context.AddRangeAsync(AddingImages);
                        await _context.SaveChangesAsync();

                        return FirstImage;
                    }
                }
            }
            return null;
        }

        public async Task<string?> UpdateMainImageAsync(int Id, string? ImageUrl)
        {
            if (Id > 0 && !String.IsNullOrWhiteSpace(ImageUrl))
            {
                bool DoesChosenImgExist = await _context.UserImages.AsNoTracking().AnyAsync(u => u.UserId == Id && u.ImgUrl == ImageUrl && !u.IsDeleted);
                if (DoesChosenImgExist)
                {
                    UserImage? CurrentMainImgInfo = await _context.UserImages.AsNoTracking().Where(u => u.UserId == Id && !u.IsDeleted).Select(u => new UserImage { Id = u.Id, ImgUrl = u.ImgUrl }).FirstOrDefaultAsync();
                    if (CurrentMainImgInfo is not null)
                    {
                        await _context.UserImages.AsNoTracking().Where(u => u.UserId == Id && u.ImgUrl == ImageUrl && !u.IsDeleted).ExecuteUpdateAsync(u => u.SetProperty(u => u.ImgUrl, CurrentMainImgInfo.ImgUrl));
                        int Result = await _context.UserImages.AsNoTracking().Where(u => u.Id == CurrentMainImgInfo.Id).ExecuteUpdateAsync(u => u.SetProperty(u => u.ImgUrl, ImageUrl));
                        if (Result > 0) return ImageUrl;
                    }
                }
            }
            return null;
        }

        public async Task<string?> DeleteImageAsync(int Id, string? ImgUrl)
        {
            if (Id > 0 && !String.IsNullOrWhiteSpace(ImgUrl))
            {
                int Result = await _context.UserImages.AsNoTracking().Where(u => u.UserId == Id && u.ImgUrl == ImgUrl && !u.IsDeleted).ExecuteUpdateAsync(u => u.SetProperty(u => u.IsDeleted, true));
                if (Result > 0) return await _context.UserImages.AsNoTracking().Where(u => u.UserId == Id && !u.IsDeleted).Select(u => u.ImgUrl).FirstOrDefaultAsync();
            }
            return null;
        }

        public async Task<bool> DeleteAllImagesAsync(int Id)
        {
            if(Id > 0)
            {
                int Result = await _context.UserImages.AsNoTracking().Where(u => u.UserId == Id && !u.IsDeleted).ExecuteUpdateAsync(u => u.SetProperty(u => u.IsDeleted, true));
                if (Result > 0) return true;
            }
            return false;
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
