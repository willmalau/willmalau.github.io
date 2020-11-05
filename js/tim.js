const API_KEY = "a3d4497c15244df6b11981be8a893e68";
const BASE_URL = "https://api.football-data.org/v2/";

const fetchAPI = function(url) {
    return fetch(url, {
        headers: {
            'X-Auth-Token': API_KEY
        }
    })
        .then(res => {
            if (res.status !== 200) {
                console.log("Error: " + res.status);
                return Promise.reject(new Error(res.statusText))
            } else {
                return Promise.resolve(res)
            }
        })
        .then(res => res.json())
        .catch(err => {
            console.log(err)
        })
};

function getTeamById() {
    return new Promise(function (resolve, reject) {
    // Ambil nilai query parameter (?id=)
    var urlParams = new URLSearchParams(window.location.search);
    var idParam = urlParams.get("id");

    if ("caches" in window) {
        caches.match(`${BASE_URL}/teams/${idParam}`).then(function (response) {
        if (response) {
            response.json().then(data => {
            teamByIdComp(data)
            resolve(data)
            })
        }
        });
    }

    fetchAPI(`${BASE_URL}teams/${idParam}`)
        .then(status)
        .then(data => {
        teamByIdComp(data)
        resolve(data)
        })
    })
}

function getFavoriteTeams() {
    getAll().then(function (teams) {
    var teamsHTML = ""

    if (0 !== teams.length) {
        teams.forEach(function (team) {
        teamsHTML += `
            <div class="col s12 m4">
            <div class="card center-align" style="margin-top: 24px;">
                <div class="card-image" style="padding: 24px 24px 0;">
                <img
                    src="${team.crestUrl}"
                    height="200"
                    style="object-fit: contain"
                    onerror="this.onerror=null;this.src='/default.jpg';"
                    alt="logo ${team.name}"
                />
                </div>
                <div class="card-content">
                <a
                    class="card-title"
                    href="./team.html?id=${team.id}&favorited=true"
                >${team.name}</a>
                <div class="row">
                    <p class="col s12">Area</p>
                    <p class="col s12"><b>${team.area.name}</b></p>
                </div>
                <div class="row">
                    <p class="col s12">Nomor Telepon</p>
                    <p class="col s12"><b>${team.phone}</b></p>
                </div>
                <div class="row">
                    <p class="col s12">Website</p>
                    <a class="col s12" href="${team.website}" style="overflow-wrap: break-word;">${team.website}</a>
                </div>
                <div class="row">
                <a class="waves-effect waves-light btn-small" href="./index.html#favorit" onclick="removeFromFavorites(${team.id})">hapus dari favorit</a>
                </div>
                </div>
            </div>
            </div>
        `;
        })
    } else {
        teamsHTML = '<h5 class="text-center">Tidak ada tim yang anda favoritkan</h5>'
    }
    document.getElementById("favorite-teams").innerHTML = teamsHTML
})
}

function getFavoriteTeamById() {
    var urlParams = new URLSearchParams(window.location.search)
    var idParam = urlParams.get('id')

    getById(idParam).then(data => teamByIdComp(data))
}
function teamByIdComp(data) {
    // Objek JavaScript dari response.json() masuk lewat variabel data.
    let activeCompetitionsHTML = ''
    data.activeCompetitions.forEach(function (competition) {
    let tier = competition.plan.substr(5)
    activeCompetitionsHTML += `
        <tr>
        <td>${competition.area.name || '-'}</td>
        <td>${competition.name || '-'}</td>
        <td>${competition.code || '-'}</td>
        <td>${tier || '-'}</td>
        </tr>
    `;
    })

    let teamHTML = `
    <div class="row">
        <div class="col s12 l4">
        <div class="card center-align" style="margin-top: 24px;">
            <div class="card-image" style="padding: 24px; padding-bottom: 0px;">
            <img
                src="${data.crestUrl}"
                height="200"
                style="object-fit: contain"
                onerror="this.onerror=null;this.src='/default.jpg';"
            />
            </div>
            <div class="card-content">
            <p class="card-title">${data.name} (${data.shortName})</p>
            <div class="row">
                <p class="col s12">Area</p>
                <p class="col s12"><b>${data.area.name}</b></p>
            </div>
            <div class="row">
                <p class="col s12">Alamat</p>
                <p class="col s12"><b>${data.address}</b></p>
            </div>
            <div class="row">
                <p class="col s12">Nomor Telepon</p>
                <p class="col s12"><b>${data.phone}</b></p>
            </div>
            <div class="row">
                <p class="col s12">Email</p>
                <a class="col s12" href="mailto:${data.email}" style="overflow-wrap: break-word;">${data.email}</a>
            </div>
            <div class="row">
                <p class="col s12">Website</p>
                <a class="col s12" href="${data.website}" style="overflow-wrap: break-word;">${data.website}</a>
            </div>
            </div>
        </div>
        </div>
        <div class="col s12 l8">
        <div>
            <h4>Kompetisi Aktif</h4>
            <table class="striped centered responsive-table" style="margin-top: 20px">
            <thead>
                <tr>
                <th>Area</th>
                <th>Nama Kompetisi</th>
                <th>Code</th>
                <th>Posisi</th>
                </tr>
            </thead>
            <tbody>
                ${activeCompetitionsHTML}
            </tbody>
            </table>
        </div>
        </div>
    `;
    // Sisipkan komponen card ke dalam elemen dengan id #content
    document.getElementById("body-content").innerHTML = teamHTML;
}