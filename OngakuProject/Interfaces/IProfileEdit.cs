using OngakuProject.ViewModels;

namespace OngakuProject.Interfaces
{
    public interface IProfileEdit
    {
        public Task<string?> EditMainGenreAsync(int Id, int UserId);
        public Task<string?> EditLocationInfoAsync(int Id, int UserId);
        public Task<string?> EditBioAsync(int Id, ProfileInfo_VM Model);
        public Task<string?> EditWebsiteLinkAsync(int Id, ProfileInfo_VM Model);
        public Task<int> EditArtistTypeAsync(int Id, byte Type);
        public Task<DateTime?> EditStartDateTimeAsync(int Id, DateTime FormedAt);

        public Task<bool> UpdatePrivacySettingsAsync(PrivacySettings_VM Model);
        public Task<string?> UpdateSearchnameAsync(int Id, string? Searchname);
        public Task<string?> UpdateImagesAsync(int Id, IFormFileCollection Files);
        public Task<string?> UpdateMainImageAsync(int Id, string? ImgUrl);
        public Task<string?> DeleteImageAsync(int Id, string? ImgUrl);
        public Task<bool> DeleteAllImagesAsync(int Id);
    }
}
