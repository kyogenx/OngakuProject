using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OngakuProject.Data;
using OngakuProject.Interfaces;
using OngakuProject.Models;

namespace OngakuProject.Controllers
{
    public class UserController : Controller
    {
        private readonly Context _context;
        private readonly IUser _user;

        public UserController(Context context, IUser user)
        {
            _context = context;
            _user = user;
        }

        [HttpGet]
        public async Task<IActionResult> Search(byte Type, string? Keyword)
        {
            IQueryable<User?> UsersPreview = _user.FindUsers(Keyword);
            List<User?>? Users = UsersPreview != null ? await UsersPreview.ToListAsync() : null;

            if (Users is not null) return Json(new { success = true, type = Type, result = Users });
            else return Json(new { success = false });
        }
    }
}
