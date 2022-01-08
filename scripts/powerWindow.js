


class PowerWindow {

    constructor () {

        this.name = 'powerWindow'
        this.div = document.querySelector('#powerWindow')
        this.tab = document.querySelector('#power.tab')
        this.grid = document.querySelector('#powerGrid')
        this.optionButtons = document.querySelectorAll('#powerWindow .optionBtn')
        this.questionBtn = document.querySelector('#powerWindow .question')
        this.overlayDiv = document.querySelector('#powerWindow .overlay')
        this.overlayP = document.querySelector('#powerWindow .overlayText')
        

        this.f = 'Standard'
        this.r = '0_15' // rankbracket for trends tab
        this.mode = 'brackets' // brackets, ranks, trends
        this.t_ladder = {Standard: 'last3Days', Wild: 'lastWeek'}
        this.t_ladder_old = {Standard: 'lastWeek', Wild: 'last2Weeks'}
        
        //if (PREMIUM) {this.t_ladder.Wild = 'lastWeek'}
        if (!PREMIUM) { this.t_ladder.Standard = 'lastDay'}
        this.t_table = 'last2Weeks'
        this.maxElementsPerRank = 5
        this.maxElementsPerBracket = (PREMIUM) ? 16 : 5
        this.minGames = 50
        
        this.overlayText = `
            This tab displays the best decks to be played in the respective rank brackets.<br><br>
            <span class='optionBtn'>Tier Lists</span> shows the top 16 decks across specific rank brackets ('All Ranks', 'Rank 1-5' etc.).<br><br>
            <span class='optionBtn'>Ranks</span> shows the top 5 decks for every single rank until rank 20.<br><br>
            <span class='optionBtn'>Trends</span> shows the trends in frequency and winrate of the last 3 days vs the last week<br><br>
            The winrates are calculated by using the deck frequencies of the last 3 days and the matchup table of the last 2 weeks.<br><br>
            If there are fewer than ${this.minGames} games in the respective category no data is displayed instead.<br><br>
            Click on a deck to get to it's deck list in the "Decks" tab.<br><br>        
        `

        this.rankData = {rankSums: {}, fullyLoaded: {}} // {Standard:[], Wild:[], rankSums: {Standard:[], Wild:[]}}
        for (let f of hsFormats) {
            this.rankData[f] = []
            for (let rank of range(0,hsRanks)) { this.rankData[f].push([]) }
            this.rankData.rankSums[f] = []
            this.rankData.fullyLoaded[f] = false
        }

        this.bracketData = {}
        this.rankBrackets = [
            {name:'All Ranks',  games:{}, start: 0, end: 15},
            {name:'L',          games:{}, start: 0, end: 0},
            {name:'1-4',        games:{}, start: 1, end: 4},
            {name:'5-15',       games:{}, start: 5, end: 15},
        ]
        
        this.trendSort_fr = 0 // sorting of columns in trending tab
        this.trendSort_wr = 0

        
        for (let f of hsFormats) {
            this.bracketData[f] = {}
            for (let bracket of this.rankBrackets) { 
                bracket.games[f] = 0
                this.bracketData[f][bracket.name] = [] 
        }}

        this.overlay = false
        this.addData(this.f,_=>{})
        this.setupUI()
        this.renderOptions()
    }// constructor


    setupUI() {
        for (let i=0;i<this.optionButtons.length;i++) { this.optionButtons[i].addEventListener("click", this.buttonTrigger.bind(this)) }
        let disp = (PREMIUM) ? 'inline':'none'
        document.querySelector('#powerWindow .content-header #brackets').style.display = disp
        document.querySelector('#powerWindow .content-header #trends').style.display = disp
        //this.questionBtn.addEventListener('click',this.toggleOverlay.bind(this))
        //this.overlayDiv.addEventListener('click',this.toggleOverlay.bind(this))

        let mouseOut = function(event) { 
            let e = event.toElement || event.relatedTarget;
            if (e.parentNode == this || e == this) { return }
            this.classList.add('hidden') 
        }

        this.questionBtn.onclick = this.toggleOverlay.bind(this)
        this.overlayDiv.onclick = this.toggleOverlay.bind(this)

        this.rankFolder = document.querySelector('#powerWindow #rankFolder')  
        let rankDropdownFolder = document.querySelector('#powerWindow #rankFolder .dropdown')
        rankDropdownFolder.onmouseout = mouseOut             

        for (var bracket of this.rankBrackets) {
            let btn = document.createElement('button')
            btn.className = 'optionBtn folderBtn'
            btn.innerHTML = bracket.name
            btn.id = bracket.start + '_' + bracket.end
            const trigger = function (e) { this.r = e.target.id; this.plot() }
            btn.onclick = trigger.bind(this)
            rankDropdownFolder.appendChild(btn)
        }
    }

