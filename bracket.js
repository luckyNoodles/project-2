// initialize namespace
const footballStats = {};
// initialize apikey
footballStats.apikey = '70a843e5cf86426b9a1a9528ec8a7da7';

footballStats.display = (dates, sortedMatches, stage) => {
    return new Promise((resolve, reject) => {
    
        const matchTemplate = document.querySelector("[data-match-template]")
        const matchContainer = document.querySelector(`.${stage}`)
        const matchesWithElements = []

        for (let i=0; i<dates.length; i++){
            
            const dateElement = matchTemplate.content.cloneNode(true).children[0]
            const matchHeader = dateElement.querySelector("[data-match-header]")
            matchHeader.textContent = dates[i].substring(4,10)
            matchContainer.append(dateElement)
            
            const matchTable = dateElement.querySelector("[data-match-Table]")
            
            matchesWithElements[i] = sortedMatches[dates[i]].map(match => {
                const matchBoxTemplate = document.querySelector('[data-match-box]')
                const matchDiv = matchBoxTemplate.content.cloneNode(true).children[0]

                // <<<<<< Team 1 flag + information starts here >>>>>>>>>
   
               const matchTeam1FlagImg = matchDiv.querySelector('[data-flag-team1]')
               matchTeam1FlagImg.src = match.team1.flag 
               const matchTeam1Info = matchDiv.querySelector('[data-team1-info]')
               matchTeam1Info.textContent = `${match.team1.name} ${match.team1.score.fullTime}`
   
               // <<<<<< Team 2 flag + information starts here >>>>>>>>>
   
               const matchTeam2FlagImg = matchDiv.querySelector('[data-flag-team2]')
               matchTeam2FlagImg.src = match.team2.flag
               const matchTeam2Info = matchDiv.querySelector('[data-team2-info]')
               matchTeam2Info.textContent = `${match.team2.name} ${match.team2.score.fullTime}`
   
               // <<<<<< Winner >>>>>>>>>>>>>>>
            //    const winnerDiv = matchDiv.querySelector('[data-winner]')
            //    winnerDiv.textContent = `Winner : ${match.winner}`
               // <<<<<<<<<<< More Info addition >>>>>>>>
            //    matchDiv.querySelector('[data-competition-name]').textContent = `${match.competition.name}`
            //    matchDiv.querySelector('[data-competition-emblem]').src = `${match.competition.emblem}`
            //    matchDiv.querySelector('[data-match-date]').textContent = `Date: ${match.date}`
            //    matchDiv.querySelector('[data-group]').textContent = `Group: ${match.group}`
            //    matchDiv.querySelector('[data-stage]').textContent = `Stage: ${match.stage}`
            //    matchDiv.querySelector('[data-match-day]').textContent = `Match day:${match.matchDay}`
            //    matchDiv.querySelector('[data-status]').textContent = `Status: ${match.status}`
            //    matchDiv.querySelector('[data-winner]').textContent = `Winner: ${match.winner}`
               



        
               // <<<<<<<< append >>>>>>>>>>>>>>
               matchTable.append(matchDiv)
               

               return {match:match, element:matchDiv}
            })


        }
        if (matchesWithElements){
            console.log('we got resolve')
            resolve(matchesWithElements)
        }else{
            reject('data could not be loaded')
        }
    }) 
    
}

footballStats.convertDate = (utcDate) => {
    date = new Date(utcDate)
    return date.toDateString()
}

footballStats.getDates = (matches) => {
    const dates = []
    footballStats.sortedByDateMatches = {}
    matches.forEach(match => {
        date = new Date(match.utcDate)
        dates.push(date.toDateString())
        // footballStats.sortedByDateMatches.date = {team1:match.awayTeam.name, team2:match.homeTeam.name, date:date.toDateString()};
    })
    const uniqueDates = [...new Set(dates)]
    footballStats.uniqueDates = uniqueDates
    return uniqueDates
}


footballStats.sortByDate = (dates, matches) => {
    sortedMatches = {}
    for(let i = 0; i < dates.length; i++) {
        dateArray = matches.filter(match => match.date == dates[i])
        sortedMatches[dates[i]] = dateArray
        console.log('here sorted matches for', dates[i], sortedMatches[dates[i]])
    }
    console.log('here is sorted matches were returning as a whole:', sortedMatches)
    return sortedMatches 
}

footballStats.getMatches = (matches) => {
    const resultsArray = []
  
    matches.forEach(match => {
        results = {
             team1: {name:match.awayTeam.name, flag:match.awayTeam.crest, score:{fullTime: match.score.fullTime.away, halfTime:match.score.halfTime.away}}, 
             team2: {name:match.homeTeam.name, flag:match.homeTeam.crest, score:{fullTime:match.score.fullTime.home, halfTime:match.score.halfTime.home}}, 
             date: footballStats.convertDate(match.utcDate),
             group: match.group,
             stage: match.stage,
             matchDay:match.matchday,
             competition: {name: match.competition.name, emblem:match.competition.emblem},
             season:{seasonStart: match.season.startDate, seasonEnd: match.season.endDate, currentMatchDay:match.season.currentMatchday},
             status:match.status
         }


        if(match.score.winner == 'HOME_TEAM'){
            winner = 'homeTeam'
            results.winner = match[winner].name
        }
        else if (match.score.winner == 'AWAY_TEAM'){
            winner = 'awayTeam' 
            results.winner = match[winner].name
        }
        else{
            results.winner = "Draw"
        }
        
    
        resultsArray.push(results) 
    });
    return resultsArray
}

