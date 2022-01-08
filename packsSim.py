import random
import copy
import csv
 
 
global_common_count = 52
global_rare_count = 35
global_epic_count = 23
global_legendary_count = 25
 
rarities = ['Common', 'Rare', 'Epic', 'Legendary']
 
dust_value = {'Common': 5,
             'Rare': 20,
             'Epic': 100,
             'Legendary': 400,
             'Golden Common': 50,
             'Golden Rare': 100,
             'Golden Epic': 400,
             'Golden Legendary': 1600}
craft_value = {'Common': 40,
             'Rare': 100,
             'Epic': 400,
             'Legendary': 1600,
             'Golden Common': 400,
             'Golden Rare': 800,
             'Golden Epic': 1600,
             'Golden Legendary': 3200}
 
card_collection_template = {'Common': [0 for i in range(global_common_count)],
                           'Rare': [0 for i in range(global_rare_count)],
                           'Epic': [0 for i in range(global_epic_count)],
                           'Legendary': [0 for i in range(global_legendary_count)],
                           'Golden Common': [0 for i in range(global_common_count)],
                           'Golden Rare': [0 for i in range(global_rare_count)],
                           'Golden Epic': [0 for i in range(global_epic_count)],
                           'Golden Legendary': [0 for i in range(global_legendary_count)]}
 
 
class Card:
 
   def __init__(self, rarity, card_id):
       self.rarity = rarity
       self.card_id = card_id
 
 
def create_pack(pity):
 
   pack = []
   if pity == 0:
       for i in range(5):
           r = random.random()
 
           if r < .7014:
               card = Card('Common', random.randint(0, global_common_count - 1))
           elif r - .7014 < .2151:
               card = Card('Rare', random.randint(0, global_rare_count - 1))
           elif r - .9165 < .0419:
               card = Card('Epic', random.randint(0, global_epic_count - 1))
           elif r - .9584 < .0100:
               card = Card('Legendary', random.randint(0, global_legendary_count - 1))
           elif r - .9684 < .0149:
               card = Card('Golden Common', random.randint(0, global_common_count - 1))
           elif r - .9833 < .0133:
               card = Card('Golden Rare', random.randint(0, global_rare_count - 1))
           elif r - .9966 < .0025:
               card = Card('Golden Epic', random.randint(0, global_epic_count - 1))
           elif r - .9991 < .0009:
               card = Card('Golden Legendary', random.randint(0, global_legendary_count - 1))
           pack.append(card)
 
   #Add one legend for potential pack 10
   elif pity == 1:
       for i in range(4):
           r = random.random()
 
           if r < .7014:
               card = Card('Common', random.randint(0, global_common_count - 1))
           elif r - .7014 < .2151:
               card = Card('Rare', random.randint(0, global_rare_count - 1))
           elif r - .9165 < .0419:
               card = Card('Epic', random.randint(0, global_epic_count - 1))
           elif r - .9584 < .0100:
               card = Card('Legendary', random.randint(0, global_legendary_count - 1))
           elif r - .9684 < .0149:
               card = Card('Golden Common', random.randint(0, global_common_count - 1))
           elif r - .9833 < .0133:
               card = Card('Golden Rare', random.randint(0, global_rare_count - 1))
           elif r - .9966 < .0025:
               card = Card('Golden Epic', random.randint(0, global_epic_count - 1))
           elif r - .9991 < .0009:
               card = Card('Golden Legendary', random.randint(0, global_legendary_count - 1))
           pack.append(card)
 
       pack.append(Card('Legendary', random.randint(0, global_legendary_count - 1)))
 
   return pack
 
 
def calc_remaining_dust(card_collection):
   remaining_dust = 0
 
   for rarity in ['Common', 'Rare', 'Epic']:
       for i in range(len(card_collection[rarity])):
           if card_collection[rarity][i] + card_collection[f'Golden {rarity}'][i] == 0:
               remaining_dust += (craft_value[rarity] * 2)
           elif card_collection[rarity][i] + card_collection[f'Golden {rarity}'][i] == 1:
               remaining_dust += craft_value[rarity]
              
   for i in range(len(card_collection['Legendary'])):
       if card_collection['Legendary'][i] + card_collection['Golden Legendary'][i] == 0:
           remaining_dust += craft_value['Legendary']
 
   return remaining_dust
 
 
