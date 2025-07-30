using OngakuProject.Models;
using OngakuProject.ViewModels;

namespace OngakuProject.Interfaces
{
    public interface IProfile
    {
        public Task<User?> GetUserByIdAsync(int Id);
        public Task<User?> GetUserGutsByIdAsync(int Id);
        public Task<User?> GetUserGutsOnlyByIdAsync(int Id);
        public Task<string?> GetUserDescriptionAsync(int Id);
        public Task<string?> GetUserEmailAddressAsync(int Id);
        public Task<string?> GetUserProfileImgAsync(int Id);
        public Task<User?> GetUserPersonalInformationAsync(int Id);
        public Task<User?> GetUserPrivacySettingsAsync(int Id);
        public Task<Country?> GetUserLocationInformationAsync(int Id);
        public Task<string?> GetAnImageAsync(int Id, int Skip);
        public Task<int> GetImagesQtyAsync(int Id);
        public int ParseCurrentUserId(string? UserId);
    }
}
