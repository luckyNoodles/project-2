const fifaMatch = {};
fifaMatch.randomizeApiKey = (array) => {
    return array[Math.floor(Math.random()*array.length)]
}
// https://proxy-ugwolsldnq-uc.a.run.app/
// https://worldcup-app.netlify.app/.netlify/functions/api-proxy?url=https://api.football-data.org/v4/competitions/WC/matches

fifaMatch.getData = () => {
    const urls = [
        'https://proxy.junocollege.com/https://api.football-data.org/v4/competitions/WC/matches',
        'https://proxy.junocollege.com/https://api.football-data.org/v4/competitions/WC/teams',
        'https://proxy.junocollege.com/https://api.football-data.org/v4/competitions/WC/scorers'
    ];
    //header params
    urls.search = new URLSearchParams({
        season: '2022',
        cache: 'default'
    })
    fifaMatch.apikey = fifaMatch.apikeys
    
    const teamsAndPlayers = urls.map(url => {
        return fetch(url, {
            method: 'GET',
            headers: {
                'X-Auth-Token': fifaMatch.apikey,
            },
        })
            .then((res) => {
                return res.json();
            })
            .then((resData) => {
                console.log(resData)
                document.querySelector('.load-wrapp').classList.add('hide')
                return resData;
            })
        } // End of getSchedule/Fetch
    
    )

    Promise.all(teamsAndPlayers)
            .then((teamData => { //opens access through the promise wrapper
              fifaMatch.displayTeams(teamData);
              fifaMatch.getAllPlayers(teamData);
              fifaMatch.displayTopScorers(teamData);
              console.log(teamData);
            }
            ))
}

fifaMatch.getAllPlayers = function(teamData) {
    const teamArray = teamData[1].teams;
    let allPlayers = [];
    for(let i = 0; i < teamArray.length; i++) {
        allPlayers.push(teamArray[i].squad);
    }

    mergedList = allPlayers.flat(1);

    fifaMatch.displayAllPlayers(teamArray);
    fifaMatch.searchPlayers(mergedList);
} 

fifaMatch.searchPlayers = (mergedList) => {
    const theList = mergedList;
    // console.log(theList);

    const textToSearch = document.querySelector('form');
    // console.log(textToSearch);
    textToSearch.addEventListener('submit', (event) => {
        event.preventDefault();
        const input = document.querySelector('input');
        const value = input.value;
        // console.log(value);
        const responseList = [];

        for(let i = 0; i < theList.length; i++) {
            const player = theList[i].name.toLowerCase();

            if(player.includes(value)) {
                // console.log(player);
                responseList.push(theList[i]);
            } 
            
        }
        fifaMatch.searchDisplay(responseList)
    })
}

fifaMatch.searchDisplay = (responseList) => {
    const container = document.querySelector('.wc-flexBox');
    container.innerHTML = "";
    const inputList = responseList;

    inputList.forEach(squadList => {
    //container for athlete profile
        const athleteContainer = document.createElement('div');
        athleteContainer.classList.add('athleteBox');
        container.appendChild(athleteContainer);
    //display the athlete profile
        const playerInfo = document.createElement('div');
        playerInfo.classList.add('player');
        athleteContainer.appendChild(playerInfo);
    //display the name, position, birthdate
        const date = new Date(squadList.dateOfBirth);
        const bornOn = date.toLocaleString('default', { month: 'short', day: 'numeric', year: 'numeric' });
        const profileText = document.createElement('p');
    // playerText.classList.add('profile');
        profileText.innerText = 
            `Player : ${squadList.name}
             Country : ${squadList.nationality}            
             Position : ${squadList.position}
             Date Of Birth : ${bornOn}
            `;
        playerInfo.appendChild(profileText);

        })
}

