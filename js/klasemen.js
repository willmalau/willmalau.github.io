const API_KEY = "a3d4497c15244df6b11981be8a893e68";
const BASE_URL = "https://api.football-data.org/v2/";

const urlParams = new URLSearchParams(window.location.search);
const idParam = urlParams.get("liga");
let LEAGUE_ID;

if(idParam === "LL"){
    LEAGUE_ID = 2014;
}else if(idParam === "PL"){
    LEAGUE_ID = 2021;
}else if(idParam === "BL"){
    LEAGUE_ID = 2002;
}


const ENDPOINT_COMPETITION = `${BASE_URL}competitions/${LEAGUE_ID}/standings`;

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

function getAllStandings() {
    if ("caches" in window) {
        caches.match(ENDPOINT_COMPETITION).then(function (response) {
            if (response) {
                response.json().then(function (data) {
                    console.log("Competition Data: " + data);
                    showStanding(data);
                })
            }
        })
    }

    fetchAPI(ENDPOINT_COMPETITION)
        .then(data => {
            showStanding(data);
        })
        .catch(error => {
            console.log(error)
        })
}

function showStanding(data) {
    let standings = "";
    let standingElement =  document.getElementById("content");

    data.standings[0].table.forEach(function (standing) {
        standings += `
                <tr>
                    <td><img src="${standing.team.crestUrl.replace(/^http:\/\//i, 'https://')}" width="30px" alt="badge"/></td>
                    <td><a href="team.html?id=${standing.team.id}" class="team">
                    ${standing.team.name}
                    </a></td>
                    <td class="text-center">${standing.playedGames}</td>
                    <td class="text-center">${standing.won}</td>
                    <td class="text-center">${standing.draw}</td>
                    <td class="text-center">${standing.lost}</td>
                    <td class="text-center">${standing.points}</td>
                </tr>
        `;
    });

    standingElement.innerHTML = `
                <div class="card" style="padding-left: 24px; padding-right: 24px; margin-top: 30px;">
                <table class="striped responsive-table">
                    <thead>
                        <tr>
                            <th></th>
                            <th>Nama Tim</th>
                            <th class="text-center">Main</th>
                            <th class="text-center">Menang</th>
                            <th class="text-center">Seri</th>
                            <th class="text-center">Kalah</th>
                            <th class="text-center">Poin</th>
                        </tr>
                    </thead>
                    <tbody id="standings">
                        ${standings}
                    </tbody>
                </table>
                
                </div>
    `;
}