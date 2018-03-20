
// app.js defines the App class which serves as the main class
// app.ui stores all data related to the website
// app handles the firebase via .setupFirebase()
// app.load(phase) loads all needed data
// The data has to be loaded in order -> handled via app.phase 
// app can be accessed globally (as defined in script.js)
// -> app.ui.ladderWindow, app.ui.tableWindow, app.ui.powerWindow etc.




class App {

    constructor() {

        this.ui = new UI()
        this.ui.showLoader()

        this.path = {
            window: null,
            hsFormat: 'Standard',
            windowIdx: 0,
            mode: '',
            ranks: 'all',
            time: 'last2Weeks',
            arch: null,
        }

        this.fb_db = null
        this.fb_loggedIn = false
        this.phase = 0 // loading phase
        this.setupFirebase()

        //document.querySelector('.refreshArrow').addEventListener('click', this.reload.bind(this))
    } // constructor



    setupFirebase() {
        this.fb_config = {
            apiKey: "AIzaSyAt0uIAVOFjB42_bkwrEIqhSWkMT_VmluI",
            authDomain: "data-reaper.firebaseapp.com",
            databaseURL: "https://data-reaper.firebaseio.com",
            projectId: "data-reaper",
            storageBucket: "data-reaper.appspot.com",
            messagingSenderId: "1079276848174"
        }

        if (!firebase.apps.length) {
            firebase.initializeApp(this.fb_config);
            this.fb_db = firebase.database()
        }

        let auth = firebase.auth()
        let promise = auth.signInWithEmailAndPassword(login.email, login.pw);

        promise.then(user => {

            if (this.ui.loggedIn) {return}
            if (user) {
                this.ui.loggedIn = true
                let ref = this.fb_db.ref('premiumUsers/'+user.uid)
                ref.on('value', d => {  if ( !d.val() && PREMIUM ) { console.log('PERMISSION ERROR',d.val()) }
                                        this.load(0)
                                     }, 
                                e => console.log('Could not load User Data',e)
                        )
            } else {
                console.log('not logged in')
                this.ui.loggedIn = true
                this.load(0)
            }
        })

        let ref = this.fb_db.ref('analytics/active') // if analytics active
        ref.on('value', d => { 
            this.p = d.val()
            if (d.val() > 0) { this.startAnalytics(d.val()) }
        }, e => { return })
    } // setup Firebase



    load(phase) {

        let callback = function () {}
        switch (phase) {
            case 0:
                callback = function () { app.load(1) }
                this.ui.ladderWindow = new LadderWindow(callback)
                this.ui.tableWindow = new TableWindow(callback)
                this.ui.infoWindow = new InfoWindow(callback)
                break

            case 1:
                if ( !this.ui.tableWindow.fullyLoaded || !this.ui.ladderWindow.fullyLoaded) {return}
                if (this.phase >= 2) { 
                    this.ui.updateTime()
                    console.log('RELOAD')
                    return 
                }
                this.phase = 1
                this.path.window = this.ui.ladderWindow
                this.ui.display('ladderWindow')

                callback = function () { app.load(2) }
                this.ui.powerWindow = new PowerWindow(callback)
                this.ui.decksWindow = new DecksWindow(callback)
                break

            case 2:
                this.phase = 2
                console.log('loaded')
                break
        }
    } // load



    startAnalytics(p) { 
        console.log('start analytics with prob interval',p)
        window.setInterval( app.analytics , 30*1000) 
    }

    analytics() {
        let random = Math.random()
        if ( random > app.p ) { return }
        //console.log('uploaded',random,app.p)

        let w = app.path.window
        if (w == null) { return }
        let utc = new Date().getTime()
        let info = {
            w: w.name[0],   // window name
            f: w.f[0],      // format
            t: w.t,         // time
            r: w.r,         // ranks
            m: w.mode,      // mode
            p: w.plotType, 
            premium: PREMIUM,
        }

        for (let key in info) { if (info[key] == undefined) {info[key] = '' } }

        //console.log(info)
        app.fb_db.ref('analytics/data/'+utc).set(info)
    }

}// App


