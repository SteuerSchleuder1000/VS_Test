



class DecksWindow {

    constructor (callback) {

        this.hsFormats = hsFormats

        //this.sidebarLeft = document.querySelector('#decksWindow .content .sidebar.left .archetypeList')
        //this.sidebarRight1 = document.querySelector('#decksWindow .content .sidebar.right .archetypeList')
        this.div = document.querySelector('#decksWindow')
        this.tab = document.querySelector('#decks.tab')
        this.chartDiv = document.querySelector('#decksWindow .content .chart')
        this.descriptionBox = document.querySelector('#decksWindow .content .descriptionBox')
        this.decksDiv = document.querySelector('#decksWindow .content .decklists')
        this.description = document.querySelector('#decksWindow .content .descriptionBox .description')
        this.overlayDiv = document.querySelector('#decksWindow .overlay')
        this.overlayP = document.querySelector('#decksWindow .overlayText')
        this.questionBtn = document.querySelector('#decksWindow .question')

        this.subWindows = [this.descriptionBox, this.decksDiv ,this.chartDiv] // depending on mode

        let sb1 = document.querySelector('#decksWindow .content .sidebar.left')
        let sb2 = document.querySelector('#decksWindow .content .sidebar.right1')
        let sb3 = document.querySelector('#decksWindow .content .sidebar.right2')

        this.sidebarLeft = new Sidebar(sb1,'Archetypes')
        this.sidebarRightTop = new Sidebar(sb2,'Best vs')
        this.sidebarRightBot = new Sidebar(sb3,'Worst vs')


        this.overlayText = `
            Select <span class='optionBtn'>Description</span> to see the latest report on that class.
            Select <span class='optionBtn'>Deck Lists</span> to see the latest deck lists on that class.<br><br>
            Select any archetype on the left side to see all the decklists of that archetype.<br><br>
            Hover over the deck title to copy or get more information on that decklist.<br><br>
            <img src='Images/clickOnDeckTitle.png'><br><br>
            Tips:<br><br>
            • When you hover over a card of a decklist it highlights all cards with the same name in the other decklists.<br><br>
        `



        this.firebasePath = 'deckData'

        this.archButtons = []
        this.optionButtons = document.querySelectorAll('#decksWindow .optionBtn')
        for (let oBtn of this.optionButtons) { oBtn.addEventListener("click", this.buttonTrigger.bind(this)) }



        // Defaults
        this.f = 'Standard'
        this.hsClass = 'Druid'
        this.hsArch = null
        this.mode = 'description' // decklists, description, overview
        this.deckWidth = '12rem'
        this.fullyLoaded = true
        this.overlay = false
        this.table_time = table_times[0]
        this.table_rank = table_ranks[0]

        this.mu = {}
        this.data = {}
        this.decklists = []
        this.archetypes = {}
        
        for (let f of this.hsFormats) {
            this.data[f] = { fullyLoaded: false }
            this.archetypes[f] = []
            this.mu[f] = { table: {}, archNames: {}, fr: {}, wr: {}, fullyLoaded: false }
            for (let hsClass of hsClasses) {
                this.data[f][hsClass] = {}
                this.data[f][hsClass].archetypes = []
                this.data[f][hsClass].text = ''
        }}

        this.setupUI()
        this.renderOptions()
        this.questionBtn.addEventListener('click',this.toggleOverlay.bind(this))
        this.overlayDiv.addEventListener('click',this.toggleOverlay.bind(this))

        callback.apply(this)
    }// close constructor

    setupUI() {
        this.dropdownFolders = {
            format: document.querySelector('#decksWindow .content-header #formatFolder .dropdown'),
            class: document.querySelector('#decksWindow .content-header #classFolder .dropdown'),
        }

        let mouseOut = function(event) { 
            let e = event.toElement || event.relatedTarget;
            if (e.parentNode == this || e == this) { return }
            this.classList.add('hidden') 
        }

        for (let key in this.dropdownFolders) { 
            let folder = this.dropdownFolders[key]
            folder.onmouseout = mouseOut
        }
    }


    plot() { 
        if (!this.checkLoadData()) { return this.checkLoadData(_=>{ app.ui.decksWindow.plot() }) }
        this.loadFormat(this.f) 
        this.renderOptions()
    }


    display(bool) {
        if (bool) {
            console.log('first display')
            this.div.style.display = 'inline-block'
            this.f = app.path.hsFormat
            this.plot()
        } else {
            app.path.hsFormat = this.f
            this.div.style.display = 'none'
        }
    }






    