footballStats.getStageMatches = async (stage) => {
    const resObj = await fetch(`https://proxy-ugwolsldnq-uc.a.run.app/https://api.football-data.org/v4/competitions/WC/matches?stage=${stage}`, { method:'GET',
     headers: {
         'X-Auth-Token':footballStats.apikey
        }
    })
    console.log('fetch result is', resObj)

    const jsonData = await resObj.json()
    console.log('json result is:', jsonData)
    return jsonData
    
}
footballStats.eventListeners = (activeSlide, sideSlides) => {
    const buttons = document.querySelectorAll('button')
    buttons.forEach(button => {
        button.addEventListener('click', e =>{
            const slides = document.querySelectorAll('.slide')
            oldActiveIndex = [...slides].indexOf(activeSlide)
            indexArray = [...sideSlides].map((sideSlide) =>{
                return [...slides].indexOf(sideSlide)
            })

            indexArray.splice(1, 0, oldActiveIndex)
            console.log('this is the index array',indexArray)
            if (button.dataset.carouselButton == 'next'){
                shift = 1
            }else{
                shift = -1
            }
            newIndexArray = indexArray.map(index => {
                if (index + shift > slides.length){
                    return 0

                }else if(index + shift < 0){
                    return slides.length -1 
                }else{
                    return index + shift
                }
            })
            console.log('this is the new index array', newIndexArray)
            // indexArray.forEach(index=>{
            //     if (index == (newIndexArray.length - 1)/2){
            //         delete slides[index].dataset.active
            //         console.log('deleted data-active off of:', slides[index]) 
            //     }else{
            //         slides[index].classList.remove('side')
            //         console.log('removed side') 
            //     }
            // })
            if (shift == 1){
                slides[indexArray[0]].classList.remove('side')
                slides[indexArray[0]].classList.add('hide')
            }else if(shift == -1){
                slides[indexArray[indexArray.length -1]].classList.remove('side')
                slides[indexArray[indexArray.length -1]].classList.add('hide')
            }
            
            newIndexArray.forEach(index => {
                // if (index == (newIndexArray.length - 1)/2){
                //     slides[index].dataset.active = true
                // }else{
                //     slides[index].classList.add('side')   
                // }
                console.log('class list is',[...slides[index].classList])
                const classes = [...slides[index].classList]
                console.log('hide?', classes.indexOf('hide',))
                console.log('side?', classes.indexOf('side',))
                console.log('active?', slides[index].dataset.active)
                if (classes.indexOf('hide') != -1){
                    slides[index].classList.remove('hide')
                    slides[index].classList.add('side')
                }else if(classes.indexOf('side') != -1){
                    slides[index].classList.remove('side')
                    slides[index].dataset.active = true
                }else if(slides[index].dataset.active){
                    delete slides[index].dataset.active
                    slides[index].classList.add('side')
                }

                // classes.forEach(class => {
                //     console.log(class)

                // })


            })
            
            activeSlide = document.querySelector('[data-active]')
            console.log('active slide is', activeSlide)
            sideSlides = document.querySelectorAll('.side')
            console.log('these are the side slides', sideSlides)
            // let newIndex = [...slides].indexOf(activeSlide) + shift
            // if (newIndex < 0){
            //     newIndex = slides.length - 1 
            // }else if(newIndex >= slides.length){
            //     newIndex = 0
            // }
            // prevSideIndex = newIndex - 1
            // nextSideIndex = newIndex + 1
            // slides[newIndex].classList.remove('side')
            // slides[newIndex].dataset.active = true
            // delete activeSlide.dataset.active 
            // slides[oldIndex].classList.add('hide')
        })
    })
}

footballStats.init = () =>{
    stages = ['GROUP_STAGE', 'LAST_16','QUARTER_FINALS', 'SEMI_FINALS','BRONZE', 'FINAL']
    nextStep = async () => {
        stagesMatches = []
        // for (i=0;i<stages.length;i++){
        //     console.log('this is before await')
        //     matches = await footballStats.getStageMatches(stages[i])
        //     stageMatches = {stage:stages[i], matches:matches}
        //     console.log('this comes after await', stageMatches)
        //     stagesMatches.push(stageMatches)
        // }

        // console.log('stagesMatch array after the loop',stagesMatches)
        // uniqueDatesOfStages = {}
        // matches = {}
        // stagesMatches.forEach(stageMatches => {
        //     uniqueDatesOfStages[stageMatches.stage] = footballStats.getDates(stageMatches.matches.matches)
        //     matches[stageMatches.stage] = footballStats.getMatches(stageMatches.matches.matches)
        // })
        // console.log('unique dates:', uniqueDatesOfStages)
        // console.log('matches:', matches)

        // footballStats.sortedMatchesforStages = {}
        // for (i in stages){
        //     console.log('stage is:', stages[i])
        //     // console.log('sorted matches for stage', stages[i],footballStats.sortByDate(uniqueDatesOfStages[stages[i]], matches[stages[i]]))
        //     footballStats.sortedMatchesforStages[stages[i]] = footballStats.sortByDate(uniqueDatesOfStages[stages[i]], matches[stages[i]])
        //     console.log('sorted matches for', stages[i] , footballStats.sortedMatchesforStages[stages[i]])
        // }

        // stagesClassNames = ['group-stage', 'round16', 'quarter-finals', 'semi-finals','bronze','final']
        // stagesClassNames.forEach((stageClassName,i) => {
        //     footballStats.display(uniqueDatesOfStages[stages[i]], footballStats.sortedMatchesforStages[stages[i]], stageClassName)
        // })
        const activeSlide = document.querySelector('[data-active]')
        console.log('active slide is', activeSlide)
        const sideSlides = document.querySelectorAll('.side')
        console.log('these are the side slides', sideSlides)


        footballStats.eventListeners(activeSlide, sideSlides)

    }

    nextStep(stages)
        


}
    
    
footballStats.init();