using Microsoft.AspNetCore.Mvc;
using OngakuProject.Interfaces;
using OngakuProject.Models;

namespace OngakuProject.Controllers
{
    public class MiscellaneousController : Controller
    {
        private readonly IMiscellaneous _miscellaneous;
        public MiscellaneousController(IMiscellaneous miscellaneous)
        {
            _miscellaneous = miscellaneous;
        }

        [HttpGet]
        public async Task<IActionResult> GetLanguages(string? Keyword, byte Type)
        {
            List<Language>? Languages = await _miscellaneous.GetLanguages(Keyword);
            if (Languages != null) return Json(new { success = true, keyword = Keyword, type = Type, result = Languages });
            else return Json(new { success = false });
        }
    }
}
