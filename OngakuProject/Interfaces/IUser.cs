﻿using OngakuProject.Models;

namespace OngakuProject.Interfaces
{
    public interface IUser 
    {
        public IQueryable<User?> FindUsers(string? Keyword);
        public Task<User?> FindUserAsync(int Id);
        public Task<User?> FindUserCompressedAsync(int Id);
    }
}