def calc_duplicate_dust(card_collection):
 
   duplicate_dust = 0
 
   #Regulars
   for rarity in ['Common', 'Rare', 'Epic']:
       for i in range(len(card_collection[rarity])):
           if card_collection[rarity][i] + card_collection[f'Golden {rarity}'][i] > 2:
               if card_collection[rarity][i] >= 2:
                   duplicate_dust += (card_collection[f'Golden {rarity}'][i] * dust_value[f'Golden {rarity}']) + ((card_collection[rarity][i] - 2) * dust_value[rarity])
               elif card_collection[rarity][i] == 1:
                   duplicate_dust += ((card_collection[f'Golden {rarity}'][i] - 1) * dust_value[f'Golden {rarity}'])
               elif card_collection[rarity][i] == 0:
                   duplicate_dust += ((card_collection[f'Golden {rarity}'][i] - 2) * dust_value[f'Golden {rarity}'])
 
   #Legendaries
   for i in range(len(card_collection['Legendary'])):
       if card_collection['Legendary'][i] + card_collection['Golden Legendary'][i] > 1:
           if card_collection['Legendary'][i] >= 1:
               duplicate_dust += (card_collection['Golden Legendary'][i] * dust_value['Golden Legendary']) + ((card_collection['Legendary'][i] - 1) * dust_value['Legendary'])
           elif card_collection['Legendary'][i] == 0:
               duplicate_dust += ((card_collection['Golden Legendary'][i] - 1) * dust_value['Golden Legendary'])
   return duplicate_dust
 
 
def no_dupes(card_collection):
 
   for rarity in ['Common', 'Rare', 'Epic']:
      
       #Variables
       dupes = 0
       golden_dupes = 0
       zeroindex = []
 
       #Find empty locations
       for i in range(len(card_collection[rarity])):
           if card_collection[rarity][i] + card_collection[f'Golden {rarity}'][i] == 1:
               zeroindex.append(i)
           elif card_collection[rarity][i] + card_collection[f'Golden {rarity}'][i] == 0:
               zeroindex.append(i)
               zeroindex.append(i)
       random.shuffle(zeroindex)
 
       #Remove Duplicates
       for i in range(len(card_collection[rarity])):
           if card_collection[f'Golden {rarity}'][i] > 2:
               golden_dupes = golden_dupes + card_collection[f'Golden {rarity}'][i] - 2
               card_collection[f'Golden {rarity}'][i] = 2
           if card_collection[rarity][i] + card_collection[f'Golden {rarity}'][i] > 2:
               dupes = dupes + card_collection[rarity][i] + card_collection[f'Golden {rarity}'][i] - 2
               card_collection[rarity][i] = 2 - card_collection[f'Golden {rarity}'][i]
 
       #Reinsert Duplicates
       while dupes > 0:
           if len(zeroindex) != 0:
               card_collection[rarity][zeroindex.pop()] += 1
               dupes = dupes - 1
           else:
               card_collection[rarity][0] += 1
               dupes = dupes - 1
       while golden_dupes > 0:
           if len(zeroindex) != 0:
               card_collection[f'Golden {rarity}'][zeroindex.pop()] += 1
               golden_dupes = golden_dupes - 1
           else:
               card_collection[f'Golden {rarity}'][0] += 1
               golden_dupes = golden_dupes - 1
  
  
   #Variables
   dupes = 0
   golden_dupes = 0
   zeroindex = []
 
   #Find empty locations
   for i in range(len(card_collection['Legendary'])):
       if card_collection['Legendary'][i] + card_collection['Golden Legendary'][i] == 0:
           zeroindex.append(i)
   random.shuffle(zeroindex)
 
   #Remove Duplicates
   for i in range(len(card_collection['Legendary'])):
       if card_collection['Golden Legendary'][i] > 1:
               golden_dupes = golden_dupes + card_collection['Golden Legendary'][i] - 1
               card_collection['Golden Legendary'][i] = 1
       if card_collection['Legendary'][i] + card_collection['Golden Legendary'][i] > 1:
               dupes = dupes + card_collection['Legendary'][i] + card_collection['Golden Legendary'][i] - 1
               card_collection['Legendary'][i] = 1 - card_collection['Golden Legendary'][i]
 
   #Reinsert Duplicates                                                         
   while dupes > 0:
       if len(zeroindex) != 0:
           card_collection['Legendary'][zeroindex.pop()] = 1
           dupes = dupes - 1
       else:
           card_collection['Legendary'][0] += 1
           dupes = dupes - 1
   while golden_dupes > 0:
       if len(zeroindex) != 0:
           card_collection['Golden Legendary'][zeroindex.pop()] += 1
           golden_dupes = golden_dupes - 1
       else:
           card_collection['Golden Legendary'][0] += 1
           golden_dupes = golden_dupes - 1
 
   return card_collection
 
 
