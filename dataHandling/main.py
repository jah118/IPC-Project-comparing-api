import pandas as pd
import numpy as np
import time
from datetime import datetime

df = pd.read_csv('./data/mainsum.csv',
                 dtype={'timeStamp': np.longlong, 'elapsed': 'int32', 'label': str, 'responseCode': str,
                        'responseMessage': str, 'threadName': str, 'dataType': 'str', 'success': bool,
                        'failureMessage': str, 'bytes': int, 'sentBytes': int, 'grpThreads': str,
                        'allThreads': str, 'URL': str, 'Latency': int, 'IdleTime': int, 'Connect': int})
# print(df['timeStamp'])
# print(df.head())
# # df['timeStamp'] = int(df['timeStamp'])
# print(df.head())
# print('last')
# # 1649614627472
# # 1234567890123
# df['timeStamp'] = pd.to_datetime(df['timeStamp'], unit='ns')
#
# print(df.head())
df.to_excel('data/name.xlsx', index = None, header=True)

# timeStamp,elapsed,label,responseCode,responseMessage,threadName,dataType,success,failureMessage,bytes,
# sentBytes,grpThreads,allThreads,URL,Latency,IdleTime,Connect

# df.head()


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
