document.addEventListener("DOMContentLoaded", () => {
  // Activate sidebar nav
  const elems = document.querySelectorAll(".sidenav");
  M.Sidenav.init(elems);
  loadNav();
  
  function loadNav() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function(){
      if (this.readyState === 4) {
        if (this.status != 200) return;

        // Muat daftar tautan menu
        document.querySelectorAll(".topnav, .sidenav").forEach((elm) => {
          elm.innerHTML = xhttp.responseText;
        });

        // Daftarkan event listener untuk setiap tautan menu
        document.querySelectorAll(".sidenav a, .topnav a").forEach((elm) => {
        elm.addEventListener("click", (event) => {
          // Tutup sidenav
          const sidenav = document.querySelector(".sidenav");
          M.Sidenav.getInstance(sidenav).close();

          // Muat konten halaman yang dipanggil
          page = event.target.getAttribute("href").substr(1);
          loadPage(page);
        });
      });
      }
    };
    xhttp.open("GET", "nav.html", true);
    xhttp.send();
  }

  
  // Load page content
let page = window.location.hash.substr(1);
if (page == "") page = "home";
loadPage(page);


function loadPage(page) {
  const xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState === 4) {
      let content = document.querySelector("#body-content");
      if(page == "favorit"){
        getFavoriteTeams();
      }
      if (this.status === 200) {
        content.innerHTML = xhttp.responseText;
      } else if (this.status === 404) {
        content.innerHTML = "<p>Page Not Found</p>";
      } else {
        content.innerHTML = "<p>Can't Access The Page</p>";
      }
    }
  };
  xhttp.open("GET", "pages/" + page + ".html", true);
  xhttp.send();
}
});