using System;
using System.Collections.Generic;

// Code scaffolded by EF Core assumes nullable reference types (NRTs) are not used or disabled.
// If you have enabled NRTs for your project, then un-comment the following line:
// #nullable disable

namespace QRFS.Models
{
    public partial class PoliceOfficer
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public string OfficerEmail { get; set; }
        public string OfficerPassword { get; set; }
        public string StationId { get; set; }

        public virtual PoliceStation Station { get; set; }
    }
}