def count_rarity(card_collection, rarity):
 
   completion = 0
 
   for i in range(len(card_collection[rarity])):
       if card_collection[rarity][i] + card_collection[f'Golden {rarity}'][i] >= 2:
           completion += 2
       elif card_collection[rarity][i] + card_collection[f'Golden {rarity}'][i] == 1:
           completion += 1
       elif card_collection[rarity][i] + card_collection[f'Golden {rarity}'][i] == 0:
           completion += 0
 
   return completion
 
def set_collection():
 
   # Variables
   tries = 1000
   pity = 0
 
   # List counters
   packs_needed = []
   pack_dust = []
   legendary_array = []
   total_array = []
   total_commons = []
  
   # Calculations
   for i in range(tries):
       if i % 100 == 0:
           print(str(round(100*i/tries, 0)) + '%...')
       collection_incomplete = True
       pack_counter = 0
       card_collection = copy.deepcopy(card_collection_template)
       while collection_incomplete:
           pack_counter += 1
           pity = 0
           if pack_counter == 10 and sum(card_collection['Legendary']) == 0:
               pity = 1
           pack = create_pack(pity)
           for card in pack:
               card_collection[card.rarity][card.card_id] += 1
           card_collection = no_dupes(card_collection)
           duplicate_dust = calc_duplicate_dust(card_collection)
           remaining_dust = calc_remaining_dust(card_collection)
           if duplicate_dust + 4800 >= remaining_dust: # Three free legends
               collection_incomplete = False
       legendary_array.append(sum(card_collection['Legendary']))
       pack_dust.append(duplicate_dust / pack_counter)
       packs_needed.append(pack_counter)
 
   #Diagnosis Variables
       totalcommons = sum(card_collection['Common'])
       totalrares = sum(card_collection['Rare'])
       totalepics = sum(card_collection['Epic'])
       totallegends = sum(card_collection['Legendary'])
       totalgolds = sum(card_collection['Golden Common']) + sum(card_collection['Golden Rare']) + sum(card_collection['Golden Epic']) + sum(card_collection['Golden Legendary']) 
       totalcards = totalcommons + totalrares + totalepics + totallegends + totalgolds
       total_commons.append(totalcommons)
       total_array.append(totalcards)
 
   # Print Screen
   print('Stats based on ' + str(tries) + ' tries')
   print('Average Packs required: ' + str(round(sum(packs_needed) / tries, 1)))
   print('Average Dust per pack: ' + str(round(sum(pack_dust) / tries, 1)))
 
   #Diagnostic Prints
