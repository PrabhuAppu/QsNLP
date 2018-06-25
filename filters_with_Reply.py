import csv
import re
# For identifying the filters 
import json
from websocket import create_connection
from json import JSONEncoder

class MyEncoder(JSONEncoder):
        def default(self, o):
            return o.__dict__

def findWholeWord(w):
    return re.compile(r'\b({0})\b'.format(w), flags=re.IGNORECASE).search

def removeduplicate(it):
    seen = []
    for x in it:
        if x not in seen:
            yield x
            seen.append(x)

# Analysye Non Matching words and get the field values using search API

def openApplication(ws, applicationID, requestID):
    #print ("### opened ###")
    handshake = {
        "method": "OpenDoc",
        "handle": -1,
        "params": [
            applicationID
        ],
        "jsonrpc": "2.0",
        "id": requestID
    }
    data = MyEncoder().encode(handshake)
    ws.send(data)
    
def getSearchAssociation(ws, searchTerm, requestID):
    #print ("### searching... ###")
    handshake = {
        "handle": 1,
        "method": "SearchResults",
        "params": {
            "qOptions": {
                "qContext": 0
            },
            "qTerms": [
                searchTerm
            ],
            "qPage": {
                "qOffset": 0,
                "qCount": 10,
                "qMaxNbrFieldMatches": -1
            }
        },
        "jsonrpc": "2.0",
        "id": requestID
    }
    data = MyEncoder().encode(handshake)
    ws.send(data)
    result  = eval(ws.recv())
    #print(result)
    return result['result']['qResult']['qSearchGroupArray']
    #print(result['result']['qResult']['qSearchGroupArray'][0])

def getSearchAssociationArray(ws, searchTerm, requestID):
    #print ("### searching... ###")
    handshake = {
        "handle": 1,
        "method": "SearchResults",
        "params": {
            "qOptions": {
                "qContext": 0
            },
            "qTerms": searchTerm,
            "qPage": {
                "qOffset": 0,
                "qCount": 10,
                "qMaxNbrFieldMatches": -1
            }
        },
        "jsonrpc": "2.0",
        "id": requestID
    }
    data = MyEncoder().encode(handshake)
    ws.send(data)
    result  = eval(ws.recv().replace("true","True"))
    #print(result)
    return result['result']['qResult']['qSearchGroupArray']
    #print(result['result']['qResult']['qSearchGroupArray'][0])

def getSearchAssociationSuggestion(ws, searchTerm, requestID):
    #print ("### searching... ###")
    handshake = {
        "handle": 1,
        "method": "SearchSuggest",
        "params": [{},searchTerm.split()],
         "delta":1,
        "jsonrpc": "2.0",
        "id": requestID
    }
    data = MyEncoder().encode(handshake)
    ws.send(data)
    result  = eval(ws.recv().replace("true","True"))
    #print(result)
    #return result['result']['qResult']['qSearchGroupArray']
    return result['result']['qResult'][0]['value']['qSuggestions']
    #print(result['result']['qResult']['qSearchGroupArray'][0])
    
