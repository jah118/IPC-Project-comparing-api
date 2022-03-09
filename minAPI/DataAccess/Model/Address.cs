using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace DataAccess.Model
{
    public class Address
    {
        public int Id { get; set; }
        public string AddressDetail { get; set; }
        [ForeignKey("UserId")]
        public User User { get; set; }

        public int UserId { get; set; }
    }
}