fifaMatch.displayTeams = function(teamData) {
    // console.log(teamData);
    const squadData = teamData[1];
    const teamObject = teamData[1].teams;
    
    for (let i = 0; i <teamObject.length; i++) {

        const teamContainer = document.createElement('div');
        teamContainer.classList.add('teamBox');

        const teamDiv = document.createElement('div');
        teamDiv.classList.add('team');
        teamContainer.appendChild(teamDiv); //append team1 div to matches div

        const imageTeamDiv = document.createElement('div');
        imageTeamDiv.classList.add('img-box')
        imageTeamDiv.setAttribute("data-index",[i]);
        teamDiv.appendChild(imageTeamDiv); //append image div into away team div

        const teamFlag = document.createElement('img');
        teamFlag.src = teamObject[i].crest;
        teamFlag.alt = 'team flag';
        imageTeamDiv.appendChild(teamFlag); //append team1 flag to team1 div

        const teamInfoBox = document.createElement('div');
        teamInfoBox.classList.add('teamInfo');
        teamInfoBox.setAttribute("data-index",[i]);
        teamDiv.appendChild(teamInfoBox);

        const countryName = document.createElement('p');
        countryName.innerText = 
            `${teamObject[i].name}
            Team Founded : ${teamObject[i].founded}
            Website : ${teamObject[i].website}`;
        teamInfoBox.appendChild(countryName);
        
        document.querySelector('.main-container').appendChild(teamContainer); //Appends the team container to the page
    }
    fifaMatch.getTeamIndex(squadData);
}

fifaMatch.getSquad = (arrayIndex, squadData) => {
    console.log(squadData);
    const container = document.querySelector('.main-container');
    container.innerHTML = "";

    const buttonBox = document.createElement('div');
    buttonBox.classList.add('refreshBox');
    container.appendChild(buttonBox);

    const refresh = document.createElement('button');
    refresh.innerText = "< Back to teams"
    refresh.setAttribute("type", "button")
    refresh.setAttribute("value", " Back to teams")
    refresh.setAttribute("onClick", "window.location.reload()")
    buttonBox.appendChild(refresh);

    const squadIndex = arrayIndex;
    const squadObject = squadData;
    const squadList = squadObject.teams[squadIndex].squad;
    // console.log(squadList);

    for (let i = 0; i < squadList.length; i++) {
        
        //container for athlete profile
        const athleteContainer = document.createElement('div');
        athleteContainer.classList.add('athleteBox');
        container.appendChild(athleteContainer);

        const imageTeamDiv = document.createElement('div');
        imageTeamDiv.classList.add('img-box');
        athleteContainer.appendChild(imageTeamDiv); 

        const teamCrest = squadObject.teams[squadIndex].crest;
        const teamFlag = document.createElement('img');
        teamFlag.src = teamCrest;
        teamFlag.alt = 'team flag';
        imageTeamDiv.appendChild(teamFlag); 

        //display the athlete profile
        const playerInfo = document.createElement('div');
        playerInfo.classList.add('player');
        athleteContainer.appendChild(playerInfo);
        
        //display the name, position, birthdate
        const date = new Date(squadList[i].dateOfBirth);
        const bornOn = date.toLocaleString('default', { month: 'short', day: 'numeric', year: 'numeric' });
        const profileText = document.createElement('p');
        // playerText.classList.add('profile');
        profileText.innerText = 
            `Player : ${squadList[i].name}
             Position : ${squadList[i].position}
             Date Of Birth : ${bornOn}
            `;
        playerInfo.appendChild(profileText);
    }

}

fifaMatch.displayAllPlayers = (teamArray) => {
    const container = document.querySelector('.scorer-container');
    container.innerHTML = "";
    const allArray = teamArray;

    for (let i = 0; i < 25; i++) {
   
        const teamIndex = Math.floor(Math.random() * allArray.length);
        const team = allArray[teamIndex];
        const flag = team.crest;
        const country = team.name;
        const playerIndex = Math.floor(Math.random() * team.squad.length);
        const player = team.squad[playerIndex];

            //container for athlete profile
        const allTab = document.querySelector('.wc-flexBox');
        
        const playerBox = document.createElement('div');
        playerBox.classList.add('playerBox');
        allTab.appendChild(playerBox);
        
        const imageTeamDiv = document.createElement('div');
        imageTeamDiv.classList.add('img-box');
        playerBox.appendChild(imageTeamDiv); 

        const teamCrest = flag; //stopped here
        const teamFlag = document.createElement('img');
        teamFlag.src = teamCrest;
        teamFlag.alt = 'team flag';
        imageTeamDiv.appendChild(teamFlag); 

        //display the athlete profile
        const playerInfo = document.createElement('div');
        playerInfo.classList.add('player');
        playerBox.appendChild(playerInfo);
        
        //display the name, position, birthdate
        const date = new Date(player.dateOfBirth);
        const bornOn = date.toLocaleString('default', { month: 'short', day: 'numeric', year: 'numeric' });
        const profileText = document.createElement('p');
        // playerText.classList.add('profile');
        profileText.innerText = 
            `Country : ${country}
                Player : ${player.name}
                Position : ${player.position}
                Date Of Birth : ${bornOn}
            `;
        playerInfo.appendChild(profileText);
    }
}

