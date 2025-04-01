using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;
using OngakuProject.Data;
using OngakuProject.Interfaces;
using OngakuProject.Models;
using OngakuProject.ViewModels;

namespace OngakuProject.Repositories
{
    public class AccountRep : IAccount
    {
        private readonly Context _context;
        private readonly IMail _mail;
        private readonly IMemoryCache _memoryCache;
        private readonly SignInManager<User> _signInManager;
        private readonly UserManager<User> _userManager;

        public AccountRep(Context context, IMail mail, IMemoryCache memoryCache, SignInManager<User> signInManager, UserManager<User> userManager)
        {
            _context = context;
            _mail = mail;
            _memoryCache = memoryCache;
            _signInManager = signInManager;
            _userManager = userManager;
        }

        public async Task<bool> CheckAccountByEmail(string? Email)
        {
            if (!String.IsNullOrWhiteSpace(Email))
            {
                bool Result = await _context.Users.AsNoTracking().AnyAsync(u => u.Email == Email);
                return Result;
            }
            else return true;
        }

        public async Task<bool> CheckPasswordByEmail(string? Email, string? Password)
        {
            if (!String.IsNullOrWhiteSpace(Email) && !String.IsNullOrWhiteSpace(Password))
            {
                User? UserInfo = await _userManager.FindByEmailAsync(Email);
                if(UserInfo != null)
                {
                    bool Result = await _userManager.CheckPasswordAsync(UserInfo, Password);
                    if (Result) return true;
                }
            }
            return false;
        }

        public Task<int> AutoSignInAsync()
        {
            throw new NotImplementedException();
        }

        public async Task<bool> SignInAsync(SignIn_VM Model)
        {
            if(!String.IsNullOrWhiteSpace(Model.Username) && !String.IsNullOrWhiteSpace(Model.Password))
            {
                SignInResult? Result = await _signInManager.PasswordSignInAsync(Model.Username, Model.Password, true, true);
                if (Result.Succeeded) return true;
            }
            return false;
        }

        public async Task<int> SignUpAsync(SignUp_VM Model)
        {
            if(!String.IsNullOrWhiteSpace(Model.Email) && !String.IsNullOrWhiteSpace(Model.Password))
            {
                bool CheckAccountAvailability = await _context.Users.AsNoTracking().AnyAsync(u => u.Email == Model.Email);
                if(!CheckAccountAvailability)
                {
                    User NewUser = new User
                    {
                        Email = Model.Email,
                        UserName = Model.Email,
                        Nickname = Guid.NewGuid().ToString("D").Substring(0, 8),
                        Searchname = Guid.NewGuid().ToString("D").Substring(3, 15)
                    };
                    IdentityResult? Result = await _userManager.CreateAsync(NewUser, Model.Password);
                    if (Result.Succeeded)
                    {
                        await _signInManager.SignInAsync(NewUser, true);
                        return NewUser.Id;
                    }
                }
            }
            return 0;
        }

        public async Task<int> SendPasswordResetEmailAsync(string? Email)
        {
            if (Email is not null)
            {
                User? UserInfo = await _userManager.FindByEmailAsync(Email);
                if (UserInfo is not null)
                {
                    int RandCode = 123456;
                    //int RandCode = new Random().Next(100000, 999999);
                    //DateTime? CachedValue = await _memoryCache.GetOrCreateAsync(UserInfo.Id + "_MailCode", cacheEntry =>
                    //{
                    //    cacheEntry.AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(5);
                    //    cacheEntry.SetSlidingExpiration(TimeSpan.FromSeconds(3));
                    //    cacheEntry.SetValue(RandCode.ToString());
                    //    return Task.FromResult(DateTime.Now);
                    //});
                    _memoryCache.Set(UserInfo.Id + "_MailCode", RandCode.ToString(), new MemoryCacheEntryOptions().SetSlidingExpiration(TimeSpan.FromMinutes(2)).SetAbsoluteExpiration(TimeSpan.FromMinutes(6)));

                    MailMessage_VM mailMessage_VM = new MailMessage_VM()
                    {
                        To = Email,
                        Subject = "One-Time Code",
                        Body = "<div style='border-radius: 10px; border: 1px solid #f0f0f0; padding: 4px;'> <h1 class='demoTitle' style='text-align: center; font-family: Trebuchet MS; font-size: 60px;'> <span style='color: #000000;'>" + RandCode + "</span> </h1> <h1 style='text-align: center;'> <span style='color: #000000; font-family: Trebuchet MS;'>One-Time Code</span> </h1> <p style='text-align: center; font-family: Trebuchet MS;' data-start='160' data-end='289'> Please enter this code in the designated field within our app to verify your identity and proceed with resetting your password. Code is actual for only <span style='font-weight: 500'>6</span> minutes</p> <div style='border: 0; border-top: 1px solid #f0f0f0;'>&nbsp;</div> <h1 style='text-align: center; font-family: Trebuchet MS;' data-start='160' data-end='289'> <span style='color: #ff0000;'>Important</span> </h1> <p style='text-align: center; font-family: Trebuchet MS;' data-start='160' data-end='289'> If you did not request this password reset, please disregard this message. No action is required on your part </p> </div>"
                    };
                    //await _mail.SendEmailMessageAsync(new MailKit_VM(), mailMessage_VM);
                    return UserInfo.Id;
                }
            }
            return 0;
        }

