using System;
using System.Collections.Generic;

// Code scaffolded by EF Core assumes nullable reference types (NRTs) are not used or disabled.
// If you have enabled NRTs for your project, then un-comment the following line:
// #nullable disable

namespace QRFS.Models
{
    public partial class Area
    {
        public Area()
        {
            PoliceStation = new HashSet<PoliceStation>();
        }

        public string Id { get; set; }
        public string Name { get; set; }

        public virtual ICollection<PoliceStation> PoliceStation { get; set; }
    }
}