    buttonTrigger(e) {

        var btnID = e.target.id

        if (btnID == 'Standard')    {this.f = 'Standard'}
        if (btnID == 'Wild')        {this.f = 'Wild'}

        if (btnID == 'ranks')       {this.mode = 'ranks'}
        if (btnID == 'brackets')    {this.mode = 'brackets'}
        if (btnID == 'trends')      {this.mode = 'trends'}
        
        this.plot()
        this.renderOptions()
    }// buttonTrigger

    pressButton(e) {
        if (app.ui.decksWindow == null) { return }
        let targetClass = e.target.className
        let targetID = e.target.id
        switch(targetID) {
            case 'wr':
                this.trendSort_wr = (this.trendSort_wr+1)%4
                this.plot()
                return
                break
            case 'd_wr':
                this.trendSort_wr = (this.trendSort_wr+1)%4
                this.plot()
                return
                break
            case 'fr':
                this.trendSort_fr = (this.trendSort_fr+1)%4
                this.plot()
                return
                break
            case 'd_fr':
                this.trendSort_fr = (this.trendSort_fr+1)%4
                this.plot()
                return
                break
        }
       

        app.path.hsFormat = this.f
        app.ui.deckLink(e.target.id) 
    }


    renderOptions() {
        for (var btn of this.optionButtons) { 
            btn.classList.remove('highlighted')

            if (btn.id == this.mode) {btn.classList.add('highlighted')}
            if (btn.id == this.f) {btn.classList.add('highlighted')}
        }
        this.rankFolder.style.display = (this.mode == 'trends') ? 'inline' : 'none'
    }




    addData (f,callback) {
        let ladderDataNew = app.ui.ladderWindow.data[f][this.t_ladder[f]]
        let ladderDataOld = app.ui.ladderWindow.data[f][this.t_ladder_old[f]]
        //let tableData1w = app.ui.tableWindow.data[f]['lastWeek']['ranks_all']
        let tableData = app.ui.tableWindow.data[f][this.t_table]['ranks_all']

        let ladderArchetypes = ladderDataNew.archetypes
        let tableArchetypes = tableData.archetypes
        let table = tableData.table
        let rankSums = app.ui.ladderWindow.data[f][this.t_ladder[f]].rankSums

        // Old archetypes:
        // difference stored in this.bracketData
        let ladderArchetypes_old = ladderDataOld.archetypes
        
        this.rankData.rankSums[f] = app.ui.ladderWindow.data[f][this.t_ladder[f]].rankSums
        for (let rank of range(0,hsRanks)) {
            for (let bracket of this.rankBrackets) {
                if (bracket.start <= rank && bracket.end >= rank) { bracket.games[f] += this.rankData.rankSums[f][rank] }
        }}

        for (let arch of ladderArchetypes) {

            let idx = tableArchetypes.indexOf(arch.name)
            if (idx == -1) { continue }

            let arch_old = false
            for (let a of ladderArchetypes_old) { // check if archetype existed before
                if (a.name == arch.name) { arch_old = a; continue }
            }

            
            for (let rank of range(0,hsRanks)) {

                let totFreq = 0
                let totWr = 0

                let totFreq_old = 0
                let totWr_old = 0

                for (let opp of ladderArchetypes) {

                    let idxOpp = tableArchetypes.indexOf(opp.name)
                    if (idxOpp == -1) { continue }

                    let freqOpp = opp.fr_ranks[rank]
                    let mu = table[idx][idxOpp]
                    totFreq += freqOpp
                    totWr += freqOpp * mu                
                }

                for (let opp of ladderArchetypes_old) {

                    if (!arch_old) { continue }
                    let idxOpp = tableArchetypes.indexOf(opp.name)
                    if (idxOpp == -1) { continue }

                    let freqOpp = opp.fr_ranks[rank]
                    let mu = table[idx][idxOpp]
                    totFreq_old += freqOpp
                    totWr_old += freqOpp * mu                
                }

                totWr = (totFreq > 0) ? totWr/totFreq : 0
                totWr_old = (totFreq_old > 0) ? totWr_old/totFreq_old : 0

                this.rankData[f][rank].push(
                    {   name:arch.name, 
                        wr:totWr, 
                        fr: arch.fr_ranks[rank],
                        color: arch.color, 
                        fontColor: arch.fontColor}
                    )
                // bracket data
                for (var bracket of this.rankBrackets) {
                    let data = this.bracketData[f][bracket.name]
                    if (rank == bracket.start) {data.push(
                        {   name: arch.name, 
                            wr: totWr, 
                            fr: arch.fr_ranks[rank],
                            wr_old: totWr_old,
                            fr_old: (arch_old) ? arch_old.fr_ranks[rank] : 0,  
                            color: arch.color, 
                            fontColor: arch.fontColor, 
                            count: (totWr>0)?1:0})
                        }

                    let data_last = data[data.length-1]
                    if (rank > bracket.start && rank <= bracket.end) { 
                        data_last.wr += totWr
                        data_last.fr += arch.fr_ranks[rank]
                        data_last.wr_old += totWr_old
                        data_last.fr_old += (arch_old) ? arch_old.fr_ranks[rank] : 0
                        data_last.count += (totWr>0)?1:0 }
                    if (rank == bracket.end && data_last.count > 0) { 
                        data_last.wr /= data_last.count
                        data_last.fr /= data_last.count
                        data_last.wr_old /= data_last.count
                        data_last.fr_old /= data_last.count
                        data_last.wr_d = data_last.wr - data_last.wr_old // wr difference
                        data_last.fr_d = data_last.fr - data_last.fr_old // fr difference
                    }
                }

            } // close for ranks
        } // close for arch


        let sortByWr = function (a,b) { return a.wr > b.wr ? -1 : a.wr < b.wr ? 1 : 0; }
        for (let rank of range(0,hsRanks)) { this.rankData[f][rank].sort(sortByWr) }
        for (let bracket of this.rankBrackets) { this.bracketData[f][bracket.name].sort(sortByWr)}
        this.rankData.fullyLoaded[f] = true
        if (callback != undefined) { return callback.apply(this) }
    } // close add Data



