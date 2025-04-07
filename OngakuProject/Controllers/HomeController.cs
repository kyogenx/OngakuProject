using System.Diagnostics;
using System.Security.Claims;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using OngakuProject.Data;
using OngakuProject.Interfaces;
using OngakuProject.Models;

namespace OngakuProject.Controllers
{
    public class HomeController : Controller
    {
        private readonly Context _context;
        private readonly IProfile _profile;
        private readonly ILogger<HomeController> _logger;

        public HomeController(ILogger<HomeController> logger, Context context, IProfile profile)
        {
            _logger = logger;
            _context = context;
            _profile = profile;
        }

        public async Task<IActionResult> Index()
        {
            User? UserInfo = null;
            if(User.Identity.IsAuthenticated)
            {
                string? Id = User.FindFirstValue(ClaimTypes.NameIdentifier);
                int UserId = _profile.ParseCurrentUserId(Id);

                UserInfo = await _profile.GetUserByIdAsync(UserId);
            }
            ViewBag.UserInfo = UserInfo;
            return View();
        }

        public IActionResult Privacy()
        {
            return View();
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}
