// initialize namespace
const footballStats = {};

footballStats.display = (dates, sortedMatches) => {
  return new Promise((resolve, reject) => {
    const matchTemplate = document.querySelector("[data-match-template]");
    const matchContainer = document.querySelector(".matches");
    const matchesWithElements = [];

    for (let i = 0; i < dates.length; i++) {
      const dateElement = matchTemplate.content.cloneNode(true).children[0];
      const matchHeader = dateElement.querySelector("[data-match-header]");
      matchHeader.textContent = dates[i].substring(4, 10);
      matchContainer.append(dateElement);

      const matchTable = dateElement.querySelector("[data-match-Table]");

      matchesWithElements[i] = sortedMatches[dates[i]].map((match) => {
        const matchBoxTemplate = document.querySelector("[data-match-box]");
        const matchDiv = matchBoxTemplate.content.cloneNode(true).children[0];

        // <<<<<< Team 1 flag + information starts here >>>>>>>>>

        const matchTeam1FlagImg = matchDiv.querySelector("[data-flag-team1]");
        matchTeam1FlagImg.src = match.team1.flag;
        const matchTeam1Info = matchDiv.querySelector("[data-team1-info]");
        matchTeam1Info.textContent = `${match.team1.name} ${match.team1.score.fullTime}`;

        // <<<<<< Team 2 flag + information starts here >>>>>>>>>

        const matchTeam2FlagImg = matchDiv.querySelector("[data-flag-team2]");
        matchTeam2FlagImg.src = match.team2.flag;
        const matchTeam2Info = matchDiv.querySelector("[data-team2-info]");
        matchTeam2Info.textContent = `${match.team2.name} ${match.team2.score.fullTime}`;

        // <<<<<<<<<<< More Info addition >>>>>>>>
        matchDiv.querySelector(
          "[data-competition-name]"
        ).textContent = `${match.competition.name}`;
        matchDiv.querySelector(
          "[data-competition-emblem]"
        ).src = `${match.competition.emblem}`;
        matchDiv.querySelector(
          "[data-match-date]"
        ).textContent = `${match.date}`;
        matchDiv.querySelector("[data-group]").textContent = `${match.group}`;
        matchDiv.querySelector("[data-stage]").textContent = `${(
          match.stage.charAt(0) + match.stage.slice(1).toLowerCase()
        ).replace("_", " ")}`;
        matchDiv.querySelector(
          "[data-match-day]"
        ).textContent = `${match.matchDay}`;
        matchDiv.querySelector("[data-status]").textContent = `${
          match.status.charAt(0) + match.status.slice(1).toLowerCase()
        }`;
        matchDiv.querySelector("[data-winner]").textContent = `${match.winner}`;

        // <<<<<<<< append >>>>>>>>>>>>>>
        matchTable.append(matchDiv);

        return { match: match, element: matchDiv };
      });
    }
    if (matchesWithElements) {
      resolve(matchesWithElements);
    } else {
      reject("data could not be loaded");
    }
  });
};

footballStats.convertDate = (utcDate) => {
  date = new Date(utcDate);
  return date.toDateString();
};

footballStats.getDates = (matches) => {
  const dates = [];
  footballStats.sortedByDateMatches = {};
  matches.forEach((match) => {
    dates.push(footballStats.convertDate(match.utcDate));
  });
  const uniqueDates = [...new Set(dates)];
  footballStats.uniqueDates = uniqueDates;
  return uniqueDates;
};

footballStats.getMatches = (matches) => {
  footballStats.matches = matches;
  const resultsArray = [];

  footballStats.matches.forEach((match) => {
    results = {
      team1: {
        name: match.awayTeam.name,
        flag: match.awayTeam.crest,
        score: {
          fullTime: match.score.fullTime.away,
          halfTime: match.score.halfTime.away,
        },
      },
      team2: {
        name: match.homeTeam.name,
        flag: match.homeTeam.crest,
        score: {
          fullTime: match.score.fullTime.home,
          halfTime: match.score.halfTime.home,
        },
      },
      date: footballStats.convertDate(match.utcDate),
      group: match.group,
      stage: match.stage,
      matchDay: match.matchday,
      competition: {
        name: match.competition.name,
        emblem: match.competition.emblem,
      },
      season: {
        seasonStart: match.season.startDate,
        seasonEnd: match.season.endDate,
        currentMatchDay: match.season.currentMatchday,
      },
      status: match.status,
    };

    if (match.score.winner == "HOME_TEAM") {
      winner = "homeTeam";
      results.winner = match[winner].name;
    } else if (match.score.winner == "AWAY_TEAM") {
      winner = "awayTeam";
      results.winner = match[winner].name;
    } else {
      results.winner = "Draw";
    }

    resultsArray.push(results);
  });
  return resultsArray;
};

footballStats.sortByDate = (dates, matches) => {
  sortedMatches = {};
  for (let i = 0; i < dates.length; i++) {
    dateArray = matches.filter((match) => match.date == dates[i]);
    sortedMatches[dates[i]] = dateArray;
  }

  return sortedMatches;
};

