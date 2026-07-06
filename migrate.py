import sys

with open('src/app/prototype/gameplay/components/PrototypeGameLayout.tsx', 'r', encoding='utf-8') as f:
    proto = f.read()

proto = proto.replace('import PrototypeBoard from \'./PrototypeBoard\';', 'import Board from \'./papan/Board\';')
proto = proto.replace('import { PrototypeDice } from \'./PrototypeDice\';', 'import { Dice } from \'./dice/Dice\';')
proto = proto.replace('import { PrototypeHUD } from \'./PrototypeHUD\';', 'import { HUD } from \'./ui/HUD\';')

proto = proto.replace('<PrototypeBoard', '<Board')
proto = proto.replace('<PrototypeDice', '<Dice')
proto = proto.replace('<PrototypeHUD', '<HUD')

proto = proto.replace('export default function PrototypeGameLayout', 'export default function GameLayout')

with open('src/components/GameLayout.tsx', 'w', encoding='utf-8') as f:
    f.write(proto)

