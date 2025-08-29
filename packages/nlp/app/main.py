from fastapi import FastAPI
from .parser import parse_list

app = FastAPI()

@app.post('/parse')
async def parse(data: dict):
  items = parse_list(data.get('raw_text', ''), data.get('locale', 'en'))
  return { 'items': items }
