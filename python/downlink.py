#downlink  with security

import requests
import hashlib
import datetime

import sys



sensorCode = sys.argv[1]
OnOf=sys.argv[2]
adress=sys.argv[3]
#print(sensorCode)
#print(OnOf)
print(adress)
DevEUI = sensorCode
FPort = "2"
TPWAPIURL = "https://api-iot.gnet.tn"
def ChecksumCalculator(StringRead):
    ChecksumInt = 0
    for i in range (0, int(len(StringRead)/2)):
        StringByte = StringRead[int(i*2):int(i*2+2)]
        ChecksumInt = ChecksumInt + int(hex(int(StringByte,16)),16)
    ChecksumIntModulo256 = ChecksumInt % 256
    if ChecksumIntModulo256 < 16:
        ChecksumResult = ("0"+hex(ChecksumIntModulo256 % 256)[-1]).upper()
    else:
        ChecksumResult = hex(ChecksumIntModulo256 % 256)[-2:].upper()
    return ChecksumResult

if(OnOf=="true"):
    Payload ="FEFEFEFE68"+adress+"681C1035333333646464644F333434343434CC"+ChecksumCalculator("68"+adress+"681C1035333333646464644F333434343434CC")+"16"
    print(Payload)
    print("on")
elif(OnOf=="false"):
    Payload ="FEFEFEFE68"+adress+"681C1035333333646464644D333434343434CC"+ChecksumCalculator("68"+adress+"681C1035333333646464644D333434343434CC")+"16"
    print(Payload)
    print("of")

AS_ID = "Treetronix"

LRCASKey = "22222222222222222222222222222222"

# I.1 - Calculate Timestamp
CurrentTime = datetime.datetime.now()
#print("CurrentTime:", CurrentTime)
TimeStampSHA = CurrentTime.strftime("%Y-%m-%dT%H:%M:%S.000") + "+01:00"
TimeStampURL = TimeStampSHA.replace(":", "%3A")
TimeStampURL = TimeStampURL.replace("+", "%2B")
#print("Time Stamp SHA:", TimeStampSHA)
#print("Time Stamp URL:", TimeStampURL)

# I.2 - Calculate Token <QueryParameters><ASKey>
QueryStringSHA = "DevEUI=" + DevEUI + "&FPort=" + FPort + "&Payload=" + Payload + "&AS_ID=" + AS_ID + "&Time=" + TimeStampSHA
SHA2String = QueryStringSHA + LRCASKey
SHA2Token = hashlib.sha256(SHA2String.encode("utf-8")).hexdigest()
#print(QueryStringSHA)
#print(SHA2String)
#print("Token = ", SHA2Token)

# II - Send Downlink
QueryStringURL = "DevEUI=" + DevEUI + "&FPort=" + FPort + "&Payload=" + Payload + "&AS_ID=" + AS_ID + "&Time=" + TimeStampURL
SendDownlinkURL = TPWAPIURL + "/thingpark/lrc/rest/downlink?" + QueryStringURL + "&Token=" + SHA2Token
SendDownlinkHeaders = {'Content-Type': 'application/x-www-form-urlencoded'}
SendDownlinkPayload = ""
SendDownlinkResponse = requests.request("POST",
                                           SendDownlinkURL,
                                           headers=SendDownlinkHeaders,
                                           data=SendDownlinkURL
                                           )
