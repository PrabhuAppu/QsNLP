from flask import Flask, render_template
from flask_socketio import SocketIO
from bs4 import BeautifulSoup
import requests
import GetMatchingFields 
import ClassifyField 
#import filters 
import filters_with_Reply as filters
import aggrMethod 
import combinations 
import qlikViz

from flask_cors import CORS 

import json 

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
socketio = SocketIO(app)
result ={}
query = ''
@app.route('/')
def sessions():
    return render_template('Home.html')

def messageReceived():
    print("yes") 
    
@socketio.on('my event')
def handle_my_custom_event1(json, methods=['GET', 'POST']):
    print(str(getuserName()))
    socketio.emit('my response', getuserName(), callback=messageReceived)
    socketio.emit('my response', "How can help you?", callback=messageReceived)

@socketio.on('my query')
def handle_my_custom_event2(json, methods=['GET', 'POST']):
    #print(str(getuserName))) 
    global query 
    query = str(json['query'])
    chart = getChart_Converse()

@socketio.on('confirm This Filter')
def handle_my_custom_event3 (json, methods=['GET','POST']):
    global result 
    #print(str(getuserName())) 
    field = (json['field'])
    term = (json['term'])

    filterTest = ([obj for obj in result["allFilters"] if obj['Name'].lower() == field.lower() and term in obj['qTerm']])

    filtersNew = []
    for a in result["allFilters"]:
        if term.lower() in ' '.join(a['qTerm']).lower():
            result['allFilters'] = [obj for obj in result['allFilters'] if term.lower() not in [obj2.lower() for obj2 in obj['qTerm']] ]
            
    #print([obj['Name'] for obj in result['allFilters']])
    result['filters'].extend(filterTest) 
    #print(filter Test) 
    if len(result['allFilters'])>0:
        askToConfirmFilter() 
    else:
        socketio.emit('allFilterOver',"Ok.. Checking the data.. Please Wait...", callback=messageReceived)
        getChart()
        #socketio.emit('my response, "ok", callback=message Received)

def askToConfirmFilter():
    global result
    all_filterTerms = [obj['qTerm'] for obj in result["allFilters"]]
    all_filterTerms = list(set([item for innerlist in all_filterTerms for item in innerlist])) #print(result["allFilters"))
    termToFieldMap = []
    for term in all_filterTerms:
        item = {}
        item['term'] = term
        item['field'] = [obj['Name'] for obj in result["allFilters"] if term in obj['qTerm']] 
        termToFieldMap.extend([item])

    filtersNew = []
    for a in termToFieldMap: 
        if len(a['field'])>1:
            socketio.emit('confirmFilter', {"query": "On which field you want to filter "+ a['term'] + ("|").join(a['field']), "field": a['term'], "term": a['term'] }, callback = messageReceived) 
            break
        elif len(a['field'])==1:
            result["filters"].extend([obj for obj in result["allFilters"] if obj["Name"].lower() == a["field"][0].lower() ])
            
            for b in result["allFilters"]:
                if a['term'].lower() in ' '.join(b['qTerm']).lower():
                    result['allFilters'] = [obj for obj in result['allFilters'] if a['term'].lower() not in [obj2.lower() for obj2 in obj['qTerm']] ]

                        
    if len(result['allFilters'])>0:
        askToConfirmFilter() 
    else:
        socketio.emit('allFilterOver',"Ok.. Checking the data.. Please Wait...", callback=messageReceived)
        getChart()
        
def getuserName():
    '''
    page = "http://directory.global.hsbc/cgi-whitepages/gnrname.pl?employeeid=&mail=&name=44113918&co="
    r = requests.get(page)
    soup = BeautifulSoup(r.content, 'html')
    
    a = soup.find('div',{"id": "maintop"})
    
    return 'Hi!'+a.findAll('a')[1].text
    '''
    return "Hi! Prabhu Appu"
    
def getChart():
    global query
    global result
    
    cube = combinations.buildChartCombination(result, query)
    print(cube)
    ch = qlikViz.createChartsPropeties(cube, query)
    socketio.emit('result', ch, callback=messageReceived) 
    
def getChart_Converse():
    global query
    global result
    
    appName = "Executive Dashboard.qvf"
    data = GetMatchingFields.Get(query)
    classData = ClassifyField.doClassify(data['result'], 1, appName, query)
    
    if len(classData)==0:
        classData = ClassifyField.doClassify(data['result'], 0.75, appName, query)

    if len(classData)==0:
        classData = ClassifyField.doClassify(data['result'], 0.5, appName, query)

    filter = filters.get(data['nonMatchingwords'], appName, query)  

    

    result = {
        "allFilters": filter,
        "filters": filter,
        "dimension": classData["dimension"],
        "measure": classData["measure"],
        "nonmatchingwords": data['nonMatchingwords'],
        "measureKeyword": "MesureMethod"
        #[{"aggrFunc":"SUM", "measureField":obj['name']} for obj in classData["measure"]]
    }

    #print([obj['name'] for obj in classData["measure"]])
    print(result)
    print('##############################') 
    
    if len(result["allFilters"])==0:    
        socketio.emit('allFiltersOver', "Ok... checking the data.. please wait...", callback=messageReceived) 
        getChart()
    else:
        askToConfirmFilter()
        
if __name__ == "__main__":
    socketio.run(app)