    buttonTrigger(e) {
        
        var btnID = e.target.id

        if (btnID == 'Standard' || btnID == 'Wild') { this.f = btnID; this.plot() }

        if (e.target.classList.contains('archBtn')) { 
            this.hsArch = this.findArch(btnID)
            if (this.hsArch != undefined) {
                if (this.hsClass != this.hsArch.hsClass) { 
                    this.hsClass = this.hsArch.hsClass
                    this.loadClass(this.hsClass) 
                }
                else { this.loadDecklists() }
            }

            else { console.log('ERROR: archbtn not found', e) }
        }

        if (hsClasses.indexOf(btnID) != -1) {
            this.hsArch = null
            this.loadClass(btnID)
        }        

        if (btnID == 'overview')    { this.plotDustWr() }
        if (btnID == 'decklists')   { this.loadDecklists() }
        if (btnID == 'description') { this.loadDescription() }
        
        this.renderWindows()
        this.renderOptions()   
    }




    renderWindows() {
        for (let w of this.subWindows) { w.style.display = 'none'}
        switch(this.mode) {
            case 'description':
                this.descriptionBox.style.display = 'inline'
                break;
            case 'decklists':
                this.decksDiv.style.display = 'grid'
                break;
            case 'overview':
                this.chartDiv.style.display = 'inline-block'
                break;
        }
    }

    renderOptions() {
         for (var btn of this.optionButtons) { 
            btn.classList.remove('highlighted')
            if (btn.id == this.mode) {btn.classList.add('highlighted')}
        }
        
        for (var btn of this.archButtons) { 
            btn.classList.remove('highlighted')
            if (this.hsArch != null) { if (btn.id == this.hsArch.name) {btn.classList.add('highlighted')} }
        }

        document.querySelector("#decksWindow #formatBtn").innerHTML =   btnIdToText[this.f]
        document.querySelector("#decksWindow #classBtn").innerHTML =    this.hsClass
    }






    // Load DATA

    checkLoadData(callback) {

        let back = (callback != undefined)
        console.log('checkLoadData',back,callback)

        if (!app.ui.tableWindow.data[this.f].fullyLoaded) {
            console.log('check 1')
            let callback2 = function() { app.ui.decksWindow.checkLoadData(callback) }
            if (back) { return app.ui.tableWindow.loadData(this.f, callback2)}
            else { return false }
        }

        if (app.ui.tableWindow.data[this.f].fullyLoaded && !this.mu[this.f].fullyLoaded) { this.loadWinrate() }

        if (!this.data[this.f].fullyLoaded) {
            console.log('check 2')
            let callback2 = function() { app.ui.decksWindow.checkLoadData(callback) }
            if (back) { return this.loadData(this.f, callback2)}
            else { return false }
        }

        if (this.data[this.f].fullyLoaded && app.ui.tableWindow.data[this.f].fullyLoaded) {
            console.log('all checks clear')
            if (back) { return callback.apply(this) }
            else { return true }
        }
    }

    loadWinrate() {
        let tw = app.ui.tableWindow.data[this.f][this.table_time][this.table_rank]
        if (tw == null) { console.log('ERROR table undefined'); return }
        
        this.mu[this.f].table =      tw.table
        this.mu[this.f].archNames =  tw.freqPlotData.x[0]
        this.mu[this.f].fr =         tw.freqPlotData.y[0]
        this.mu[this.f].wr =         tw.winrates
        this.mu[this.f].fullyLoaded = true
    }


    loadData(hsFormat,callback) {
        this.fullyLoaded = false
        let ref = app.fb_db.ref(this.firebasePath+'/'+hsFormat)
        let reader = function (DATA) { this.readData(DATA,hsFormat,callback) }
        ref.on('value', reader.bind(this), e => console.log('Could not load Deck Data',e))
    } 


