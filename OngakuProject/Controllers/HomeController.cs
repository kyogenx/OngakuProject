using System.Diagnostics;
using System.Security.Claims;
using Hangfire;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OngakuProject.Data;
using OngakuProject.Interfaces;
using OngakuProject.Models;
using OngakuProject.Repositories;
using OngakuProject.ViewModels;

namespace OngakuProject.Controllers
{
    public class HomeController : Controller
    {
        private readonly Context _context;
        private readonly IProfile _profile;
        private readonly IGenre _genre;
        private readonly ITrackAnalytic _trackAnalytic;
        private readonly IBackgroundWorker _backgroundWorker;
        private readonly ILogger<HomeController> _logger;

        public HomeController(ILogger<HomeController> logger, Context context, IBackgroundWorker backgroundWorker, IProfile profile, IGenre genre, ITrackAnalytic trackAnalytic)
        {
            _logger = logger;
            _context = context;
            _profile = profile;
            _genre = genre;
            _trackAnalytic = trackAnalytic;
            _backgroundWorker = backgroundWorker;
        }

        public async Task<IActionResult> Index()
        {
            User? UserInfo = null;
            if (User.Identity.IsAuthenticated)
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