        public bool CheckPasswordResetCodeAsync(int UserId, string? Code)
        {
            if(UserId > 0 && Code is not null)
            {
                bool TryGetResult = _memoryCache.TryGetValue(UserId + "_MailCode", out string? RealCode);
                if(TryGetResult && Code == RealCode)
                {
                    _memoryCache.Remove(UserId + "_MailCode");
                    return true;
                }
            }
            return false;
        }

        public async Task<bool> ResetPasswordAsync(string? Email, string? NewPassword, string? ConfirmPassword)
        {
            if(Email != null && NewPassword != null && ConfirmPassword == NewPassword)
            {
                User? CurrentUser = await _userManager.FindByEmailAsync(Email);
                if(CurrentUser is not null)
                {
                    string? PasswordResetToken = await _userManager.GeneratePasswordResetTokenAsync(CurrentUser);
                    if(PasswordResetToken != null)
                    {
                        IdentityResult? Result = await _userManager.ResetPasswordAsync(CurrentUser, PasswordResetToken, NewPassword);
                        if (Result.Succeeded) return true;
                    }
                }
            }
            return false;
        }

        public async Task<bool> UpdatePasswordAsync(UpdatePassword_VM Model)
        {
            if(Model.Id != null && Model.AdditionalInfo is not null && !String.IsNullOrWhiteSpace(Model.NewPassword) && !String.IsNullOrWhiteSpace(Model.ConfirmPassword))
            {
                User? UserInfo = await _userManager.FindByIdAsync(Model.Id);
                if(UserInfo is not null)
                {
                    if (Model.Type == 0)
                    {
                        IdentityResult? Result = await _userManager.ChangePasswordAsync(UserInfo, Model.AdditionalInfo, Model.NewPassword);
                        if (Result.Succeeded) return true;
                    }
                    else
                    {
                        IdentityResult? Result = await _userManager.ResetPasswordAsync(UserInfo, Model.AdditionalInfo, Model.NewPassword);
                        if (Result.Succeeded) return true;
                    }
                }
            }
            return false;
        }

        public async Task<bool> TurnPasscodeLockOnAsync(PasscodeLock_VM Model)
        {
            if(Model.Id != 0 && !String.IsNullOrWhiteSpace(Model.Passcode))
            {
                bool CheckCurrentUsersPasscode = await _context.Users.AsNoTracking().AnyAsync(u => u.Id == Model.Id && u.Passcode != null);
                if (!CheckCurrentUsersPasscode)
                {
                    int Result = await _context.Users.AsNoTracking().Where(u => u.Id == Model.Id).ExecuteUpdateAsync(u => u.SetProperty(u => u.Passcode, Model.Passcode));
                    if (Result > 0) return true;
                }
            }
            return false;
        }

        public async Task<bool> TurnPasscodeLockOffAsync(PasscodeLock_VM Model)
        {
            if(Model.Id > 0 && !String.IsNullOrWhiteSpace(Model.CurrentPasscode))
            {
                bool CheckCurrentUsersPasscode = await _context.Users.AsNoTracking().AnyAsync(u => u.Id == Model.Id && u.Passcode != Model.CurrentPasscode);
                if (CheckCurrentUsersPasscode)
                {
                    string? NullPasscode = null;
                    int Result = await _context.Users.AsNoTracking().Where(u => u.Id == Model.Id).ExecuteUpdateAsync(u => u.SetProperty(u => u.Passcode, NullPasscode));
                    if(Result > 0) return true; 
                }
            }
            return false;
        }

        public async Task<bool> EditPasscodeLockAsync(PasscodeLock_VM Model)
        {
            if(Model.Id > 0 && !String.IsNullOrWhiteSpace(Model.Passcode) && !String.IsNullOrWhiteSpace(Model.CurrentPasscode))
            {
                int Result = await _context.Users.AsNoTracking().Where(u => u.Id == Model.Id && u.Passcode == Model.CurrentPasscode).ExecuteUpdateAsync(u => u.SetProperty(u => u.Passcode, Model.Passcode));
                if (Result > 0) return true;
            }
            return false;
        }
    }
}
