



class UI {

    constructor () {

        this.tabs = document.querySelectorAll('.tabs button.tab');
        this.mobileBtns = document.querySelectorAll('button.mobileBtn');
        this.windowTabs = document.querySelectorAll('.tabWindow');
        this.folderButtons = document.querySelectorAll('.folder-toggle');
        this.loader = document.getElementById('loader')
        this.logo = document.querySelector('#vsLogoDiv')
        this.overlayText = document.querySelector('#overlay .overlayText')
        this.updateTimeDiv = document.querySelector('#updateTime')
        this.mobileTab = document.querySelector('.navbar .mobileTabs .tab')
        
        for (let w of this.windowTabs) { w.style.display = 'none' }
        this.windowTabs[0].style.display = 'inline-block'


        this.getWindowSize()

        this.tabIdx = 0
        this.openFolder = null
        this.overlay = false
        
        this.decksWindow = null
        this.tableWindow = null
        this.ladderWindow = null
        this.powerWindow = null
        this.infoWindow = null

        this.windowNames = ['ladderWindow', 'powerWindow', 'tableWindow', 'decksWindow', 'infoWindow']

        this.maxColors = 5
        this.archetypeColors = {} 
        for (let f of hsFormats) { 
            this.archetypeColors[f] = {}
            for (let c of hsClasses) { this.archetypeColors[f][c] = {count:0, hsClass: c, idx: -1} }
        }

        // { Standard: { 
        //      Druid: { count: 0}, 
        //      Archname1: colorIdx1,
        //      Archname2: colorIdx1,
        //      ...
        //   Wild: ...}

        for(var tab of this.tabs) { tab.addEventListener("click", this.toggleTabs.bind(this)) }
        for(var fBtn of this.folderButtons) { fBtn.addEventListener("click", this.toggleDropDown.bind(this)) }


        if (MOBILE) {
            for(var mBtn of this.mobileBtns) { mBtn.addEventListener("click", this.mobileMenu.bind(this)) }
            detectswipe('.navbar .mobileTabs .tab',this.swipeTab.bind(this))
            let swipeLeft = function() { this.swipeTab(0,'l') }
            this.mobileTab.onclick = swipeLeft.bind(this)
            this.hideLoader()
        }


        this.logo.addEventListener('click', this.toggleOverlay.bind(this))
        document.querySelector('#overlay').addEventListener('click', this.toggleOverlay.bind(this))
        window.addEventListener('orientationchange', this.getWindowSize.bind(this));
        window.addEventListener('resize', this.getWindowSize.bind(this))

        let year = (new Date()).getFullYear()
        let copyright = 'Copyright (vS) Vicious Syndicate Gaming - www.ViciousSyndicate.com - © 2016-'+year+'. All rights reserved.'
        document.querySelector('#ladderWindow .content-footer').innerHTML = copyright
        document.querySelector('#powerWindow .content-footer').innerHTML = copyright
        document.querySelector('#tableWindow .content-footer').innerHTML = copyright
        document.querySelector('#decksWindow .content-footer').innerHTML = copyright
        document.querySelector('#infoWindow .content-footer').innerHTML = copyright


        this.toggleOverlay()
        this.updateTime()
    } // constructor

    

    toggleTabs (e) {
        if (app.phase == 0) { return }
        if (e.target != app.path.window.tab) { this.display(e.target.id+'Window') }
    }


    display(windowName) {
        console.log('load',windowName)
        if (this[windowName] == app.path.window) { return }
        if (app.path.window != null) { app.path.window.display(false) }
        app.path.window = this[windowName]
        app.path.window.display(true)
        this.renderTabs()
    }

    deckLink(arch) {
        app.path.arch = arch
        console.log('Decklink',arch)
        if (app.path.window != null) { app.path.window.display(false) }
        app.path.window = this.decksWindow
        this.decksWindow.deckLink(arch)
        this.renderTabs()
    }

    renderTabs() {
        for (var tab of this.tabs) { tab.classList.remove('highlighted') }
        app.path.window.tab.classList.add('highlighted')

        // if (MOBILE && tab.classList.contains('highlighted')) {tab.style.display = 'inline'}
        // if (MOBILE && !tab.classList.contains('highlighted')) {tab.style.display = 'none'}
    }
    
    getWindowSize() {
        this.width = parseInt(Math.max(document.documentElement.clientWidth, window.innerWidth || 0))
        this.height = Math.max(document.documentElement.clientHeight, window.innerHeight || 0)
        if (MOBILE) {
            if (this.height/this.width >= 1) {MOBILE = 'portrait'}
            else {MOBILE = 'landscape'}
        }
    }