    readData(DATA,hsFormat,callback) {
        if (this.fullyLoaded) {return}
        let data = DATA.val()
        let f = hsFormat

        for (let hsClass of hsClasses) {
            this.data[f][hsClass].text = data[hsClass].text
            if (!('archetypes' in data[hsClass])) { continue }
            let keys = Object.keys(data[hsClass].archetypes)
            for (let key of keys) {

                let wr = 0
                let fr = 0
                let mu_idx = this.mu[f].archNames.indexOf(key)
                if (mu_idx >= 0) {wr = this.mu[f].wr[mu_idx]; fr = this.mu[f].fr[mu_idx]}

                let archetype = { name:key, hsClass:hsClass, hsFormat:f,  decklists:[], wr: wr, fr: fr, }
                this.archetypes[f].push(archetype)
                this.data[f][hsClass].archetypes.push(archetype)


                let idx = this.data[f][hsClass].archetypes.length -1

                let arch = data[hsClass].archetypes[key]
                let deckKeys = Object.keys(arch)
                for (let deckKey of deckKeys) {
                    let decklist  = new Decklist(arch[deckKey], hsClass, this)
                    this.data[f][hsClass].archetypes[idx].decklists.push(decklist)
        }}}
        this.fullyLoaded = true
        this.data[f].fullyLoaded = true
        console.log('decks loaded: '+ (performance.now()-t0).toFixed(2)+' ms')
        callback.apply(this)
    }// add Data



    
   

   

     deckLink(archName, hsFormat = 'Standard') {

        this.mode = 'decklists'
        this.f = hsFormat

        if (!this.checkLoadData()) {
            let callback = function() { app.ui.decksWindow.deckLink(archName,hsFormat) }
            return this.checkLoadData( _=>{ app.ui.decksWindow.deckLink(archName,hsFormat) } )
        }

        let hsClass, hsArch
        this.hsArch = this.findArch(archName)
        if (this.hsArch == undefined) {
            for (let c of hsClasses) { if (archName.indexOf(c) != -1) { this.hsClass = c; break } }
            if (this.hsClass == undefined) { this.hsClass = 'Druid' }
            this.hsArch = this.data[this.f][this.hsClass].archetypes[0]
        }

        for (var c of hsClasses) {
            if (archName.indexOf(c) != -1) {hsClass = c}
            let archetypes = this.data[hsFormat][c].archetypes
            for (let a of archetypes) { if (a.name == archName) { hsClass = c; hsArch = a; break } } 
        }
        
        if (hsClass == undefined) { hsClass = 'Druid'}
        if (hsArch == undefined)  { hsArch = null; this.mode = 'description' }
        
        this.hsClass = hsClass
        this.hsArch = hsArch

        this.display(true)
        this.renderOptions()
    }


    loadFormat(hsFormat) { 
        this.f = hsFormat; 
        if (!this.data[hsFormat].fullyLoaded) {
            let callback = function() { app.ui.decksWindow.loadFormat(hsFormat) }
            this.loadData(hsFormat,callback)
        }
        this.loadClass(this.hsClass) }


    loadClass(hsClass) {

        this.hsClass = hsClass

        if (this.mode == 'description') {this.loadDescription()}
        if (this.mode == 'decklists') {this.loadDecklists()}

        let data = this.data[this.f][this.hsClass]
        this.sidebarLeft.loadClass(data)
        if (data.archetypes.length > 0 && this.hsArch == null) { this.hsArch = data.archetypes[0] }
        this.sidebarLeft.highlight(this.hsArch.name)
    }



    loadDescription() {

        this.mode = 'description'
        this.renderWindows()

        var d = this.data[this.f][this.hsClass]
        this.description.innerHTML = '<p class="title">'+this.hsClass+'</p><p class="text">'+d.text+'</p>'
        //this.addDescription(this.hsClass,d.text)
    }

    // addDescription(title,text) {
    //     this.description.innerHTML = '<p class="title">'+title+'</p><p class="text">'+text+'</p>'
    // }



    loadDecklists() {
        this.mode = 'decklists'
        this.renderWindows()
        this.decklists = []

        this.decksDiv.innerHTML = ''

        if (this.hsArch == null) { this.hsArch = this.data[this.f][this.hsClass].archetypes[0]}
        if (this.hsArch == undefined) { this.hsArch = null; return}
        
        var deckCards = []
        var gridTemplateColumns = ''
        for (var dl of this.hsArch.decklists) {
            
            gridTemplateColumns += this.deckWidth + ' '
            this.decklists.push(dl)
            this.decksDiv.appendChild(dl.div)
        }
        
        this.decksDiv.style.gridTemplateColumns = gridTemplateColumns
        this.loadDecklistsMatchups(this.hsArch) // load deck list matchups
    } 


    findArch(archName) {
        for (let hsClass of hsClasses) {
            for (let a of this.data[this.f][hsClass].archetypes) {
                if (a.name == archName) { return a }
        }}
        return undefined
    }