    checkLoadData(callback) {

        let back = (callback != undefined)

        if (this.rankData.fullyLoaded[this.f]) {
            // all loaded
            return (back) ?  callback.apply(this) : true
        }

        if (!app.ui.ladderWindow.data[this.f].fullyLoaded) {
            let callback2 = function() { app.ui.powerWindow.checkLoadData(callback) }
            if (back) { return app.ui.ladderWindow.loadData(this.f, callback2) }
            else { return false }
        }

        if (!app.ui.tableWindow.data[this.f].fullyLoaded) {
            let callback2 = function() { app.ui.powerWindow.checkLoadData(callback) }
            if (back) { return app.ui.tableWindow.loadData(this.f, callback2) }
            else { return false }       
        }

        if (app.ui.ladderWindow.data[this.f].fullyLoaded && app.ui.tableWindow.data[this.f].fullyLoaded) {
            this.addData(this.f, callback)   
        }
    }



    plot() {
        if (!this.checkLoadData()) { 
            this.renderOptions()
            return this.checkLoadData( _ => { app.ui.powerWindow.plot() }) 
        }
        this.renderOptions()
        if (this.mode == 'ranks') {this.plotRanks(this.f)}
        if (this.mode == 'brackets') {this.plotBrackets(this.f)}
        if (this.mode == 'trends') {this.plotTrends(this.f)}
    }

    display(bool) {
        if (bool) {
            this.div.style.display = 'inline-block'
            this.f = app.path.hsFormat
            this.plot()

        } else {
            this.div.style.display = 'none'
            app.path.hsFormat = this.f
        }
    }

