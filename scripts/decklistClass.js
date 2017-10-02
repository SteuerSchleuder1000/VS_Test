

class Decklist {

    constructor (dl,hsClass,window) {

        this.name = dl.name

        this.hsClass = hsClass
        this.window = window

        this.cards = []
        this.cardNames = []
        this.dust = 0
        this.manaBin = fillRange(0,11,0)
        this.showInfo = false

        this.div = document.createElement('div')
        this.div.className = 'deckBox'
        this.div.id = dl.name
        
        this.deckTitle = document.createElement('div')
        this.deckTitle.className = 'deckTitle'
        this.deckTitle.innerHTML = '<p>'+dl.name+'</p>'
        this.deckTitle.style.backgroundColor = hsColors[this.hsClass]
        this.deckTitle.style.color = hsFontColors[this.hsClass]
        


        var titleHover = document.createElement('div')
        titleHover.className = 'titleHover'

        this.infoBtn = document.createElement('div')
        this.infoBtn.className = 'titleHover-content' 
        this.infoBtn.innerHTML = 'info'
        this.infoBtn.style.float = 'right'
        this.infoBtn.addEventListener('click',this.toggleInfo.bind(this))

        this.copyBtn = document.createElement('div')
        this.copyBtn.className = 'titleHover-content'
        this.copyBtn.innerHTML = 'copy'
        this.copyBtn.style.float = 'left'
        this.copyBtn.id = 'dl'+randint(0,1000000000)

        titleHover.appendChild(this.copyBtn)
        titleHover.appendChild(this.infoBtn)
        this.deckTitle.appendChild(titleHover)

        new Clipboard('#'+this.copyBtn.id, {
            text: function(trigger) { return dl.deckCode }
        });
        

        // Cards

        this.decklist = document.createElement('div')
        this.decklist.className = 'decklist'
        this.decklist.id = dl.name

        for (var card of dl.cards) {

            this.cardNames.push(card.name)

            var c = new CardDiv(card)
            c.hoverDiv.onmouseover = this.window.highlight.bind(this.window)
            c.hoverDiv.onmouseout = this.window.highlight.bind(this.window)
            this.cards.push(c)
            this.dust += c.dust * c.quantity
            var cost = (c.cost >= 10) ? 10 : c.cost
            this.manaBin[cost] += parseInt(c.quantity)
            this.decklist.appendChild(c.div)
        }


        // Info

        this.deckinfo = document.createElement('div')
        this.deckinfo.className = 'decklist' + ' deckinfo'
        this.deckinfo.id = dl.name 

        var chartTitle = document.createElement('p')
        chartTitle.innerHTML = 'Manacurve'
        chartTitle.className = 'manacurve'
        this.deckinfo.appendChild(chartTitle)

        this.chart = document.createElement('div')
        this.chartId = 'chartId:' + randint(0,100000000)
        this.chart.id = this.chartId
        this.chart.className = 'manaChart'
        this.deckinfo.appendChild(this.chart)

        var dustDiv = document.createElement('div')
        var dustInfo = document.createElement('p')
        dustInfo.innerHTML = this.dust+ '  '
        dustInfo.className = 'dustInfo'
        var dustImg = document.createElement('img')
        dustImg.src = 'Images/dust.png'
        dustImg.className = 'dustImg'
        dustDiv.appendChild(dustInfo)
        dustDiv.appendChild(dustImg)
        this.deckinfo.appendChild(dustDiv)

        var cardTypes = document.createElement('p')
        cardTypes.className = 'cardtypes'
        var ct_txt = ''
        if (dl.cardTypes.Minion >= 10) {ct_txt += dl.cardTypes.Minion +' Minions<br>' }
        else if (dl.cardTypes.Minion == 1) {ct_txt += dl.cardTypes.Minion +'  Minion<br>' }
        else {ct_txt += dl.cardTypes.Minion +'  Minions<br>' }

        if (dl.cardTypes.Spell >= 10) {ct_txt += dl.cardTypes.Spell +' Spells<br>' }
        else if (dl.cardTypes.Spell == 1) {ct_txt += dl.cardTypes.Spell +'  Spell<br>' }
        else {ct_txt += dl.cardTypes.Spell +'  Spells<br>' }

        if (dl.cardTypes.Weapon) { ct_txt += dl.cardTypes.Weapon+'  Weapons<br>' }
        if (dl.cardTypes.Hero) { ct_txt += dl.cardTypes.Hero+'  Hero<br>' }
        cardTypes.innerHTML = ct_txt
        this.deckinfo.appendChild(cardTypes)

        var author = document.createElement('p')
        author.className = 'author'
        author.innerHTML = 'Author: '+ dl.author
        this.deckinfo.appendChild(author)

        var timeStamp = document.createElement('p')
        timeStamp.className = 'timestamp'
        timeStamp.innerHTML = 'created '+ dl.timestamp
        this.deckinfo.appendChild(timeStamp)

        var gameplay = document.createElement('a')
        gameplay.href = 'https://www.reddit.com/r/ViciousSyndicate/comments/6yqj62/vs_live_web_app_feedback_thread/'
        gameplay.target = '_blank'
        gameplay.className = 'gameplay'
        gameplay.innerHTML = 'Gameplay'
        this.deckinfo.appendChild(gameplay)
       
        

        // this.copyBtn = document.createElement('buttton')
        // this.copyBtn.innerHTML = 'Copy To Clipboard'
        // this.copyBtn.className = 'copyDL'
        // this.copyBtn.id = 'dl'+randint(0,10000000) // unique button id for clipboard
        
        
        this.div.appendChild(this.deckTitle)
        this.div.appendChild(this.decklist)
        this.div.appendChild(this.deckinfo)
        //this.div.appendChild(this.copyBtn)

    }

