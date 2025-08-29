import sys, os
sys.path.append(os.path.dirname(os.path.dirname(__file__)))
from app.parser import parse_list

def test_parse():
    items = parse_list('1 kg atta', 'en')
    assert items[0]['name'] == 'flour'
