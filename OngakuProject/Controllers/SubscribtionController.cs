using Microsoft.AspNetCore.Mvc;
using OngakuProject.Interfaces;
using System.Security.Claims;

namespace OngakuProject.Controllers
{
    public class SubscribtionController : Controller
    {
        private readonly IProfile _profile;
        private readonly ISubscribtion _subscribtion;
        public SubscribtionController(IProfile profile, ISubscribtion subscribtion)
        {
            _profile = profile;
            _subscribtion = subscribtion;
        }

        [HttpPost]
        public async Task<IActionResult> Subscribe(int Id)
        {
            if(User.Identity.IsAuthenticated)
            {
                string? UserId_Str = User.FindFirstValue(ClaimTypes.NameIdentifier);
                int SubscriberId = _profile.ParseCurrentUserId(UserId_Str);

                int Result = await _subscribtion.SubscribeAsync(Id, SubscriberId);
                if (Result > 0) return Json(new { success = true, userId = Id, result = Result });
            }
            return Json(new { success = false });
        }

        [HttpPost]
        public async Task<IActionResult> Unsubscribe(int Id)
        {
            if(User.Identity.IsAuthenticated)
            {
                string? UserId_Str = User.FindFirstValue(ClaimTypes.NameIdentifier);
                int SubscriberId = _profile.ParseCurrentUserId(UserId_Str);

                bool Result = await _subscribtion.UnsubscribeAsync(Id, SubscriberId);
                return Json(new { success = Result, userId = Id });
            }
            else return Json(new { success = false });
        }
    }
}