    highlight(cardName) {
        for (var c of this.cards) {
            var hl = 0
            if (c.name + 'x1' == cardName) { hl = 1 }
            if (c.name + 'x2' == cardName) { hl = 2 }
            if (hl == 0) { 
                c.div.classList.remove('highlighted'); 
                c.div.classList.remove('half-highlighted'); 
                continue }

            if (hl == c.quantity) { c.div.classList.add('highlighted') }
            else { c.div.classList.add('half-highlighted') }            
        }   
    }

    toggleInfo() {
        if (this.showInfo) {
            this.decklist.style.display = 'block'
            this.deckinfo.style.display = 'none'
            this.infoBtn.innerHTML = 'info'
            this.showInfo = false
        }
        else {
            this.decklist.style.display = 'none'
            this.deckinfo.style.display = 'block'
            this.infoBtn.innerHTML = 'cards'
            this.showInfo = true
            this.plot()
        }
    }

    plot() {
        var trace = {
            x: range(0,this.manaBin.length),
            y: this.manaBin,
            type: 'bar',
        }
        var layout = { margin: {l:15, r:10, b:25, t: 0}, }
        Plotly.newPlot(this.chartId,[trace], layout, {displayModeBar: false,})
    }


}// decklist




class CardDiv {


    constructor (card) {
        this.name = card.name
        this.cost = card.manaCost
        this.quantity = card.quantity
        this.rarity = card.rarity
        this.dust = cardDust[this.rarity]

        this.div = document.createElement('div')
        this.div.className = 'card'
        this.div.id = this.name
        this.div.style.display = 'block'

        this.hoverDiv = document.createElement('div')
        this.hoverDiv.className = 'hoverDiv'
        this.hoverDiv.id = this.name + 'x' + this.quantity

        var costContainer = document.createElement('div')
        costContainer.className = 'costContainer'

        var hex = document.createElement('div')
        hex.className = 'hex '+this.rarity
        hex.innerHTML = `&#11042`

        var cost = document.createElement('div')
        cost.innerHTML = this.cost
        cost.className = 'cost'
        if (this.cost >= 10) {
            cost.style.fontSize = '75%'
            cost.style.paddingLeft = '0.2rem'
            cost.style.paddingTop = '0.35rem'
        }

        var name = document.createElement('div')
        name.innerHTML = this.name
        name.className = 'name'

        var quantity
        if (this.quantity > 1) {
            quantity = document.createElement('div')
            quantity.innerHTML = 'x'+this.quantity
            quantity.className = 'quantity'
        }

        costContainer.appendChild(hex)
        costContainer.appendChild(cost)
        this.div.appendChild(costContainer)
        this.div.appendChild(name)
        if (this.quantity > 1) {this.div.appendChild(quantity)}
        this.div.appendChild(this.hoverDiv)


    }


}