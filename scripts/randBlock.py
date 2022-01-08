from random import randint


exp = [
    'GVG',
    'TGT',
    'OG',
    'MSG',
    'JTU',
    'KFT',
    'KNC',
    'WW',
    'BDP',
    'RR',
    'ROE',
]

num = len(exp)
block = []

while len(block) < 3:
    r = randint(0, num)
    if r not in block:
        block.append(r)



for (b in block):
    print(exp[b])