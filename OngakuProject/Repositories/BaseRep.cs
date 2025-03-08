using Microsoft.EntityFrameworkCore;
using OngakuProject.Data;
using OngakuProject.Interfaces;

namespace OngakuProject.Repositories
{
    public class BaseRep<T> : IBase<T> where T : class
    {
        private readonly Context _context;
        public BaseRep(Context context)
        {
            _context = context;
        }

        public async Task<T?> GetValueByIdAsync(int Id)
        {
            return await _context.Set<T>().FirstOrDefaultAsync();
        }

        public async Task<List<T>?> GetValuesAsync()
        {
            return await _context.Set<T>().ToListAsync();
        }
    }
}
