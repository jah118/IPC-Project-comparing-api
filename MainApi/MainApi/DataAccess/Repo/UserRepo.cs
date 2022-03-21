using MainApi.DataAccess;
using MainApi.DataAccess.Model;
using MainApi.DataAccess.Repo.Interface;
using Microsoft.EntityFrameworkCore;

public class UserRepo : IRepository<User>
{
    private readonly ApiContext context;

    public UserRepo(ApiContext context)
    {
        this.context = context;
        context.Database.EnsureCreated();
    }

    public Task<List<User>> GetAll()
    {
        var user = this.context.Users.ToListAsync();
        return user;
    }

    public User? GetById(int id)
    {
        var user = this.context.Users.AsNoTracking().SingleOrDefault(p => p.Id == id);
        return user;
    }

    public User? Create(User obj)
    {
        throw new NotImplementedException();
    }

    public User Update(User obj)
    {
        throw new NotImplementedException();
    }

    public void Delete(int id)
    {
        var userToDelete = this.context.Users.Find(id);
        if (userToDelete is not null)
        {
            this.context.Users.Remove(userToDelete);
            this.context.SaveChanges();
        }
    }
}