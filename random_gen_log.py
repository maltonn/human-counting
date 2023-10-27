import datetime
import random

L=[]

for i in range(5000):
    # 今日から3日後までの間でランダムに日時を生成
    random_date = datetime.datetime.now() + datetime.timedelta(days=random.randint(0, 3), hours=random.randint(0, 23), minutes=random.randint(0, 59), seconds=random.randint(0, 59))
    L.append(random_date)

L.sort()

L2=[0]*5000

L3=[0]*5000
for i in range(5000):
    r=random.random()
    if r<0.4:
        L3[i]="<"
    elif r>0.6:
        L3[i]=">"
    else:
        L3[i]="?"


for a,b,c in zip(L,L2,L3):
    print(f"{a.strftime('%Y-%m-%d %H:%M:%S')},{b},{c}")