    getWindows() { return [this.ladderWindow, this.powerWindow, this.tableWindow, this.decksWindow, this.infoWindow] }


    swipeTab(e,d) {
        console.log('swipte',e,d)
        if (d == 'r') {
            this.tabIdx -= 1
            if (this.tabIdx < 0) {this.tabIdx = this.windowNames.length -1}
        }
        if (d == 'l') {
            this.tabIdx += 1
            if (this.tabIdx >= this.windowNames.length) {this.tabIdx = 0}
        }

        this.mobileTab.innerHTML = this.windowNames[this.tabIdx]
        this.display(this.windowNames[this.tabIdx])

        //this.activeTab = this.tabs[this.tabIdx]
        //this.activeWindow = document.getElementById(this.activeTab.id+'Window')
        //this.renderTabs()
        //this.renderWindows()
    }

    updateTime() { 
        let d = new Date()
        let minutes = d.getMinutes()
        if (minutes < 10) { minutes = '0' + minutes}
        this.updateTimeDiv.innerHTML =  d.getHours() + ':' + minutes
    }


    toggleDropDown(e) {
        
        var nextSibling = e.target.nextElementSibling 
        var count = 0
        while (nextSibling != null) { if (nextSibling.classList.contains('dropdown') || count > 10) {break}; count += 1; nextSibling = nextSibling.nextElementSibling }
        if (nextSibling == null) {return}
        
        if (nextSibling == this.openFolder) {this.openFolder = null}
        else if (this.openFolder != null) {
            this.openFolder.classList.toggle('hidden');
            this.openFolder = nextSibling
        }

        nextSibling.classList.toggle('hidden')
    }

    mobileMenu(e) {
        console.log('mobile menu')
        var btn = e.target
        for (var tab of this.tabs) {
            if (tab.id == btn.id) {
                this.activeTab = tab
                this.activeWindow = document.getElementById(tab.id+'Window')
                this.renderTabs()
                this.renderWindows()
            }
        }       
    }

    

    showLoader() { this.loader.style.display = 'block'}
    hideLoader() { this.loader.style.display = 'none' }

    toggleOverlay() {
        this.overlayText.innerHTML = PREMIUM ?  overlayText2 : overlayText1
        if (this.overlay) {document.getElementById("overlay").style.display = "none"; this.overlay = false}
        else {
            document.getElementById("overlay").style.display = "block"; 
            this.overlay = true
        }
    }

    getArchColor(hsClass, arch, hsFormat) { 
        // if arch is actually the name of a hsClass
        if (hsClasses.indexOf(arch) != -1) {return {color: hsColors[arch], fontColor: hsFontColors[arch]}}

        // get archName
        let archName 
        if (hsClass) { archName = arch +' '+hsClass } // if hsClass != none
        else {
            archName = arch;
            for (let c of hsClasses) {if (archName.indexOf(c) != -1) {hsClass = c; break} }
        }

        // get color
        //console.log('get archcolor',hsClass, arch, hsFormat)
        //let colorIdx = this.archetypeColors[hsFormat][archName].idx
        if ( archName in this.archetypeColors[hsFormat]) { return this.archetypeColors[hsFormat][archName] }
        else {
            let count = this.archetypeColors[hsFormat][hsClass].count
            let color = hsArchColors[hsClass][count]
            let fontColor = hsFontColors[hsClass]
            this.archetypeColors[hsFormat][archName] = { idx: count, hsClass: hsClass, color: color, fontColor: fontColor, name: archName }
            this.archetypeColors[hsFormat][hsClass].count = (count + 1) % this.maxColors
            
            return this.archetypeColors[hsFormat][archName]
        }
    } // get archColor

    sortArchColors() {
        let sortByName = function(a,b) {}
        for (let f of hsFormats) {
            for (let c of hsClasses){
                let archetypes = []
                for (let a of this.archetypeColors[f]) {
                    if (a.idx == -1 || a.hsClass != c) { continue }
                    archetypes.push(a)
                }
                archetypes.sort(sortByName)
                for (let i in archetypes) {
                    let colorIdx = i % this.maxColors
                    archetypes[i].idx = colorIdx
                    archetypes[i].color = hsArchColors[c][colorIdx]
                    archetypes[i].fontColor = hsFontColors[c]
                }
            }
        }
    }
} // close UI












