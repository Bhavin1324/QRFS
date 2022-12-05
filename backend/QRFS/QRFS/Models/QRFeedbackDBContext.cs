using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.Extensions.Configuration;

// Code scaffolded by EF Core assumes nullable reference types (NRTs) are not used or disabled.
// If you have enabled NRTs for your project, then un-comment the following line:
// #nullable disable

namespace QRFS.Models
{
    public partial class QRFeedbackDBContext : DbContext
    {
        IConfiguration Configuration { get; }
        public QRFeedbackDBContext()
        {
        }
        public QRFeedbackDBContext(DbContextOptions<QRFeedbackDBContext> options, IConfiguration configuration)
            : base(options)
        {
            Configuration = configuration;
        }

        public virtual DbSet<Area> Area { get; set; }
        public virtual DbSet<CitizenResponse> CitizenResponse { get; set; }
        public virtual DbSet<District> District { get; set; }
        public virtual DbSet<FeedbackLog> FeedbackLog { get; set; }
        public virtual DbSet<Options> Options { get; set; }
        public virtual DbSet<PoliceOfficer> PoliceOfficer { get; set; }
        public virtual DbSet<PoliceStation> PoliceStation { get; set; }
        public virtual DbSet<Questions> Questions { get; set; }
        public virtual DbSet<SubDivision> SubDivision { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
                optionsBuilder.UseSqlServer(Configuration["ConnectionStrings:DefaultConnection"]);
            }
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Area>(entity =>
            {
                entity.Property(e => e.Id)
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.Name).IsUnicode(false);
            });

            modelBuilder.Entity<CitizenResponse>(entity =>
            {
                entity.Property(e => e.Id)
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.LogId)
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.OptionId)
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.QuestionId)
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.StationId)
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.HasOne(d => d.Log)
                    .WithMany(p => p.CitizenResponse)
                    .HasForeignKey(d => d.LogId)
                    .OnDelete(DeleteBehavior.Cascade)
                    .HasConstraintName("FK__CitizenRe__LogId__6A30C649");

                entity.HasOne(d => d.Option)
                    .WithMany(p => p.CitizenResponse)
                    .HasForeignKey(d => d.OptionId)
                    .OnDelete(DeleteBehavior.Cascade)
                    .HasConstraintName("FK__CitizenRe__Optio__693CA210");

                entity.HasOne(d => d.Question)
                    .WithMany(p => p.CitizenResponse)
                    .HasForeignKey(d => d.QuestionId)
                    .HasConstraintName("FK__CitizenRe__Quest__68487DD7");

                entity.HasOne(d => d.Station)
                    .WithMany(p => p.CitizenResponse)
                    .HasForeignKey(d => d.StationId)
                    .HasConstraintName("FK__CitizenRe__Stati__6B24EA82");
            });

            modelBuilder.Entity<District>(entity =>
            {
                entity.Property(e => e.Id)
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.Name).IsUnicode(false);
            });

            modelBuilder.Entity<FeedbackLog>(entity =>
            {
                entity.Property(e => e.Id)
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.CitizenEmail).IsUnicode(false);

                entity.Property(e => e.LogTimeStamp).HasColumnType("datetime");

                entity.Property(e => e.StationId)
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.HasOne(d => d.Station)
                    .WithMany(p => p.FeedbackLog)
                    .HasForeignKey(d => d.StationId)
                    .OnDelete(DeleteBehavior.Cascade)
                    .HasConstraintName("FK__FeedbackL__Stati__3E52440B");
            });

            modelBuilder.Entity<Options>(entity =>
            {
                entity.Property(e => e.Id)
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.QuestionId)
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.Text).IsUnicode(false);

                entity.Property(e => e.TextGujarati).IsUnicode(false);

                entity.HasOne(d => d.Question)
                    .WithMany(p => p.Options)
                    .HasForeignKey(d => d.QuestionId)
                    .OnDelete(DeleteBehavior.Cascade)
                    .HasConstraintName("FK__Options__Questio__59FA5E80");
            });

            modelBuilder.Entity<PoliceOfficer>(entity =>
            {
                entity.Property(e => e.Id)
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.Name).IsUnicode(false);

                entity.Property(e => e.OfficerEmail).IsUnicode(false);

                entity.Property(e => e.OfficerPassword).IsUnicode(false);

                entity.Property(e => e.StationId)
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.HasOne(d => d.Station)
                    .WithMany(p => p.PoliceOfficer)
                    .HasForeignKey(d => d.StationId)
                    .OnDelete(DeleteBehavior.Cascade)
                    .HasConstraintName("FK__PoliceOff__Stati__440B1D61");
            });

            modelBuilder.Entity<PoliceStation>(entity =>
            {
                entity.Property(e => e.Id)
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.AreaId)
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.DistrictId)
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.SubDivisionId)
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.HasOne(d => d.Area)
                    .WithMany(p => p.PoliceStation)
                    .HasForeignKey(d => d.AreaId)
                    .OnDelete(DeleteBehavior.Cascade)
                    .HasConstraintName("FK__PoliceSta__AreaI__3B75D760");

                entity.HasOne(d => d.District)
                    .WithMany(p => p.PoliceStation)
                    .HasForeignKey(d => d.DistrictId)
                    .OnDelete(DeleteBehavior.Cascade)
                    .HasConstraintName("FK__PoliceSta__Distr__398D8EEE");

                entity.HasOne(d => d.SubDivision)
                    .WithMany(p => p.PoliceStation)
                    .HasForeignKey(d => d.SubDivisionId)
                    .OnDelete(DeleteBehavior.Cascade)
                    .HasConstraintName("FK__PoliceSta__SubDi__3A81B327");
            });

            modelBuilder.Entity<Questions>(entity =>
            {
                entity.Property(e => e.Id)
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.IsDescriptive).HasColumnName("isDescriptive");

                entity.Property(e => e.Text).IsUnicode(false);

                entity.Property(e => e.TextGujarati).IsUnicode(false);
            });

            modelBuilder.Entity<SubDivision>(entity =>
            {
                entity.Property(e => e.Id)
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.Name).IsUnicode(false);
            });

            OnModelCreatingPartial(modelBuilder);
        }

        partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
    }
}
