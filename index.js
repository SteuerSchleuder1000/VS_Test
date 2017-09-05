doctype html
html(lang='en')
  head
    meta(charset='UTF-8')
    meta(name='viewport', content='width=device-width, initial-scale=1.0')
    meta(http-equiv='X-UA-Compatible', content='ie=edge')
    script(src='https://www.gstatic.com/firebasejs/4.3.0/firebase.js')
    script(src='https://cdn.plot.ly/plotly-latest.min.js')
    link(rel='stylesheet', href='https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css')
    link(rel='stylesheet', href='reset.css')
    link(rel='stylesheet', href='styles_new.css')
    title VS
  body
    .main-wrapper
      #overlay(onclick='overlay()')
      nav.navbar
        .tabs
          button#ladder.tab Ranks
          button#power.tab Tiers
          button#table.tab Matchups
          //button#timeline.tab Timeline
          button#decks.tab Decks
          button#info.tab info
      //button#tooltips.optionBtn(onclick='overlay()') i
        
        
      .content-wrapper
        #loader
        #ladderWindow.tabWindow
          .content-header
            .classDeckOptions.optionBar
              button#classes.optionBtn Classes
              button#decks.optionBtn Decks
            .ftrOptions.optionBar
              .option-folder
                button#formatBtn.folder-toggle Standard
                .dropdown.hidden
                  button#Standard.optionBtn.folderBtn Standard
                  button#Wild.optionBtn.folderBtn Wild
              .option-folder
                button#timeBtn.folder-toggle Last Month
                .dropdown.hidden
                  button#lastDay.optionBtn.folderBtn Last Day
                  button#lastWeek.optionBtn.folderBtn Last Week
                  button#lastMonth.optionBtn.folderBtn Last Month
            .graphOptions.optionBar
              button#bar.optionBtn.fa.fa-bar-chart
              button#line.optionBtn.fa.fa-line-chart
              button#number.optionBtn.fa.fa-percent
              button#timeline.optionBtn.fa.fa-clock-o 
          .content
            #chart1
          .content-footer
        #powerWindow.window
          div
        #timelineWindow.tabWindow
          div
        #tableWindow.tabWindow
          
          .content-header
            .ftrOptions.optionBar
              .option-folder
                button#formatBtn.folder-toggle Standard
                .dropdown.hidden
                  button#Standard.optionBtn.folderBtn Standard
                  button#Wild.optionBtn.folderBtn Wild
              .option-folder
                button#timeBtn.folder-toggle Last Month
                .dropdown.hidden
                  button#lastDay.optionBtn.folderBtn Last Day
                  button#lastWeek.optionBtn.folderBtn Last Week
                  button#lastMonth.optionBtn.folderBtn Last Month
              .option-folder
                button#ranksBtn.folder-toggle All Ranks
                .dropdown.hidden
                  button#ranks_all.optionBtn.folderBtn All Ranks
                  button#ranks_L_5.optionBtn.folderBtn Ranks L-5
                  button#ranks_6_15.optionBtn.folderBtn Ranks 6-15
            .graphOptions.optionBar
              .option-folder
                button#sortBtn.folder-toggle Sort
                .dropdown.hidden
                  button#class.optionBtn.folderBtn By Class
                  button#frequency.optionBtn.folderBtn By Frequency
                  button#winrate.optionBtn.folderBtn By Win Rate
          .content
            #chart2
        #decksWindow.tabWindow
          div
            button Druid
            button Hunter
            button Mage
            button Paladin
            button Priest
            button Rogue
            button Shaman
            button Warlock
            button Warrior
        #infoWindow.tabWindow
          div VS Live is a Vicious Syndicate service that provides in depth information about the 
    script(src='script.js')
    script(src='ui.js')
    script(src='data.js')
    script(src='ladderClass.js')
    script(src='table.js')

