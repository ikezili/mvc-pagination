using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(MVCPagination.Startup))]
namespace MVCPagination
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
        }
    }
}