fifaMatch.displayTopScorers = (teamData) => {
    console.log("This is teamData function");

    const container = document.querySelector('.scorer-container');
    container.innerHTML = "";

    const topArray = teamData[2];
    console.log(topArray);
    const scoreArray = topArray.scorers;
    const topTab = document.getElementById('top-scorers');
    const topContainer = document.createElement('div');
    topTab.appendChild(topContainer);

    scoreArray.forEach(stats => {
        
         //container for athlete profile
        const athleteContainer = document.createElement('div');
        athleteContainer.classList.add('statsBox');
        topContainer.appendChild(athleteContainer);

        const imageTeamDiv = document.createElement('div');
        imageTeamDiv.classList.add('img-box');
        athleteContainer.appendChild(imageTeamDiv); 

        const teamCrest = stats.team.crest;
        const teamFlag = document.createElement('img');
        teamFlag.src = teamCrest;
        teamFlag.alt = 'team flag';
        imageTeamDiv.appendChild(teamFlag); 

         //display the athlete profile
        const playerInfo = document.createElement('div');
        playerInfo.classList.add('player');
        athleteContainer.appendChild(playerInfo);

        //display the name, position, birthdate
        const date = new Date(stats.player.dateOfBirth);
        const bornOn = date.toLocaleString('default', { month: 'short', day: 'numeric', year: 'numeric' });
        const profileText = document.createElement('p');
        
        profileText.innerText = 
            `Country : ${stats.team.name}
             Player : ${stats.player.name}
             Position : ${stats.player.position}
             Date Of Birth : ${bornOn}
            `;
        playerInfo.appendChild(profileText);

        const cellDiv = document.createElement('div');
        cellDiv.classList.add('cellDiv');
        athleteContainer.appendChild(cellDiv);

        const goalDiv = document.createElement('div')
        goalDiv.classList.add('statsCell');
        cellDiv.appendChild(goalDiv);
        goalDiv.innerText = `Goals: ${stats.goals}`;

        const assistsDiv = document.createElement('div')
        assistsDiv.classList.add('statsCell');
        cellDiv.appendChild(assistsDiv);
        assistsDiv.innerText = `Assists: ${(stats.assists === null ? '0' : stats.assists)}`;

        const penaltyDiv = document.createElement('div')
        penaltyDiv.classList.add('statsCell');
        cellDiv.appendChild(penaltyDiv);
        penaltyDiv.innerText = `Penalties: ${(stats.penalties === null ? '0' : stats.penalties)}`;
    })
}

fifaMatch.getTeamIndex = (squadData) => {
    const teamIndex = document.querySelectorAll('.teamInfo, .img-box');

    teamIndex.forEach(teamIndex => {
        teamIndex.addEventListener('click', (e) => {
            const arrayIndex = teamIndex.getAttribute('data-index');

            fifaMatch.getSquad(arrayIndex, squadData);
        })
    })
}

const tabs = document.querySelectorAll('[data-tab-target]')
const tabContents = document.querySelectorAll('[data-tab-content]')

tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        const target = document.querySelector(tab.dataset.tabTarget)
       
        tabContents.forEach(tabContent => {
        tabContent.classList.remove('active')
        })
        tabs.forEach(tab => {
        tab.classList.remove('active')
        })
        tab.classList.add('active')
        target.classList.add('active')
    })
})

fifaMatch.init = async () => {
   
    try {
      const apiKeyName = "apiKey1";
      const response = await fetch(
        `https://worldcup-app.netlify.app/.netlify/functions/getApiKey?key=${apiKeyName}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch API key");
      }

      const data = await response.json();
      const apiKey = data.apiKey;
      console.log(`API Key: ${apiKey}`);
      // You can return apiKey here if needed

      footballStats.apikeys = apiKey; // Assign apiKey to footballStats.apikeys
    } catch (error) {
      console.error(error);
    }

    fifaMatch.getData();
   
}; //end of init function

fifaMatch.init();


