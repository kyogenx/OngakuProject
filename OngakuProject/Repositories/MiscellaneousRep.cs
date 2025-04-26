using Microsoft.EntityFrameworkCore;
using OngakuProject.Data;
using OngakuProject.Interfaces;
using OngakuProject.Models;

namespace OngakuProject.Repositories
{
    public class MiscellaneousRep : IMiscellaneous
    {
        private readonly Context _context;
        public MiscellaneousRep(Context context)
        {
            _context = context;
        }

        public async Task<List<Language>?> GetLanguages(string? Keyword)
        {
            if (Keyword != null)
            {
                Keyword = Keyword.ToLower();
                return await _context.Languages.AsNoTracking().Where(l => l.Name!.ToLower().Contains(Keyword) || l.LanguageCode!.ToLower().Contains(Keyword)).Select(l => new Language { Id = l.Id, Name = l.Name }).ToListAsync();
            }
            else return await _context.Languages.AsNoTracking().Select(l => new Language { Id = l.Id, Name = l.Name }).ToListAsync();
        }
    }
}
