using DataAccess.Model;
using DataAccess.Repositories.Interfaces;

namespace DataAccess.Repo
{
    internal class UserRepo : IRepository<User>
    {
        public IEnumerable<User> GetAll()
        {
            using (var db = new ApiContext())


                throw new NotImplementedException();
        }

        public User? GetById(object id)
        {
            throw new NotImplementedException();
        }

        public User? Create(User obj)
        {
            throw new NotImplementedException();
        }

        public User Update(User obj)
        {
            throw new NotImplementedException();
        }
    }
}
