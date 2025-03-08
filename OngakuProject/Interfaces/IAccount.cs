using OngakuProject.Data;
using OngakuProject.ViewModels;

namespace OngakuProject.Interfaces
{
    public interface IAccount
    {
        public Task<int> SignUpAsync(SignUp_VM Model);
        public Task<bool> SignInAsync(SignIn_VM Model);
        public Task<int> AutoSignInAsync();
    }
}
