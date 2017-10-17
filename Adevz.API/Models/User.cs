using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;
namespace Adevz.API.Models
{
    public class User
    {
        [Key]
        public Guid UserId { get; set; }
        public string LastName { get; set; }
        public string FirstName { get; set; }
        public string Company { get; set; }
        public string Email { get; set; }
        public string HomePhone { get; set; }
        public string CellPhone { get; set; }
        public int Experience { get; set; }
        public string Location { get; set; }
        public string Education { get; set; }
        public string Domain { get; set; }
        public string JobTitle { get; set; }
        public List<Skills> UserSkill { get; set; }
         
    }
}