    loadDecklistsMatchups(hsArch) { // load deck matchups in right sidebar
        let f = this.f
        let wr = hsArch.wr
        let top = 3
        let topArch = []
        let botArch = []

        if (wr > 0) { // normal
            let table = this.mu[f].table
            let archNames = this.mu[f].archNames
            let idx = archNames.indexOf(hsArch.name)
            if (idx == -1) { hsArch.wr = 0; this.loadDecklistsMatchups(hsArch); return }

            let row = table[idx].slice()
            row.sort()
            top = Math.min(top,row.length)

            for (let t of range(0,top)) {
                let mu = row[row.length-1-t]
                let idx2 = table[idx].indexOf(mu)
                topArch.push(archNames[idx2])

                mu = row[t]
                idx2 = table[idx].indexOf(mu)
                botArch.push(archNames[idx2])
            }

            this.sidebarRightTop.removeBtn()
            this.sidebarRightBot.removeBtn()

            // add to sidebar
            for (let archName of topArch) {
                if (archName == null) { continue }
                let arch = this.findArch(archName)
                this.sidebarRightTop.addArchBtn(arch)
            }

            for (let archName of botArch) {
                if (archName == null) { continue }
                let arch = this.findArch(archName)
                this.sidebarRightBot.addArchBtn(arch)
            }
        } 
    }

    highlight(e) {

        var eType = e.type
        if (eType == 'mouseover') {
            var cardName = e.target.id
            var decklistName = e.target.parentElement.parentElement.id
            for (var dl of this.decklists) {
                if (dl.name == decklistName) {continue}
                dl.highlight(cardName)
            }
        } else {
            var decklistName = e.target.parentElement.parentElement.id
            for (var dl of this.decklists) { 
                if (dl.name == decklistName) {continue}
                dl.highlight(cardName) }
        }        
    }



    plotDustWr() {

        this.mode = 'overview'
        this.renderWindows()
          
        let archetypes = this.archetypes[this.f]

        let traces = []
        let x = []
        let y = []
        let labels = []
        let minCost = 30*1600
        let maxCost = 0

        for (let a of archetypes) {
            if (a.wr == 0) { continue }
            for (let dl of a.decklists) {
                if (dl.dust < minCost) {minCost = dl.dust}
                if (dl.dust > maxCost) {maxCost = dl.dust}
                traces.push({
                    x: [dl.dust],
                    y: [a.wr],
                    text: `<b>${dl.name}</b><br>Winrate: ${(a.wr*100).toFixed(2)}%<br>Dust Cost: ${dl.dust}`,
                    hoverinfo: 'text',
                    name: dl.name,
                    mode: 'markers',
                    type: 'scatter',
                    marker: {
                        color: hsColors[a.hsClass],
                        size: 15,
                        line: { color: '#3e3e3e80', width: 3},
                    }
                })
            }
        }
        console.log('traces:',traces)

        let layout_line = { color: 'rgba(50,50,50,0.5)', width: 1.5, dash: 'dot', opacity: 0.5 }
        let layout = {
            showlegend: false,
            hovermode: 'closest',
            displayModeBar: false,
            autosize: true,
            margin: MOBILE ? {l:10,r:10,b:35,t:0,} : {l:60,r:30,b:50,t:0,},
            plot_bgcolor: 'transparent',
            paper_bgcolor: 'transparent',
            xaxis: {
                title: 'Dust Cost',
                range: [minCost*0.9,maxCost*1.1],
            },
            yaxis: {
                tickformat: ',.0%',
                title: 'Winrate',
            },
            shapes: [{ type: 'line', x0: minCost, y0: 0.5, x1: maxCost, y1: 0.5, line: layout_line}],
            margin: {r:0,t:0},

        }
        Plotly.newPlot('chart3', traces, layout);
        let clickHandler = function (e) {
            console.log('clickHandler:',e)
            let p = e.points[0]
            let name = p.data.name
            console.log(name)
        }
        document.getElementById('chart3').on('plotly_click', clickHandler.bind(this))
    }// plot dust vs wr




    loadOverviewSidebar() {

    }


    toggleOverlay() {
        if (this.overlay) {this.overlayDiv.style.display = 'none'; this.overlay = false}
        else{
            this.overlayP.innerHTML = this.overlayText
            this.overlayDiv.style.display = 'block'; 
            this.overlay = true}
    }


} // close Decks