##    print(f'Last duplicate dust: {duplicate_dust}')
##    print(f'Last remaining dust: {remaining_dust}')
##    print(f'Card collection: {card_collection}')
##    print(f'Total commons: {totalcommons}')
##    print(f'Total rares: {totalrares}')
##    print(f'Total epics: {totalepics}')
##    print(f'Total legendaries: {totallegends}')
  
 
def set_packs(total_packs):
 
   # Variables
   tries = 5000
 
   # List counters
   common_array = []
   rare_array = []
   epic_array = []
   legendary_array = []
   dust_array = []
   pack_value = []
   total_array = []
   total_commons = []
 
   # Calculations
   for i in range(tries):
       if i % 1000 == 0:
           print(str(round(100*i/tries, 0)) + '%...')
       pack_counter = 0
       k = 0
       card_collection = copy.deepcopy(card_collection_template)
       first_pack = random.randint(1,10)
       while k < total_packs:
           pity = 0
           pack_counter += 1
           if pack_counter == first_pack and sum(card_collection['Legendary']) == 0:
               pity = 1
           pack = create_pack(pity)
           for card in pack:
               card_collection[card.rarity][card.card_id] += 1
           k += 1
      
       card_collection = no_dupes(card_collection)
       commons = count_rarity(card_collection, 'Common')
       rares = count_rarity(card_collection, 'Rare')
       epics = count_rarity(card_collection, 'Epic')
       legendaries = sum(card_collection['Legendary']) + sum(card_collection['Golden Legendary'])
       duplicate_dust = calc_duplicate_dust(card_collection)
       common_array.append(commons)
       rare_array.append(rares)
       epic_array.append(epics)
       legendary_array.append(legendaries)
       dust_array.append(duplicate_dust)
 
       #Diagnosis Variables
       totalcommons = sum(card_collection['Common'])
       totalrares = sum(card_collection['Rare'])
       totalepics = sum(card_collection['Epic'])
       totallegends = sum(card_collection['Legendary'])
       totalgolds = sum(card_collection['Golden Common']) + sum(card_collection['Golden Rare']) + sum(card_collection['Golden Epic']) + sum(card_collection['Golden Legendary']) 
       totalcards = totalcommons + totalrares + totalepics + totallegends + totalgolds
       total_commons.append(totalcommons)
       total_array.append(totalcards)
 
      
   # Print Screen
   print(f'Stats Based on {tries} tries')
   print(f'For a collection made from {str(total_packs)} packs opened')
   print(f'Average Common completion: {str(round(sum(common_array) / tries, 1))} / {global_common_count * 2}')
   print(f'Average Rare completion: {str(round(sum(rare_array) / tries, 1))} / {global_rare_count * 2}')
   print(f'Average Epic completion: {str(round(sum(epic_array) / tries, 1))} / {global_epic_count * 2}')
   print(f'Average Legendary completion: {str(round(sum(legendary_array) / tries, 1))} / {global_legendary_count}') #Free Legend
   print('Average Dust in bank: ' + str(round(sum(dust_array) / tries, 1)))
 
   return {
       'Common':sum(common_array) / tries,
       'Rare': sum(rare_array) / tries,
       'Epic': sum(epic_array) / tries,
       'Legendary': sum(legendary_array) / tries
   }
 
 
def get_data():
   data = {}
   for r in rarities:
       data[r] = []
 
   for p in range(30):
       d = set_packs(p*10)
       for r in rarities:
           data[r].append(d[r])
  
   for r in rarities:
       print(r,'\n', data[r])
 
   #Diagnostic prints
##    print(total_array[-100:])
##    print(total_commons[-100:])
##    print(common_array)
##    print(card_collection)
##    print(sum(total_commons) / sum(total_array)) #common drop rate
 
def main():
 
   print('For set packs, input 1, for set collection, input 2, 3: plot, q to quit')
   userchoice = input()
   if userchoice == '1':
       print('How many packs should be simulated?')
       pack_count = int(input())
       set_packs(pack_count)
   if userchoice == '2':
       set_collection()
  
   if userchoice == '3':
       get_data()
 
   if userchoice == 'q':
       return
 
   main()
 
if __name__ == "__main__":
   main()
 
# Version Update
   # 1.0 Working
   # 1.1 Includes new pity on 10, and no dupes
   # 1.2 Added menu and set packs option - error of enumerate starting at zero
   # 1.3 Globalized variables, includes golden cards in completion and added no dupes to all card types
   # 1.4 Full collections now take into account owned goldens.
 

