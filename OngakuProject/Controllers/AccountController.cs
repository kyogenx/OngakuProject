using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using OngakuProject.Data;
using OngakuProject.Interfaces;
using OngakuProject.Models;
using OngakuProject.ViewModels;
using System.Security.Claims;
using static Org.BouncyCastle.Crypto.Engines.SM2Engine;

namespace OngakuProject.Controllers
{
    public class AccountController : Controller
    {
        private readonly UserManager<User> _userManager;
        private readonly IAccount _account;
        private readonly IProfile _profile;
        private readonly IMail _mail;
        private readonly Context _context;

        public AccountController(UserManager<User> userManager, IAccount account, IProfile profile, IMail mail, Context context)
        {
            _userManager = userManager;
            _account = account;
            _profile = profile;
            _mail = mail;
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
                int Result = await _account.SignInAsync(Model);
                if(Result > 0) return Json(new { success = true, result = Result, model = Model });
            }
            return Json(new { success = false });
        }

        [HttpPost]
        public async Task<IActionResult> PasscodeSignIn(SignIn_VM Model)
        {
            if(ModelState.IsValid)
            {
                bool Result = await _account.PasscodeSignInAsync(Model);
                if (Result) return Json(new { success = true });
            }
            return Json(new { success = false });
        }

        [HttpPost]
        public async Task<IActionResult> SendPasswordResetCode(string? Email)
        {
            int Result = await _account.SendPasswordResetEmailAsync(Email);
            if (Result > 0) return Json(new { success = true, id = Result });
            else return Json(new { success = false });
        }

        [HttpGet]
        public async Task<IActionResult> CheckThePassword(string? Email, string? Password)
        {
            bool Result = await _account.CheckPasswordByEmail(Email, Password);
            if (Result) return Json(new { success = true, password = Password });
            else return Json(new { success = false });
        }

        [HttpPost]
        public async Task<IActionResult> CheckPasswordResetEmailCode(int UserId, string? Code, byte Type)
        {
            bool Result = _account.CheckPasswordResetCodeAsync(UserId, Code);
            if (Result)
            {
                if(Type == 0) return Json(new { success = true });
                else
                {
                    User? UserInfo = await _userManager.FindByIdAsync(UserId.ToString());
                    if(UserInfo != null)
                    {
                        string? PasswordResetCode = await _userManager.GeneratePasswordResetTokenAsync(UserInfo);
                        return Json(new { success = true, code = PasswordResetCode });
                    }
                }
            }
            return Json(new { success = false });
        }

        [HttpPost]
        public async Task<IActionResult> ResetPassword(string? Email, string? Password, string? ConfirmPassword)
        {
            bool Result = await _account.ResetPasswordAsync(Email, Password, ConfirmPassword);
            if (Result) return Json(new { success = true, email = Email });
            else return Json(new { success = false });
        }

        [HttpPost]
        public async Task<IActionResult> SetPasscodeLock(PasscodeLock_VM Model)
        {
            if(ModelState.IsValid)
            {
                string? CurrentUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                Model.Id = _profile.ParseCurrentUserId(CurrentUserId);
                bool Result = await _account.TurnPasscodeLockOnAsync(Model);
                if (Result) return Json(new { success = true });
            }
            return Json(new { success = false });
        }

        [HttpPost]
        public async Task<IActionResult> EditPasscodeLock(PasscodeLock_VM Model)
        {
            if(ModelState.IsValid)
            {
                string? CurrentUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                Model.Id = _profile.ParseCurrentUserId(CurrentUserId);
                bool Result = await _account.EditPasscodeLockAsync(Model);

                if (Result) return Json(new { success = true });
            }
            return Json(new { success = false });
        }

        [HttpPost]
        public async Task<IActionResult> DisablePasscodeLock(PasscodeLock_VM Model)
        {
            if(ModelState.IsValid)
            {
                string? CurrentUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                Model.Id = _profile.ParseCurrentUserId(CurrentUserId);
                bool Result = await _account.TurnPasscodeLockOffAsync(Model);

                if (Result) return Json(new { success = true });            
            }
            return Json(new { success = false });
        }

        [HttpPost]
        public async Task<IActionResult> SendThePasscodeViaInbox()
        {
            string? CurrentUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            int UserId = _profile.ParseCurrentUserId(CurrentUserId);
            User? UserGuts = await _profile.GetUserGutsOnlyByIdAsync(UserId);
            if(UserGuts is not null)
            {
                MailMessage_VM Model = new MailMessage_VM()
                {
                    Subject = "Passcode Lock",
                    Title = "Passcode Lock Code",
                    To = UserGuts.Email,
                    Body = "<div style='border-radius: 10px; border: 1px solid #f0f0f0; padding: 4px;'><h1 style='text-align: center;'> <span style='color: #000000; font-family: Trebuchet MS;'>" + UserGuts.Passcode + "</span> </h1> <p style='text-align: center; font-family: Trebuchet MS;' data-start='160' data-end='289'> Please enter this code in the designated field within our app to verify your identity and proceed for further actions.</p> <div style='border: 0; border-top: 1px solid #f0f0f0;'>&nbsp;</div> <h1 style='text-align: center; font-family: Trebuchet MS;' data-start='160' data-end='289'> <span style='color: #ff0000;'>Important</span> </h1> <p style='text-align: center; font-family: Trebuchet MS;' data-start='160' data-end='289'> If you did not request this password reset, please disregard this message. No action is required on your part</p> </div>"
                };
                bool Result = await _mail.SendEmailMessageAsync(new MailKit_VM(), Model);
                if (Result) return Json(new { success = true });
            }
            return Json(new { success = false });
        }

        public async Task<IActionResult> Initiate()
        {
            return View();
        }
    }
}
