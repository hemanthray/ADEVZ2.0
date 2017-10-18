using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Adevz.Web.Services;
using Microsoft.AspNetCore.Authentication.Cookies;

namespace Adevz.Web
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddMvc();
            services.ConfigureApplicationCookie(options => options.LoginPath = "/auth/signin");
            //services.AddAuthentication("MyCookieAuthenticationScheme")
            //    .AddCookie("MyCookieAuthenticationScheme", options => {
            //        options.AccessDeniedPath = "/Account/Forbidden/";
            //        options.LoginPath = "/auth/signin";
            //    });
            //  services.AddCookieAuthentication(o => o.LoginPath = "/auth/signin");

            //services.AddAuthentication("MyCookieAuthenticationScheme")
            //.AddCookie("MyCookieAuthenticationScheme", options =>
            //{
            //    options.AccessDeniedPath = "/Account/Forbidden/";
            //    options.LoginPath = "/auth/signin";
            //});

            //services.AddAuthentication(options =>
            //{
            //    options.DefaultSignInScheme = CookieAuthenticationDefaults.AuthenticationScheme;
            //    options.DefaultAuthenticateScheme = CookieAuthenticationDefaults.AuthenticationScheme;
            //    options.DefaultChallengeScheme = CookieAuthenticationDefaults.AuthenticationScheme;
            //    options.DefaultScheme = CookieAuthenticationDefaults.AuthenticationScheme;
            //}).AddCookie("MyCookieAuthenticationScheme", options =>
            //{
            //     options.AccessDeniedPath = "/Account/Forbidden/";
            //    options.LoginPath = "/auth/signin";
            //});

            services.AddAuthentication("MyCookieAuthenticationScheme")
                .AddCookie("MyCookieAuthenticationScheme", options =>
                {
                    options.AccessDeniedPath = "/Account/Forbidden/";
                    options.LoginPath = "/auth/signin";
                });
            services.AddMemoryCache();
            services.AddSession();
          
            var users = new Dictionary<string, string> { { "sai@adevz.com", "password" }, { "sid@adevz.com", "password" } };
            services.AddSingleton<IUserService>(new UserService(users));
            services.AddMvc();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
                app.UseBrowserLink();
            }
            else
            {
                app.UseExceptionHandler("/Home/Error");
            }

            app.UseStaticFiles();
            app.UseAuthentication();
      
            app.UseMvc(routes =>
            {
                routes.MapRoute(
                    name: "default",
                    template: "{controller=Home}/{action=Index}/{id?}");
            });
        }
    }
}
