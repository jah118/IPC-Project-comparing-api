import pandas as pd
import numpy as np

df = pd.read_csv('./data/mainsum.csv',
                 dtype={'timeStamp': str, 'elapsed': 'int32', 'label': str, 'responseCode': str,
                        'responseMessage': str, 'threadName': str, 'dataType': 'str', 'success': bool,
                        'failureMessage': str, 'bytes': int, 'sentBytes': int, 'grpThreads': str,
                        'allThreads': str, 'URL': str, 'Latency': int, 'IdleTime': int, 'Connect': int})

# timeStamp,elapsed,label,responseCode,responseMessage,threadName,dataType,success,failureMessage,bytes,
# sentBytes,grpThreads,allThreads,URL,Latency,IdleTime,Connect

df.head()
print(df.head())

# # Creating empty series
# ser = pd.Series()
#
# print(ser)
#
# # simple array
# data = np.array(['g', 'e', 'e', 'k', 's'])
#
# ser = pd.Series(data)
# print(ser)
