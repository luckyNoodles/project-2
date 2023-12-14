// initialize namespace
const footballStats = {};

footballStats.display = (dates, sortedMatches, stage) => {
  return new Promise((resolve, reject) => {
    const matchTemplate = document.querySelector("[data-match-template]");
    const matchContainer = document.querySelector(`.${stage}`);
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
    date = new Date(match.utcDate);
    dates.push(date.toDateString());
  });
  const uniqueDates = [...new Set(dates)];
  footballStats.uniqueDates = uniqueDates;
  return uniqueDates;
};

footballStats.sortByDate = (dates, matches) => {
  sortedMatches = {};
  for (let i = 0; i < dates.length; i++) {
    dateArray = matches.filter((match) => match.date == dates[i]);
    sortedMatches[dates[i]] = dateArray;
  }
  return sortedMatches;
};

footballStats.getMatches = (matches) => {
  const resultsArray = [];

  matches.forEach((match) => {
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

footballStats.getStageMatches = async (stage) => {
  footballStats.apikey = footballStats.apikeys;
  try {
    const resObj = await fetch(
      `https://proxy.junocollege.com/https://api.football-data.org/v4/competitions/WC/matches?stage=${stage}`,
      {
        method: "GET",
        headers: {
          "X-Auth-Token": footballStats.apikey,
        },
      }
    );

    const jsonData = await resObj.json();
    return jsonData;
  } catch (error) {
    const errorElement = document.createElement("p");
    errorElement.textContent = `${error.message}. 60s before API is pinged again`;
    document.querySelector(".load-wrapp").classList.add("hide");
    document.querySelector(".standings").append(errorElement);
    setTimeout(footballStats.init, 60000);
  }
};
footballStats.eventListeners = () => {
  const buttons = document.querySelectorAll("button");
  const slides = document.querySelectorAll(".slide");
  const activeSlide = document.querySelector("[data-active]");
  const sideSlides = document.querySelectorAll(".side");
  const clickIndexArray = [];
  oldActiveIndex = [...slides].indexOf(activeSlide);
  indexArray = [...sideSlides].map((sideSlide) => {
    return [...slides].indexOf(sideSlide);
  });
  indexArray.splice(1, 0, oldActiveIndex);
  clickIndexArray.push(indexArray);
  buttons.forEach((button) => {
    button.addEventListener("click", (e) => {
      if (button.dataset.carouselButton == "next") {
        shift = 1;
      } else {
        shift = -1;
      }

      if (shift == 1) {
        slides[clickIndexArray[clickIndexArray.length - 1][0]].classList.remove(
          "side"
        );
        slides[clickIndexArray[clickIndexArray.length - 1][0]].classList.add(
          "hide"
        );
      } else if (shift == -1) {
        slides[
          clickIndexArray[clickIndexArray.length - 1][
            clickIndexArray[clickIndexArray.length - 1].length - 1
          ]
        ].classList.remove("side");
        slides[
          clickIndexArray[clickIndexArray.length - 1][
            clickIndexArray[clickIndexArray.length - 1].length - 1
          ]
        ].classList.add("hide");
      }

      newIndexArray = clickIndexArray[clickIndexArray.length - 1].map(
        (index) => {
          if (index + shift >= slides.length) {
            return 0;
          } else if (index + shift < 0) {
            return slides.length - 1;
          } else {
            return index + shift;
          }
        }
      );
      clickIndexArray.push(newIndexArray);

      newIndexArray.forEach((index) => {
        const classes = [...slides[index].classList];

        if (classes.indexOf("hide") != -1) {
          slides[index].classList.remove("hide");
          slides[index].classList.add("side");
        } else if (classes.indexOf("side") != -1) {
          slides[index].classList.remove("side");
          slides[index].dataset.active = true;
        } else if (slides[index].dataset.active) {
          delete slides[index].dataset.active;
          slides[index].classList.add("side");
        }
      });
      if (newIndexArray[1] == 5) {
        document
          .querySelector(".carousel")
          .insertBefore(
            document.querySelector(".bronze"),
            document.querySelector(".group-stage")
          );
      }
      if (newIndexArray[1] == 0) {
        document
          .querySelector(".carousel")
          .insertBefore(
            document.querySelector(".final"),
            document.querySelector(".round16")
          );
      }
    });
  });
};

footballStats.init = async () => {
  stages = [
    "GROUP_STAGE",
    "LAST_16",
    "QUARTER_FINALS",
    "SEMI_FINALS",
    "THIRD_PLACE",
    "FINAL",
  ];

  try {
    const apiKeyName = "apiKey5";
    const response = await fetch(
      `https://worldcup-app.netlify.app/.netlify/functions/getApiKey?key=${apiKeyName}`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch API key");
    }

    const data = await response.json();
    const apiKey = data.apiKey;
    console.log(`API Key: ${apiKey}`);

    footballStats.apikeys = apiKey;
  } catch (error) {
    console.error(error);
  }

  asyncNextStep = async () => {
    stagesMatches = [];
    for (i = 0; i < stages.length; i++) {
      matches = await footballStats.getStageMatches(stages[i]);
      stageMatches = { stage: stages[i], matches: matches };
      stagesMatches.push(stageMatches);
    }

    uniqueDatesOfStages = {};
    matches = {};
    stagesMatches.forEach((stageMatches) => {
      uniqueDatesOfStages[stageMatches.stage] = footballStats.getDates(
        stageMatches.matches.matches
      );
      matches[stageMatches.stage] = footballStats.getMatches(
        stageMatches.matches.matches
      );
    });

    footballStats.sortedMatchesforStages = {};
    for (i in stages) {
      footballStats.sortedMatchesforStages[stages[i]] =
        footballStats.sortByDate(
          uniqueDatesOfStages[stages[i]],
          matches[stages[i]]
        );
    }

    stagesClassNames = [
      "group-stage",
      "round16",
      "quarter-finals",
      "semi-finals",
      "bronze",
      "final",
    ];
    stagesClassNames.forEach((stageClassName, i) => {
      document.querySelector(".load-wrapp").classList.add("hide");
      footballStats.display(
        uniqueDatesOfStages[stages[i]],
        footballStats.sortedMatchesforStages[stages[i]],
        stageClassName
      );
    });
    
    footballStats.eventListeners();
  };

  asyncNextStep(stages);
};

footballStats.init();
