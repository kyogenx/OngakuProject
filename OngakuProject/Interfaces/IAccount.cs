using OngakuProject.Data;
using OngakuProject.ViewModels;

namespace OngakuProject.Interfaces
{
    public interface IAccount
    {
        public Task<bool> CheckAccountByEmail(string? Email);
        public Task<int> SignUpAsync(SignUp_VM Model);
        public Task<bool> SignInAsync(SignIn_VM Model);
        public Task<int> SendPasswordResetEmailAsync(string? Email);
        public bool CheckPasswordResetCodeAsync(int UserId, string? Code);
        public Task<bool> ResetPasswordAsync(string? Email, string? NewPassword, string? ConfirmPassword);
        public Task<int> AutoSignInAsync();
    }
}
