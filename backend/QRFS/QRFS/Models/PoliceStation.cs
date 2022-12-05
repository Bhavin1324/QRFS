using System;
using System.Collections.Generic;

// Code scaffolded by EF Core assumes nullable reference types (NRTs) are not used or disabled.
// If you have enabled NRTs for your project, then un-comment the following line:
// #nullable disable

namespace QRFS.Models
{
    public partial class PoliceStation
    {
        public PoliceStation()
        {
            CitizenResponse = new HashSet<CitizenResponse>();
            FeedbackLog = new HashSet<FeedbackLog>();
            PoliceOfficer = new HashSet<PoliceOfficer>();
        }

        public string Id { get; set; }
        public string DistrictId { get; set; }
        public string SubDivisionId { get; set; }
        public string AreaId { get; set; }

        public virtual Area Area { get; set; }
        public virtual District District { get; set; }
        public virtual SubDivision SubDivision { get; set; }
        public virtual ICollection<CitizenResponse> CitizenResponse { get; set; }
        public virtual ICollection<FeedbackLog> FeedbackLog { get; set; }
        public virtual ICollection<PoliceOfficer> PoliceOfficer { get; set; }
    }
}