footballStats.getData = (url) => {
  footballStats.apiUrl = url;

  url = new URL(footballStats.apiUrl);
  url.search = new URLSearchParams({
    season: "2022",
    mode: "cors",
    cache: "default",
  });
  footballStats.apikey = footballStats.apikeys;
  return new Promise((resolve, reject) => {
    fetch(url, {
      method: "GET",
      headers: {
        "X-Auth-Token": footballStats.apikey,
      },
    })
      .then((res) => {
        return res.json();
      })
      .then((jsonData) => {
        if (jsonData) {
          resolve(jsonData);
        } else {
          reject("data could not be loaded");
        }
      });
  });
};
footballStats.eventListeners = (matchesWithElements) => {
  offBySearch = [
    ...Array(document.querySelectorAll(".date").length).fill(false),
  ];
  offBySearchMatches = [
    ...Array(document.querySelectorAll(".match").length).fill(false),
  ];
  const hideOtherMatches = (clickMatches, clickedMatch) => {
    clickMatches.forEach((match, i) => {
      if (match != clickedMatch && !offBySearchMatches[i]) {
        match.classList.toggle("hide");
      }
    });
  };

  const getVisibilityStatus = (dateDivs) => {
    dateDivsArray = [...dateDivs];
    dateDivsVisible = dateDivsArray.map((dateDiv) => {
      if (dateDiv.style.display == "none") {
        dateVisible = false;
      } else {
        dateVisible = true;
      }
      return { dateDiv: dateDiv, dateVisible: dateVisible };
    });

    return dateDivsVisible;
  };
  const hideOtherDates = (dateDivs, clickedMatch) => {
    dateDivs.forEach((dateDiv, i) => {
      matchDivs = [...dateDiv.children[1].children];
      matchFound = false;
      matchDivs.forEach((matchDiv) => {
        if (matchDiv == clickedMatch) {
          matchFound = true;
        }
      });
      if (!matchFound && !offBySearch[i]) {
        dateDiv.classList.toggle("hide");
      }
    });
  };
  // <<<<<<<<< search bar event listener >>>>>>>>>>>>>>
  const userInput = document.getElementById("search");
  userInput.addEventListener("input", (e) => {
    e.preventDefault();
    const value = e.target.value.toLowerCase();
    const arrayWithIsVisible = [];
    for (let i = 0; i < footballStats.dates.length; i++) {
      matchesWithIsVisible = matchesWithElements[i].map((matchWithElement) => {
        const isVisible =
          matchWithElement.match.team1.name.toLowerCase().includes(value) ||
          matchWithElement.match.team2.name.toLowerCase().includes(value);
        matchWithElement.element.classList.toggle("hide", !isVisible);
        if (!isVisible) {
          offBySearchMatches[i] = true;
        }

        return { matchWithElement: matchWithElement, isVisible: isVisible };
      });
      arrayWithIsVisible.push(matchesWithIsVisible);
    }
    const dateDivs = document.querySelectorAll(".date");
    arrayWithIsVisible.forEach((date, i) => {
      dateVisible = false;
      offBySearch[i] = true;
      date.forEach((match) => {
        if (match.isVisible) {
          dateVisible = true;
          offBySearch[i] = false;
        }
      });
      dateDivs[i].classList.toggle("hide", !dateVisible);
    });
  });
  // <<<<<<<<< clickable match event listener >>>>>>>>>>>>>>
  const clickMatches = document.querySelectorAll(".match");
  clickMatches.forEach((clickedMatch) => {
    clickedMatch.addEventListener("click", (e) => {
      e.preventDefault();
      clickedMatch.querySelector(".more-info").classList.toggle("hide");
      hideOtherMatches(clickMatches, clickedMatch);
      const dateDivs = document.querySelectorAll(".date");
      hideOtherDates(dateDivs, clickedMatch);
    });
  });
};

footballStats.init = async () => {
  try {
    const apiKeyName = "apiKey2";
    const response = await fetch(
      `https://worldcup-app.netlify.app/.netlify/functions/getApiKey?key=${apiKeyName}`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch API key");
    }

    const data = await response.json();
    const apiKey = data.apiKey;
    
    footballStats.apikeys = apiKey;
  } catch (error) {
    console.error(error);
  }

  footballStats
    .getData(
      `https://proxy.junocollege.com/https://api.football-data.org/v4/competitions/WC/matches`
    )
    .then((promisedData) => {
      footballStats.matchResultsArray = footballStats.getMatches(
        promisedData.matches
      );
      footballStats.dates = footballStats.getDates(promisedData.matches);
      footballStats.sortedMatches = footballStats.sortByDate(
        footballStats.dates,
        footballStats.matchResultsArray
      );
      document.querySelector(".load-wrapp").classList.add("hide");
      footballStats
        .display(footballStats.dates, footballStats.sortedMatches)
        .then((matchesWithElements) => {
          footballStats.eventListeners(matchesWithElements);
        })

        .catch((error) => {
          const errorElement = document.createElement("p");
          errorElement.textContent = `${error.message}. 60s before API is pinged again`;
          document.querySelector(".load-wrapp").classList.add("hide");
          document.querySelector(".standings").append(errorElement);
          setTimeout(footballStats.init, 60000);
        });
    });
};
footballStats.init();
