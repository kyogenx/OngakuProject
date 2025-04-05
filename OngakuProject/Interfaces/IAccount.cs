using OngakuProject.Data;
using OngakuProject.ViewModels;

namespace OngakuProject.Interfaces
{
    public interface IAccount
    {
        public Task<bool> CheckAccountByEmail(string? Email);
        public Task<bool> CheckPasswordByEmail(string? Email, string? Password);
        public Task<bool> CheckPasscodeAsync(int Id, string? Passcode);
        public Task<bool> CheckPasscodeByEmailAsync(string? Email, string? Passcode);
        public Task<int> SignUpAsync(SignUp_VM Model);
        public Task<int> SignInAsync(SignIn_VM Model);
        public Task<bool> PasscodeSignInAsync(SignIn_VM Model);
        public Task<int> SendPasswordResetEmailAsync(string? Email);
        public bool CheckPasswordResetCodeAsync(int UserId, string? Code);
        public Task<bool> ResetPasswordAsync(string? Email, string? NewPassword, string? ConfirmPassword);
        public Task<bool> UpdatePasswordAsync(UpdatePassword_VM Model);
        public Task<bool> TurnPasscodeLockOnAsync(PasscodeLock_VM Model);
        public Task<bool> TurnPasscodeLockOffAsync(PasscodeLock_VM Model);
        public Task<bool> EditPasscodeLockAsync(PasscodeLock_VM Model);
        public Task<int> AutoSignInAsync();
    }
}
