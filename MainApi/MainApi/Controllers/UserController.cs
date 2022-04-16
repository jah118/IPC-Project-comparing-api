using MainApi.DataAccess.Model;
using MainApi.DataAccess.Repo.Interface;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace MainApi.Controllers
{
    //[Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IRepository<User?> _userRepo;
        private const string? HelloWorldPayload = "Hello, World!";

        // GET: api/<UserController>
        public UserController(IRepository<User?> userRepo)
        {
            this._userRepo = userRepo;
        }

        [HttpGet(nameof(Users))]
        public IEnumerable<User> Users()
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
            return await _userRepo.GetAll();
        }

        // GET api/<UserController>/5
        [HttpGet(nameof(GetEfCoreById))]
        public User? GetEfCoreById(int id)
        {
            return _userRepo.GetById(id);
        }

        [HttpGet(nameof(Hello))]
        public string? Hello()
        {
            return "Hello World!";
        }

        [HttpGet(nameof(Plain))]
        public IResult Plain()
        {
            Results.StatusCode(200);
            Results.Content("text/plain");
            return Results.Text(HelloWorldPayload);
        }
    }
}