    plotRanks (f) {

        while (this.grid.firstChild) {this.grid.removeChild(this.grid.firstChild);}
        
        let ranks = range(0,hsRanks)
        ranks[0] = 'L'
    
        let columnTemplate = '1fr '
        for (let i of range(0,this.maxElementsPerRank)) { columnTemplate += '4fr 1fr '}

        this.grid.style.gridTemplateColumns = columnTemplate
        this.grid.style.gridGap = '0.1rem'


        var div = document.createElement('div')
        div.className = 'header'
        div.innerHTML = 'Rank'
        this.grid.appendChild(div)



        //Header
        for (var i=0;i<this.maxElementsPerRank;i++) { 
            var div = document.createElement('div')
            div.className = 'header columnTitle'
            div.innerHTML = 'Top '+(i+1)
            this.grid.appendChild(div)
        }


        for (var i=0;i<hsRanks;i++) {

            var div = document.createElement('div')
            div.className = 'pivot'
            div.innerHTML = ranks[i]
            this.grid.appendChild(div)

            if (this.rankData.rankSums[f][i] < this.minGames) { 
                for (var j=0;j<this.maxElementsPerRank;j++) { 
                    var div = document.createElement('div')
                    div.className = 'blank'
                    this.grid.appendChild(div)
                    this.grid.appendChild(document.createElement('div')) 
                }
                continue
            }

            for (var j=0;j<this.maxElementsPerRank;j++) {
                var archName = this.rankData[f][i][j].name
                var wr = (100*this.rankData[f][i][j].wr).toFixed(1)+ '%'
                var color = this.rankData[f][i][j].color
                var fontColor = this.rankData[f][i][j].fontColor

                var div = document.createElement('div')
                var btn = document.createElement('button')
                var tooltip = document.createElement('span')
                
                tooltip.className = 'tooltipText'
                tooltip.innerHTML = 'R:'+(i)+' #'+(j+1)+' '+archName
                
                btn.className = 'archBtn tooltip'
                btn.id = archName
                btn.style.backgroundColor = color
                btn.style.color = fontColor
                btn.innerHTML = archName
                //btn.appendChild(tooltip)
                btn.onclick = this.pressButton.bind(this)

                div.classList.add('winrate')
                div.innerHTML = wr

                this.grid.appendChild(btn)
                this.grid.appendChild(div)
            }
        }
        //this.grid.innerHTML = gridHTML
    }// close plotRanks






