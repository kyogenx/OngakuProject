using Microsoft.AspNetCore.Mvc;
using OngakuProject.Data;
using OngakuProject.Interfaces;
using OngakuProject.ViewModels;

namespace OngakuProject.Controllers
{
    public class AccountController : Controller
    {
        private readonly IAccount _account;
        private readonly Context _context;

        public AccountController(IAccount account, Context context)
        {
            _account = account;
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> CheckAccountByEmail(string? Email, byte Type)
        {
            bool Result = await _account.CheckAccountByEmail(Email);
            return Json(new { success = Result, email = Email, type = Type });
        }

        [HttpPost]
        public async Task<IActionResult> Create(SignUp_VM Model)
        {
            if(ModelState.IsValid)
            {
                int Result = await _account.SignUpAsync(Model);
                if (Result > 0) return Json(new { success = true, model = Model, id = Result });
                else return Json(new { success = false, alert = "Passwords are not equal to each other" });
            }
            return Json(new { success = false, alert = "Unable to create your account due to some unexpected errors. Please try again a bit later" });
        }

        [HttpPost]
        public async Task<IActionResult> SignIn(SignIn_VM Model)
        {
            if (ModelState.IsValid)
            {
                bool Result = await _account.SignInAsync(Model);
                return Json(new { success = Result });
            }
            else return Json(new { success = false });
        }

        [HttpPost]
        public async Task<IActionResult> SendPasswordResetCode(string? Email)
        {
            int Result = await _account.SendPasswordResetEmailAsync(Email);
            if (Result > 0) return Json(new { success = true, id = Result });
            else return Json(new { success = false });
        }

        [HttpPost]
        public IActionResult CheckPasswordResetEmailCode(int UserId, string? Code)
        {
            bool Result = _account.CheckPasswordResetCodeAsync(UserId, Code);
            if (Result) return Json(new { success = true });
            else return Json(new { success = false });
        }

        [HttpPost]
        public async Task<IActionResult> ResetPassword(string? Email, string? Password, string? ConfirmPassword)
        {
            bool Result = await _account.ResetPasswordAsync(Email, Password, ConfirmPassword);
            if (Result) return Json(new { success = true, email = Email });
            else return Json(new { success = false });
        }

        public async Task<IActionResult> Initiate()
        {
            return View();
        }
    }
}
