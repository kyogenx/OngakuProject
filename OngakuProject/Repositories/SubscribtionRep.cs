using Microsoft.EntityFrameworkCore;
using OngakuProject.Data;
using OngakuProject.Interfaces;
using OngakuProject.Models;

namespace OngakuProject.Repositories
{
    public class SubscribtionRep : ISubscribtion
    {
        private readonly Context _context;
        public SubscribtionRep(Context context)
        {
            _context = context;
        }

        public async Task<int> SubscribeAsync(int Id, int SubscriberId)
        {
            if(Id > 0 && SubscriberId > 0)
            {
                int Result = 0;
                UserSubscribtion? WasSubscribedBeforeInfo = await _context.UserSubscribtions.AsNoTracking().Where(s => s.SubscriberId == SubscriberId && s.UserId == Id).Select(s => new UserSubscribtion { Id = s.Id, IsDeleted = s.IsDeleted }).FirstOrDefaultAsync();
                if (WasSubscribedBeforeInfo is not null)
                {
                    if (WasSubscribedBeforeInfo.IsDeleted)
                    {
                        Result = await _context.UserSubscribtions.Where(u => u.Id == WasSubscribedBeforeInfo.Id).ExecuteUpdateAsync(s => s.SetProperty(s => s.IsDeleted, false).SetProperty(s => s.SubscribedFrom, DateTime.Now));
                        if (Result > 0) return WasSubscribedBeforeInfo.Id;
                    }
                }
                else
                {
                    UserSubscribtion userSubscribtionSample = new UserSubscribtion
                    {
                        UserId = Id,
                        SubscriberId = SubscriberId,
                        SubscribedFrom = DateTime.Now
                    };
                    await _context.AddAsync(userSubscribtionSample);
                    await _context.SaveChangesAsync();

                    return userSubscribtionSample.Id;
                }
            }
            return 0;
        }

        public async Task<bool> UnsubscribeAsync(int Id, int SubscriberId)
        {
            if(Id > 0 && SubscriberId > 0)
            {
                int Result = await _context.UserSubscribtions.AsNoTracking().Where(u => u.UserId == Id && u.SubscriberId == SubscriberId && !u.IsDeleted).ExecuteUpdateAsync(u => u.SetProperty(u => u.IsDeleted, true));
                if (Result > 0) return true;
            }
            return false;
        }

        public async Task<bool> IsSubscribedAsync(int Id, int SubscriberId)
        {
            if (Id > 0 && SubscriberId > 0) return await _context.UserSubscribtions.AsNoTracking().AnyAsync(s => s.UserId == Id && s.SubscriberId == SubscriberId && !s.IsDeleted);
            else return false;
        }
    }
}
