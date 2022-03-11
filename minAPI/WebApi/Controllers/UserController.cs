using Microsoft.AspNetCore.Mvc;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace WebApi.Controllers
{
    using DataAccess.Model;
    using DataAccess.Repo.Interface;

    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IRepository<User?> userRepo;

        // GET: api/<UserController>
        public UserController(IRepository<User?> userRepo)
        {
            this.userRepo = userRepo;
        }

        [HttpGet(nameof(users))]
        public async Task<IEnumerable<User>> users()
        {
            var list = new List<User>(1000);
            for (int index = 1; index < 1001; index++)
            {
                list.Add(new User
                {
                    Id = index,
                    Age = 25,
                    FirstName = "First_Name" + index,
                    LastName = "Last_Name" + index,
                    Email = "Email" + index,
                    Framework = "minimal"
                }
                );
            }

            return list;
        }

        [HttpGet(nameof(GetEfCore))]
        public async Task<IEnumerable<User>> GetEfCore()
        {
            return await userRepo.GetAll();
        }

        // GET api/<UserController>/5
        [HttpGet("{id}")]
        public User? Get(int id)
        {
            return userRepo.GetById(id);
        }
    }
}