def get(nonMatchingwords, appName, query): 
    ws = create_connection("ws://localhost:4848/app")
    #application = "C:\\Users\\359084\\Documents\\Qlik\\Sense\\Apps\\Executive Dashboard.qvf"
    #application = "D:\Qlik\Apps\Executive Dashboard.qvf"
    #application = "D:\Qlik\Apps\Consumer_Sales.qvf"
    application = appName
    requestID = 1
    # Open the qliksense application
    openApplication(ws, application, requestID)
    requestID+=1
    result =  ws.recv()
    result =  ws.recv()

    allFields = []
    allFieldsWithDef = []
    file = "data\\"+appName+"\\fieldList.csv"
    classfile = "data\\"+appName+"\\fieldClassification.csv"
    dimensionDeffile = "data\\"+appName+"\\masterDimDefList.csv"

    # Get Field to Field Def from Master Dimension 
    with open(dimensionDeffile, newline='') as csvfile:
        measureReader = csv.reader(csvfile, delimiter=',', quotechar='|')
        for row in measureReader:
            allFieldsWithDef.append({
                "field": row[0],
                "def" : row[1]
            })


    # Identify Matching Fields in the query
    with open(file, newline='') as csvfile:
        measureReader = csv.reader(csvfile, delimiter=',', quotechar='|')
        for row in measureReader:
            line=row[0]
            allFields.append(line)

            
    ############################ Get Search Assosiaction Start ##############################
    ## This code gets all the search posibilities by passing the non matching words
    
    filters = []
    term = nonMatchingwords
    associations = getSearchAssociationArray(ws, term, requestID)
    requestID+=1
    allKeyWords = [obj for obj in [obj['qItems'] for obj in associations]]# if obj['qTotalNumberOfMatches']==1]
    
    singleMatch = []#[{"Name" : obj[0]['qIdentifier'], "qTerm" : [obj[0]['qItemMatches'][0]['qText']]} for obj in allKeyWords if obj[0]['qTotalNumberOfMatches']==1 and obj[0]['qItemMatches'][0]['qText'].lower()==term.lower()]
    
    ########################################################################
    ##### Gets only the search results that is matching with the query #####
    ##### This gets only the complete match not a partial match        #####
    ########################################################################
    
    for matches in allKeyWords:
        for fld in matches:
            for itemMatch in fld['qItemMatches']:
                if itemMatch['qText'].lower() in query.lower():
                    singleMatch.extend([{"Name":fld['qIdentifier'], 'qTerm':[itemMatch["qText"]]}])
    
    ########################################################################
    ##### Check the field name is available in query                   #####
    ##### Gets the field name from the definition file or use the      #####
    ##### field name from the result                                   #####
    ########################################################################
    
    for match in singleMatch:
        if match['Name'] not in allFields:
            match['actualName'] =  [obj['def'] for obj in allFieldsWithDef if obj['field'] == match['Name']][0]
        else:
            match['actualName'] =  match['Name']

    ########################################################################
    ##### Read the classification file to identify the dimensions      #####
    ##### or measures use only dimension as filters                    #####
    ########################################################################
    
    csv_rows = []

    with open(classfile) as csvfile:
        reader = csv.DictReader(csvfile)
        title = reader.fieldnames
        for row in reader:
            csv_rows.extend([{title[i]:row[title[i]] for i in range(len(title))}])

    for fieldTags in csv_rows:
        for selected in singleMatch:
            if selected['actualName']==fieldTags['fieldName']:
                masterDef = [obj['def'] for obj in allFieldsWithDef]
                
                if fieldTags['fieldName'] in masterDef or fieldTags['isText']=='True' or fieldTags['isTimeStamp']=='True' or fieldTags['isDate']=='True' or fieldTags['isKey']=='True':
                    selected['classification'] = 'dimension'
                else:
                    selected['classification'] = 'measure'
    
    # logic used to find matching keywords
    allwordsInResult = [ item.split() for innerlist in [item['qTerm'] for item in singleMatch] for item in innerlist ]
    alldistwordsInResult = [ item.lower() for innerlist in allwordsInResult for item in innerlist ]
    alldistwordsInResult = [ item.lower() for innerlist in allwordsInResult for item in innerlist ]

    #qualifiedMatch = [obj for obj in singleMatch if obj['classification']=='dimension' and term.lower() in [ item.lower() for innerlist in [item.lower().split() for item in obj['qTerm']] for item in innerlist ]]
    qualifiedMatch = [obj for obj in singleMatch if obj['classification']=='dimension']# and term.lower() in [ item.lower() for innerlist in [item.lower().split() for item in obj['qTerm']] for item in innerlist ]]
    #qualifiedMatch = [obj for obj in singleMatch if obj['classification']=='dimension' and term.lower() in [item.lower().split() for item in obj['qTerm']]]
    
    
    if len(qualifiedMatch)>0:
        # Check whether the filter is already available
        single = [obj[0]['qIdentifier'] for obj in allKeyWords if obj[0]['qTotalNumberOfMatches']==1]
        alreadyAvailableWords = [obj['actualName'] for obj in filters]
        qTerms = [obj['actualName'] for obj in qualifiedMatch]

        if len([obj['actualName'] for obj in qualifiedMatch if obj['actualName'] not in alreadyAvailableWords])>0:
            filters+=(qualifiedMatch)
        else:
            for qItem in qualifiedMatch:
                for item in filters:
                    if item['actualName'] == qItem['actualName']:
                        item['qTerm'] = item['qTerm'] + qItem['qTerm']
    
    filterFinal_Old = [obj for obj in filters if obj['Name'].lower() in query.lower() or True]
    
    filterFinal_Old3 = []
    for dim in filterFinal_Old:
        filterFinal_Old2 = [obj['Name'] for obj in filterFinal_Old if findWholeWord(dim['Name'].lower())(obj['Name'].lower()) and dim['Name'].lower() != obj['Name'].lower() ]
        if len(filterFinal_Old2)==0 or len(filterFinal_Old)==1:
            filterFinal_Old3.extend([obj for obj in filterFinal_Old if obj['Name']==dim['Name']])
    
    #filterFinal_Old4 = list(removeduplicate(filterFinal_Old3))
    filterFinal_Old4 = list(removeduplicate(filterFinal_Old)) #remove to get actual result 06062018
        
    ############################ Get Search Assosiaction End ##############################
    #-------------------------------------------------------------------------------------#
    
    #-------------------------------------------------------------------------------------#
    ############################ Get Search Suggestion Start ##############################
    
    filters = []
    
    term = ' '.join(nonMatchingwords)
    suggesstions = getSearchAssociationSuggestion(ws, term, requestID)
    
    suggesstions3 = []
    for dim in suggesstions:
        print("###################### dim ##########")
        print(dim)
        suggesstions2 = [obj['qValue'] for obj in suggesstions if findWholeWord(dim['qValue'].lower())(obj['qValue'].lower()) and dim['qValue'].lower() != obj['qValue'].lower() ]
        if len(suggesstions2)==0 or len(suggesstions)==1:
            suggesstions3.extend([obj for obj in suggesstions if obj['qValue']==dim['qValue']])
            
    for term in [obj['qValue'] for obj in suggesstions3 if obj['qValue'].lower() in ' '.join(nonMatchingwords).lower()]:
        associations = getSearchAssociation(ws, term, requestID)
        requestID+=1
        allKeyWords = [obj for obj in [obj['qItems'] for obj in associations]]# if obj['qTotalNumberOfMatches']==1]
        
        singleMatch = [{"Name" : obj[0]['qIdentifier'], "qTerm" : [obj[0]['qItemMatches'][0]['qText']]} for obj in allKeyWords if obj[0]['qTotalNumberOfMatches']==1 and obj[0]['qItemMatches'][0]['qText'].lower()==term.lower()]

        for match in singleMatch:
            if match['Name'] not in allFields:
                match['actualName'] =  [obj['def'] for obj in allFieldsWithDef if obj['field'] == match['Name']][0]
            else:
                match['actualName'] =  match['Name']

        csv_rows = []

        with open(classfile) as csvfile:
            reader = csv.DictReader(csvfile)
            title = reader.fieldnames
            for row in reader:
                csv_rows.extend([{title[i]:row[title[i]] for i in range(len(title))}])

        for fieldTags in csv_rows:
            for selected in singleMatch:
                if selected['actualName']==fieldTags['fieldName']:
                    masterDef = [obj['def'] for obj in allFieldsWithDef]
                    
                    if fieldTags['fieldName'] in masterDef or fieldTags['isText']=='True' or fieldTags['isTimeStamp']=='True' or fieldTags['isDate']=='True' or fieldTags['isKey']=='True':
                        selected['classification'] = 'dimension'
                    else:
                        selected['classification'] = 'measure'
        
        # logic used to find matching keywords
        allwordsInResult = [ item.split() for innerlist in [item['qTerm'] for item in singleMatch] for item in innerlist ]
        alldistwordsInResult = [ item.lower() for innerlist in allwordsInResult for item in innerlist ]
        alldistwordsInResult = [ item.lower() for innerlist in allwordsInResult for item in innerlist ]

        #qualifiedMatch = [obj for obj in singleMatch if obj['classification']=='dimension' and term.lower() in [ item.lower() for innerlist in [item.lower().split() for item in obj['qTerm']] for item in innerlist ]]
        qualifiedMatch = [obj for obj in singleMatch if obj['classification']=='dimension' and term.lower() in ' '.join(obj['qTerm']).lower()]
        #qualifiedMatch = [obj for obj in singleMatch if obj['classification']=='dimension' and term.lower() in [item.lower().split() for item in obj['qTerm']]]
        
        
        if len(qualifiedMatch)>0:
            # Check whether the filter is already availabel
            single = [obj[0]['qIdentifier'] for obj in allKeyWords if obj[0]['qTotalNumberOfMatches']==1]
            alreadyAvailableWords = [obj['actualName'] for obj in filters]
            qTerms = [obj['actualName'] for obj in qualifiedMatch]

            if len([obj['actualName'] for obj in qualifiedMatch if obj['actualName'] not in alreadyAvailableWords])>0:
                filters+=(qualifiedMatch)
            else:
                for qItem in qualifiedMatch:
                    for item in filters:
                        if item['actualName'] == qItem['actualName']:
                            item['qTerm'] = item['qTerm'] + qItem['qTerm']
    
    filterFinal = [obj for obj in filters if obj['Name'].lower() in query.lower() or True] + filterFinal_Old4
    #filterFinal = [obj for obj in filters if obj['Name'].lower() in query.lower() or True] + filterFinal_Old5
    
    filterFinal3 = []
    for dim in filterFinal:
        filterFinal2 = [obj['Name'] for obj in filterFinal if findWholeWord(dim['Name'].lower())(obj['Name'].lower()) and dim['Name'].lower() != obj['Name'].lower() ]
        if len(filterFinal2)==0 or len(filterFinal)==1:
            filterFinal3.extend([obj for obj in filterFinal if obj['Name']==dim['Name']])
    
    filterFinal3 = list(removeduplicate(filterFinal3))
    filterFinal3 = list(removeduplicate(filterFinal)) # remove to get actual result 06062018
    
    termTobeRemoved = []
    
    for filterValue in [obj['qTerm'][0] for obj in filterFinal3 if obj["qTerm"][0] in [item for innerlist in [obj["qTerm"][0].split() for obj in filterFinal3] for item in innerlist]]:
        other = [obj['qTerm'][0] for obj in filterFinal3 if filterValue in obj['qTerm'][0]]
        occurrence = 0
        for i,word in enumerate(query.split(" ")):
            if word == filterValue and len(other)>1:
                occurrence += 1
                print(str(i) +""+ query.split("")[i-1]+" "+query.split(""))
                
        if(occurrence== 1):
            termTobeRemoved.extend([filterValue])

        #print('##########')
        
    filterFinal4 = [obj for obj in filterFinal3 if obj['qTerm'][0] not in termTobeRemoved]
    #print([obj['Name') for obj in filterFinal 4]) 
    print([{"Name":obj['Name'], "Value":obj['qTerm']} for obj in filterFinal])
    print("filter 1111")
    print([{"Name":obj['Name'], "Value":obj['qTerm']} for obj in filterFinal4])
    
    
    ############################ Get Search Suggestion End ################################
    #-------------------------------------------------------------------------------------#
    
    
    #-------------------------------------------------------------------------------------#
    ############################ Get Search Association for Each term start ###############
    
    filters = []
    
    alreadyFoundArray = [ obj2['qTerm'][0].lower().split(' ') for obj2 in filterFinal4 ]
    alreadyFoundArray = [ item.lower() for innerlist in alreadyFoundArray for item in innerlist ]
    
    for term in [ obj for obj in nonMatchingwords if obj not in alreadyFoundArray or True ]:
        associations = getSearchAssociation(ws, term, requestID)
        requestID+=1
        allKeyWords = [obj for obj in [obj['qItems'] for obj in associations]]# if obj['qTotalNumberOfMatches']==1]
        
        singleMatch = []# [{"Name" : obj[0]['qIdentifier'], "qTerm" : [obj[0]['qItemMatches'][0]['qText']]} for obj in allKeyWords if obj[0]['qTotalNumberOfMatches']==1 and obj[0]['qItemMatches'][0]['qText'].lower()==term.lower()]

        ########################################################################
        ##### Gets only the search results that is matching with the query #####
        ##### This gets only the complete match not a partial match        #####
        ########################################################################
        
        for matches in allKeyWords:
            for fld in matches:
                for itemMatch in fld['qItemMatches']:
                    if itemMatch['qText'].lower() in query.lower():
                        singleMatch.extend([{"Name":fld['qIdentifier'], 'qTerm':[itemMatch["qText"]]}])
        
        
        
        for match in singleMatch:
            if match['Name'] not in allFields:
                match['actualName'] =  [obj['def'] for obj in allFieldsWithDef if obj['field'] == match['Name']][0]
            else:
                match['actualName'] =  match['Name']

        csv_rows = []

        with open(classfile) as csvfile:
            reader = csv.DictReader(csvfile)
            title = reader.fieldnames
            for row in reader:
                csv_rows.extend([{title[i]:row[title[i]] for i in range(len(title))}])

        for fieldTags in csv_rows:
            for selected in singleMatch:
                if selected['actualName']==fieldTags['fieldName']:
                    masterDef = [obj['def'] for obj in allFieldsWithDef]
                    
                    if fieldTags['fieldName'] in masterDef or fieldTags['isText']=='True' or fieldTags['isTimeStamp']=='True' or fieldTags['isDate']=='True' or fieldTags['isKey']=='True':
                        selected['classification'] = 'dimension'
                    else:
                        selected['classification'] = 'measure'
        
        # logic used to find matching keywords
        allwordsInResult = [ item.split() for innerlist in [item['qTerm'] for item in singleMatch] for item in innerlist ]
        alldistwordsInResult = [ item.lower() for innerlist in allwordsInResult for item in innerlist ]
        alldistwordsInResult = [ item.lower() for innerlist in allwordsInResult for item in innerlist ]

        #qualifiedMatch = [obj for obj in singleMatch if obj['classification']=='dimension' and term.lower() in [ item.lower() for innerlist in [item.lower().split() for item in obj['qTerm']] for item in innerlist ]]
        qualifiedMatch = [obj for obj in singleMatch if obj['classification']=='dimension']
        #qualifiedMatch = [obj for obj in singleMatch if obj['classification']=='dimension' and term.lower() in [item.lower().split() for item in obj['qTerm']]]
        
        
        if len(qualifiedMatch)>0:
            # Check whether the filter is already availabel
            single = [obj[0]['qIdentifier'] for obj in allKeyWords if obj[0]['qTotalNumberOfMatches']==1]
            alreadyAvailableWords = [obj['actualName'] for obj in filters]
            qTerms = [obj['actualName'] for obj in qualifiedMatch]

            if len([obj['actualName'] for obj in qualifiedMatch if obj['actualName'] not in alreadyAvailableWords])>0:
                filters+=(qualifiedMatch)
            else:
                for qItem in qualifiedMatch:
                    for item in filters:
                        if item['actualName'] == qItem['actualName']:
                            item['qTerm'] = item['qTerm'] + qItem['qTerm']
    
    filterFinal_Old = [obj for obj in filters if obj['Name'].lower() in query.lower() or True]
    
    filterFinal_Old5 = []
    for dim in filterFinal_Old:
        filterFinal_Old2 = [obj['Name'] for obj in filterFinal_Old if findWholeWord(dim['Name'].lower())(obj['Name'].lower()) and dim['Name'].lower() != obj['Name'].lower() ]
        if len(filterFinal_Old2)==0 or len(filterFinal_Old)==1:
            filterFinal_Old5.extend([obj for obj in filterFinal_Old if obj['Name']==dim['Name']])
    
    #filterFinal_Old5= list(removeduplicate(filterFinal_Old5))
    filterFinal_Old5= list(removeduplicate(filterFinal_Old))
    
    ############################ Get Search Association for Each term end ###############
    #-------------------------------------------------------------------------------------#
    
    
    filterFinal4 = filterFinal_Old5 + filterFinal4
    filterFinal4 = list(removeduplicate(filterFinal4))
    #print([obj['Name'] for obj in filterFinal3])
    print('#########- Filters -##########')
    print([{"Name":obj['Name'], "Value":obj['qTerm']} for obj in filterFinal4])
    print('#########- ------- -##########')
    
    for a in filterFinal_Old:
        a["qTerm"] = list(set(a["qTerm"]))
        
    for a in filterFinal_Old:
        removeItem = ""
        for i in range(0, len(a["qTerm"])):
            for j in range(0, len(a["qTerm"])):
                if i!= j:
                    if a["qTerm"][i] in a["qTerm"][j]:
                        matches = re.compile(a["qTerm"][i]+r"\s"+a["qTerm"][j], flags=re.IGNORECASE).search(query)
                        if matches == None:
                            removeItem = a["qTerm"][i]
                    if a["qTerm"][j] in a["qTerm"][i]:
                        matches = re.compile(a["qTerm"][j]+r"\s"+a["qTerm"][i], flags=re.IGNORECASE).search(query)
                        if matches == None:
                            removeItem = a["qTerm"][j]
        
        a["qTerm"] = [obj for obj in a["qTerm"] if obj != removeItem]
    
    for a in [obj['Name']+" - "+'|'.join(obj["qTerm"]) for obj in filterFinal_Old]:
        print(a)
    '''
    response = {
        "filters": filters,
        "dimension": dimension,
        "measure": measure,
        "nonmatchingwords": nonMatchingwords,
        "measureKeyword": [{"aggrFunc":"SUM", "measureField":obj['name']} for obj in measure]
    }
    '''
    return filterFinal4

