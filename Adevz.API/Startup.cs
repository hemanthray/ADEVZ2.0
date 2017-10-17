using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Adevz.API.Services;
using Microsoft.AspNetCore.Authentication.Cookies;

namespace Adevz.API
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
            var users = new Dictionary<string, string>
            {
                { "sai", "password" }, { "siddarth", "password" }
            };
            services.ConfigureApplicationCookie(options => options.LoginPath = "/auth/signin");
            services.AddAuthentication("MyCookieAuthenticationScheme")
                .AddCookie("MyCookieAuthenticationScheme", options => {
                 options.AccessDeniedPath = "/Account/Forbidden/";
                      options.LoginPath = "/auth/signin";
                         });
            var svc = new UserService(users);
            services.AddSingleton<IUserService>(svc);

            services.AddMvc();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            //app.UseCookieAuthentication(new CookieAuthenticationOptions
            //{
            //    LoginPath = new Microsoft.AspNetCore.Http.PathString("/auth/signin")
            //});
            app.UseStaticFiles();
            app.UseStatusCodePages(); //To return correct status codes instead of empty page
            app.UseAuthentication();
            //app.UseIdentity();
            app.UseSession();

            app.UseMvc(routes =>
            {
                routes.MapRoute(
                    name: "default",
                    template: "{controller=Auth}/{action=SignIn}/{id?}");
            });
        }
    }
}
