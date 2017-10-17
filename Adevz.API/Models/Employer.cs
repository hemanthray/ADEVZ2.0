using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace Adevz.API.Models
{
    public class Employer
    {
        [Key]
        public Guid CompanyId { get; set; }
        public bool isSuperUser { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string CompanyName { get; set; }
        public string Email { get; set; }
        public string HomePhone { get; set; }
        public string CellPhone { get; set; }
 
        public List<Skills> UserSkill { get; set; }
    }
}