    plotBrackets (f) {
    
        while (this.grid.firstChild) {this.grid.removeChild(this.grid.firstChild);}
        
        let ranks = range(0,hsRanks)
        ranks[0] = 'L'
    
        let columnTemplate = ''
        for (let b of this.rankBrackets) { columnTemplate += '4fr 1fr ' }

        this.grid.style.gridTemplateColumns = columnTemplate
        this.grid.style.gridGap = '0.3rem'

        //Header
        for (let bracket of this.rankBrackets) { 
            var div = document.createElement('div')
            div.className = 'header columnTitle'
            div.innerHTML = bracket.name
            this.grid.appendChild(div)
        }


        for (let i = 0; i < this.maxElementsPerBracket; i++ ) {

            for (let bracket of this.rankBrackets) {

                if (this.bracketData[f][bracket.name].length <= i) {continue}

                let arch = this.bracketData[f][bracket.name][i]

                if (bracket.games[f] <= this.minGames || arch == undefined) { 
                    let div = document.createElement('div')
                    div.className = 'blank'
                    this.grid.appendChild(div)
                    this.grid.appendChild(document.createElement('div'))
                    continue
                }
                

                let wr = (100*arch.wr).toFixed(1)+ '%'

                let div = document.createElement('div')
                let btn = document.createElement('button')
                let tooltip = document.createElement('span')

                


                tooltip.className = 'tooltipText'
                tooltip.innerHTML = '#'+(i+1)+' '+arch.name

                btn.className = 'archBtn tooltip'
                btn.id = arch.name
                btn.style.backgroundColor = arch.color
                btn.style.color = arch.fontColor
                btn.style.marginLeft = '0.5rem'
                btn.innerHTML = arch.name
                //btn.appendChild(tooltip)
                btn.onclick = this.pressButton.bind(this)

                div.className = 'winrate'
                div.innerHTML = wr

                this.grid.appendChild(btn)
                this.grid.appendChild(div)
            }
        }
    } // close plot Tiers

    
    plotTrends (f) {
    
        while (this.grid.firstChild) {this.grid.removeChild(this.grid.firstChild);}
        
        let bracket = this.rankBrackets[0].name
        
        let sortByWr = function (a,b) { return a.wr > b.wr ? -1 : a.wr < b.wr ? 1 : 0; }
        let sortByWrD = function (a,b) { return a.wr_d > b.wr_d ? -1 : a.wr_d < b.wr_d ? 1 : 0; }
        let sortByFr = function (a,b) { return a.fr > b.fr ? -1 : a.fr < b.fr ? 1 : 0; }
        let sortByFrD = function (a,b) { return a.fr_d > b.fr_d ? -1 : a.fr_d < b.fr_d ? 1 : 0; }

        let arch_wr = []
        let arch_fr = []
    
        let columnTemplate = '2fr 1fr 1fr 2fr 1fr 1fr'
        this.grid.style.gridTemplateColumns = columnTemplate
        this.grid.style.gridGap = '0.3rem'



        let grid = this.grid
        // MORE ELEGANT?
        let click_fr = ()=>{
            this.trendSort_fr = (this.trendSort_fr == 'fr_up') ? 'fr_down' : 'fr_up'
            this.plot()
        }
        let click_frD = ()=>{
            this.trendSort_fr = (this.trendSort_fr == 'frD_up') ? 'frD_down' : 'frD_up'
            this.plot()
        }
        let click_wr = ()=>{
            this.trendSort_wr = (this.trendSort_wr == 'wr_up') ? 'wr_down' : 'wr_up'
            this.plot()
        }
        let click_wrD = ()=>{
            this.trendSort_wr = (this.trendSort_wr == 'wrD_up') ? 'wrD_down' : 'wrD_up'
            this.plot()
        }



        let addToGrid = (name, id, isSortBtn, click)=>{
            let div = document.createElement('div')
            div.className = isSortBtn ? 'header sortBtn' : 'header'
            div.innerHTML = name
            div.id = id
            div.onclick = click
            grid.append(div)
        }

        addToGrid('Winrate')
        addToGrid('wr','wr',true,click_wr)
        addToGrid('d','d_wr',true,click_wrD)
        addToGrid('Frequency')
        addToGrid('fr','fr',true,click_fr)
        addToGrid('d','d_fr',true,click_frD)


        for (let arch of this.bracketData[f][bracket]) {
            arch_fr.push(arch)
            arch_wr.push(arch)
        }

        // Todo more elegant method
        switch(this.trendSort_fr) {
            case 'frD_up':
                arch_fr.sort(sortByFrD)
                break
            case 'frD_down':
                arch_fr.sort(sortByFrD).reverse()
                break
            case 'fr_up':
                arch_fr.sort(sortByFr)
                break
            case 'fr_down':
                arch_fr.sort(sortByFr).reverse()
                break
        }

        switch(this.trendSort_wr) {
            case 'wrD_up':
                arch_wr.sort(sortByWrD)
                break
            case 'wrD_down':
                arch_wr.sort(sortByWrD).reverse()
                break
            case 'wr_up':
                arch_wr.sort(sortByWr)
                break
            case 'wr_down':
                arch_wr.sort(sortByWr).reverse()
                break
        }

        for (let i in arch_wr) { //Math.max(arch_fr.length, arch_wr.length)) {
            for (let j in [arch_wr, arch_fr]) {
                let arch =  [arch_wr, arch_fr][j][i]
                let btn = document.createElement('button')
                btn.className = 'archBtn'
                btn.id = arch.name
                btn.style.backgroundColor = arch.color
                btn.style.color = arch.fontColor
                btn.style.marginLeft = '0.5rem'
                btn.innerHTML = arch.name
                btn.onclick = this.buttonTrigger.bind(this)

                let div1 = document.createElement('div')
                div1.classList.add('winrate')
                let div2 = document.createElement('div')
                div2.classList.add('winrate')

                if (j == 0) {
                    let d = (arch.wr_d > 0) ? '+':''
                    div1.innerHTML = (arch.wr*100).toFixed(1)+'%'
                    div2.innerHTML = d + (arch.wr_d*100).toFixed(2)+'%'
                    // add color
                }
                if (j == 1) {
                    let d = (arch.fr_d > 0) ? '+':''
                    div1.innerHTML = (arch.fr*100).toFixed(1)+'%'
                    div2.innerHTML = d + (arch.fr_d*100).toFixed(2)+'%'
                    // add color 
                }

                this.grid.appendChild(btn)
                this.grid.appendChild(div1)
                this.grid.appendChild(div2)

            }
        }

    } // close plot trends

    

    toggleOverlay() {
        if (this.overlay) {this.overlayDiv.style.display = 'none'; this.overlay = false}
        else{
            this.overlayP.innerHTML = this.overlayText
            this.overlayDiv.style.display = 'block'; 
            this.overlay = true}
    }
    

} // close PowerRanking class

