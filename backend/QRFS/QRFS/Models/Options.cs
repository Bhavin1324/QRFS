using System;
using System.Collections.Generic;

// Code scaffolded by EF Core assumes nullable reference types (NRTs) are not used or disabled.
// If you have enabled NRTs for your project, then un-comment the following line:
// #nullable disable

namespace QRFS.Models
{
    public partial class Options
    {
        public Options()
        {
            CitizenResponse = new HashSet<CitizenResponse>();
        }

        public string Id { get; set; }
        public string Text { get; set; }
        public string TextGujarati { get; set; }
        public string QuestionId { get; set; }

        public virtual Questions Question { get; set; }
        public virtual ICollection<CitizenResponse> CitizenResponse { get; set; }
    }
}
