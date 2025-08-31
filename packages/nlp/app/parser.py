import json
from pathlib import Path

synonyms = json.loads((Path(__file__).parent / 'synonyms_ur_en.json').read_text())
SYNONYM_MAP = {s.lower(): en for en, syns in synonyms.items() for s in syns}

UNIT_MAP = {
  'kg': ['kg', 'kilogram'],
  'g': ['g', 'gram'],
  'L': ['l', 'liter'],
  'mL': ['ml', 'milliliter'],
  'item': ['item', 'pcs', 'piece']
}
UNIT_SYNONYMS = {s: u for u, syns in UNIT_MAP.items() for s in syns}

def normalize_unit(token: str):
  return UNIT_SYNONYMS.get(token.lower(), 'item')

def parse_list(text: str, locale: str):
  items = []
  for raw_line in text.splitlines():
    line = raw_line.strip()
    if not line:
      continue
    parts = line.split()
    qty = parts[0]
    if len(parts) > 2:
      unit = normalize_unit(parts[1])
      name = ' '.join(parts[2:])
    else:
      unit = 'item'
      name = ' '.join(parts[1:])
    name_lower = name.lower()
    name = SYNONYM_MAP.get(name_lower, name)
    items.append({'name': name, 'quantity': qty, 'unit': unit})
  return items
