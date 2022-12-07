using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Tokens;
using QRFS.Models;
using QRFS.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace QRFS
{
    public class Startup
    {
        public static SymmetricSecurityKey SIGNIN_KEY;
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
            SIGNIN_KEY = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(Configuration.GetSection("JWTConfig").GetSection("SECRET_KEY").Value));
        }

    public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddCors();

            #region SMTP service registration
            //Service for registering email configuration
            var emailConfig = Configuration.GetSection("SMTPConfig").Get<SMTPConfig>();
            services.AddSingleton(emailConfig);
            services.AddScoped<IEmailService, EmailService>();
            #endregion

            #region JWT service conf
            services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = "JwtBearer";
                options.DefaultChallengeScheme = "JwtBearer";
            })
            .AddJwtBearer("JwtBearer", options => 
            {
                options.TokenValidationParameters = new TokenValidationParameters()
                {
                    IssuerSigningKey = SIGNIN_KEY,
                    ValidateIssuer= true,
                    ValidateAudience= true,
                    ValidIssuer = "http://localhost:42100",
                    ValidAudience= "http://localhost:42100",
                    ValidateLifetime= true,
                };
            });
            #endregion

            services.AddControllers().AddNewtonsoftJson(options => options.SerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore);

            #region Database connection string registration
            services.AddDbContext<QRFeedbackDBContext>(options =>
            {
                options.UseSqlServer(Configuration.GetConnectionString("DefaultConnection"));
            });
            #endregion
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            app.UseCors(builder =>
            {
                builder
                .AllowAnyOrigin()
                .AllowAnyMethod()
                .AllowAnyHeader();
            });
            app.UseRouting();
            app.UseAuthentication();
            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }
    }
}
