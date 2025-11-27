using Microsoft.AspNetCore.Mvc;
using NetSalesTrack.Models;

namespace NetSalesTrack.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CountriesController : ControllerBase
{
    private static readonly List<Country> Countries =
    [
        new Country { Id = 1, Name = "United States", Code = "US" },
        new Country { Id = 2, Name = "Canada", Code = "CA" },
        new Country { Id = 3, Name = "United Kingdom", Code = "GB" },
        new Country { Id = 4, Name = "Germany", Code = "DE" },
        new Country { Id = 5, Name = "France", Code = "FR" },
        new Country { Id = 6, Name = "Japan", Code = "JP" },
        new Country { Id = 7, Name = "Australia", Code = "AU" },
        new Country { Id = 8, Name = "Brazil", Code = "BR" },
        new Country { Id = 9, Name = "India", Code = "IN" },
        new Country { Id = 10, Name = "China", Code = "CN" }
    ];

    [HttpGet]
    public ActionResult<IEnumerable<Country>> GetCountries()
    {
        return Ok(Countries);
    }
}
