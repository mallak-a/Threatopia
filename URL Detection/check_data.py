import pandas as pd
df = pd.read_csv('malicious_phish.csv')
print(df['type'].value_counts())