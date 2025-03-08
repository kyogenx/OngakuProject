using Microsoft.AspNetCore.Mvc;
using OngakuProject.Data;
using OngakuProject.Interfaces;

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

        public async Task<IActionResult> Initiate()
        {
            return View();
        }
    }
}
