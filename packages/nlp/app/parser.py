import json
from pathlib import Path

synonyms = json.loads((Path(__file__).parent / 'synonyms_ur_en.json').read_text())

UNIT_MAP = {
  'kg': ['kg', 'kilogram'],
  'g': ['g', 'gram'],
  'L': ['l', 'liter'],
  'mL': ['ml', 'milliliter'],
  'item': ['item', 'pcs', 'piece']
}

def normalize_unit(token: str):
  for unit, arr in UNIT_MAP.items():
    if token.lower() in arr:
      return unit
  return 'item'

def parse_list(text: str, locale: str):
  lines = [l.strip() for l in text.split('\n') if l.strip()]
  items = []
  for line in lines:
    parts = line.split()
    qty = parts[0]
    unit = normalize_unit(parts[1]) if len(parts) > 2 else 'item'
    name = ' '.join(parts[2:]) if len(parts) > 2 else ' '.join(parts[1:])
    for en, syns in synonyms.items():
      if name.lower() in [s.lower() for s in syns]:
        name = en
        break
    items.append({'name': name, 'quantity': qty, 'unit': unit})
  return items
