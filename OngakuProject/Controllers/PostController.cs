using Microsoft.AspNetCore.Mvc;
using OngakuProject.Data;
using OngakuProject.Interfaces;
using OngakuProject.ViewModels;
using System.Security.Claims;

namespace OngakuProject.Controllers
{
    public class PostController : Controller
    {
        private readonly IPost _post;
        private readonly IProfile _profile;
        private readonly Context _context;

        public PostController(IPost post, IProfile profile, Context context)
        {
            _post = post;
            _profile = profile;
            _context = context;
        }

        [HttpPost]
        public async Task<IActionResult> Create(Post_VM Model)
        {
            if(User.Identity.IsAuthenticated)
            {
                string? CurrentUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                Model.UserId = _profile.ParseCurrentUserId(CurrentUserId);

                if(ModelState.IsValid)
                {
                    int Result = await _post.CreatePostAsync(Model);
                    if (Result > 0) return Json(new { success = true, result = Result, model = Model });
                }
                return Json(new { sucess = false, error = 0 });
            }
            return Json(new { sucess = false, error = -1 });
        }
    }
}
