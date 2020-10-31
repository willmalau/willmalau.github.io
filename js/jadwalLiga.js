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


const ENDPOINT_COMPETITION = `${BASE_URL}competitions/${LEAGUE_ID}/matches?status=SCHEDULED`;

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

function getAllMatchs() {
    if ("caches" in window) {
        caches.match(ENDPOINT_COMPETITION).then(function (response) {
            if (response) {
                response.json().then(function (data) {
                    console.log("Competition Data: " + data);
                    showMatch(data);
                })
            }
        })
    }

    fetchAPI(ENDPOINT_COMPETITION)
        .then(data => {
            showMatch(data);
        })
        .catch(error => {
            console.log(error)
        })
}

function showMatch(data) {
    let matchs = "";
    let matchElement =  document.getElementById("content");

    data.matches.forEach(function (match) {
        matchs += `
                    <div class="col s12 m4">
                        <div class="card text-center">
                            <p class="match">${match.homeTeam.name}<br>VS<br>${match.awayTeam.name}<br>${match.utcDate}</p>
                        </div>
                    </div>
        `;
    });

    matchElement.innerHTML = `
                <div class="card" style="padding-left: 24px; padding-right: 24px; margin-top: 30px;">
                <h4 class="title text-center">Jadwal Pertandingan</h4>            
                    <div class="row">
                            ${matchs}
                        </div>
                    </div>
                
    `;
}