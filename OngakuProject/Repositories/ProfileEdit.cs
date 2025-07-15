using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using OngakuProject.Data;
using OngakuProject.Interfaces;
using OngakuProject.Models;
using OngakuProject.ViewModels;

namespace OngakuProject.Repositories
{
    public class ProfileEdit : IProfileEdit
    {
        private readonly Context _context;
        private readonly IWebHostEnvironment _webHostEnvironment;
        public ProfileEdit(Context context, IWebHostEnvironment webHostEnvironment)
        {
            _context = context;
            _webHostEnvironment = webHostEnvironment;
        }

        public async Task<string?> UpdateSearchnameAsync(int Id, string? Searchname)
        {
            if (Id > 0 && !String.IsNullOrWhiteSpace(Searchname))
            {
                bool IsFree = await _context.Users.AsNoTracking().AnyAsync(s => s.Id != Id && s.Searchname != null && s.Searchname.ToLower() == Searchname.ToLower());
                if (!IsFree)
                {
                    int Result = await _context.Users.AsNoTracking().Where(u => u.Id == Id).ExecuteUpdateAsync(u => u.SetProperty(u => u.Searchname, Searchname));
                    if (Result > 0) return Searchname;
                }
            }
            return null;
        }

        public async Task<string?> EditBioAsync(int Id, ProfileInfo_VM Model)
        {
            if (Id > 0 && !String.IsNullOrWhiteSpace(Model.Description))
            {
                int Result = await _context.Users.AsNoTracking().Where(u => u.Id == Id).ExecuteUpdateAsync(u => u.SetProperty(u => u.Description, Model.Description));
                if (Result > 0) return Model.Description;
            }
            return null;
        }

        public async Task<string?> EditWebsiteLinkAsync(int Id, ProfileInfo_VM Model)
        {
            if (Id > 0 && !String.IsNullOrWhiteSpace(Model.Website))
            {
                int Result = await _context.Users.AsNoTracking().Where(u => u.Id == Id).ExecuteUpdateAsync(u => u.SetProperty(u => u.Webpage, Model.Website));
                if (Result > 0) return Model.Website;
            }
            return null;
        }

        public async Task<int> EditArtistTypeAsync(int Id, byte Type)
        {
            if (Id > 0)
            {
                int Result = await _context.Users.AsNoTracking().Where(u => u.Id == Id).ExecuteUpdateAsync(u => u.SetProperty(u => u.Type, Type));
                if (Result > 0) return Type;
            }
            return -1;
        }

        public async Task<DateTime?> EditStartDateTimeAsync(int Id, DateTime FormedAt)
        {
            if (Id > 0)
            {
                int Result = await _context.Users.AsNoTracking().Where(u => u.Id == Id).ExecuteUpdateAsync(u => u.SetProperty(u => u.FormedAt, FormedAt));
                if (Result > 0) return FormedAt;
            }
            return null;
        }


        public async Task<bool> UpdatePrivacySettingsAsync(PrivacySettings_VM Model)
        {
            if (Model.Id > 0)
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
                if (CurrentImgsQty < 6)
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
                    if (AddingImages.Count > 0)
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
            if (Id > 0)
            {
                int Result = await _context.UserImages.AsNoTracking().Where(u => u.UserId == Id && !u.IsDeleted).ExecuteUpdateAsync(u => u.SetProperty(u => u.IsDeleted, true));
                if (Result > 0) return true;
            }
            return false;
        }

        public async Task<string?> EditMainGenreAsync(int Id, int UserId)
        {
            if(Id > 0 && UserId > 0)
            {
                string? CheckGenreAvailability = await _context.Genres.AsNoTracking().Where(g => g.Id == Id && !g.IsDeleted).Select(g => g.Name).FirstOrDefaultAsync();
                if(CheckGenreAvailability is not null)
                {
                    int Result = await _context.Users.AsNoTracking().Where(u => u.Id == UserId).ExecuteUpdateAsync(u => u.SetProperty(u => u.GenreId, Id));
                    if(Result > 0) return CheckGenreAvailability;
                }
            }
            return null;
        }

        public async Task<string?> EditLocationInfoAsync(int Id, int UserId)
        {
            if(Id > 0 && UserId > 0)
            {
                string? CheckCountryAvailability = await _context.Countries.AsNoTracking().Where(c => c.Id == Id && !c.IsDeleted).Select(c => c.Name).FirstOrDefaultAsync();
                if(CheckCountryAvailability is not null)
                {
                    int Result = await _context.Users.AsNoTracking().Where(u => u.Id == UserId && u.CountryId != Id).ExecuteUpdateAsync(u => u.SetProperty(u => u.CountryId, Id));
                    if (Result > 0) return CheckCountryAvailability;
                }
            }
            return null;
        }
    }
}
