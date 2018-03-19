
import pyrebase # learn more: https://python.org/pypi/Pyrebase
import json

config = {
    "apiKey": "AIzaSyAt0uIAVOFjB42_bkwrEIqhSWkMT_VmluI",
    "authDomain": "data-reaper.firebaseapp.com",
    "databaseURL": "https://data-reaper.firebaseio.com",
    "projectId": "data-reaper",
    "storageBucket": "data-reaper.appspot.com",
    "messagingSenderId": "1079276848174"
}

firebase = pyrebase.initialize_app(config)
db = firebase.database()
auth = firebase.auth()
#user = auth.create_user_with_email_and_password('admin01@vs.com', '2\!vEJ:6L]mh5R[z')
user = auth.sign_in_with_email_and_password('admin01@vs.com', '2\!vEJ:6L]mh5R[z')

uid = user['localId']
idToken = user['idToken']


def createNewAdmin():
    db.child('admins').child(uid).set(True,idToken)
    db.child('premiumUsers').child(uid).set(True,idToken)
    userData = {
        'email': user['email'],
        'premiumUser':True,
        'admin':True,
    }
    db.child('users').child(uid).set(userData,idToken)


def testUpload():
    data = {"testobject":0}
    db.child('testData').set(data,idToken)


def resetAnalytics(p):
    # Deletes all analytics data!!!
    data = {'active': p, 'data': 0}  # Deletes all analytics data!!!
    db.child('analytics').set(data,idToken)

def setAnalyticsProb(p):
    db.child('analytics').child('active').set(p, idToken)


def downloadAnalytics():
    analytics = db.child('analytics').child('data').get()
    #print(analytics.val())
    with open('analytics.json', 'w') as outfile:  
        json.dump(analytics.val(), outfile)


#resetAnalytics(0.01)
downloadAnalytics()



