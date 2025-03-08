using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using OngakuProject.Data;
using OngakuProject.Interfaces;
using OngakuProject.Models;
using OngakuProject.ViewModels;

namespace OngakuProject.Repositories
{
    public class AccountRep : IAccount
    {
        private readonly Context _context;
        private readonly SignInManager<User> _signInManager;
        private readonly UserManager<User> _userManager;

        public AccountRep(Context context, SignInManager<User> signInManager, UserManager<User> userManager)
        {
            _context = context;
            _signInManager = signInManager;
            _userManager = userManager;
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
    }
}
