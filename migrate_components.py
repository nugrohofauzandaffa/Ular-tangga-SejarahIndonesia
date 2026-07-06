import sys

# 1. Migrate Board
with open('src/app/prototype/gameplay/components/PrototypeBoard.tsx', 'r', encoding='utf-8') as f:
    board_proto = f.read()

board_proto = board_proto.replace('import PrototypeTile from \'./PrototypeTile\';', 'import Tile from \'./Tile\';')
board_proto = board_proto.replace('<PrototypeTile', '<Tile')
board_proto = board_proto.replace('export default function PrototypeBoard', 'export default function Board')
with open('src/components/papan/Board.tsx', 'w', encoding='utf-8') as f:
    f.write(board_proto)

# 2. Migrate Tile
with open('src/app/prototype/gameplay/components/PrototypeTile.tsx', 'r', encoding='utf-8') as f:
    tile_proto = f.read()

tile_proto = tile_proto.replace('export default function PrototypeTile', 'export default function Tile')
with open('src/components/papan/Tile.tsx', 'w', encoding='utf-8') as f:
    f.write(tile_proto)

# 3. Migrate HUD
with open('src/app/prototype/gameplay/components/PrototypeHUD.tsx', 'r', encoding='utf-8') as f:
    hud_proto = f.read()

hud_proto = hud_proto.replace('export function PrototypeHUD', 'export function HUD')
with open('src/components/ui/HUD.tsx', 'w', encoding='utf-8') as f:
    f.write(hud_proto)

# 4. Migrate Dice
with open('src/app/prototype/gameplay/components/PrototypeDice.tsx', 'r', encoding='utf-8') as f:
    dice_proto = f.read()

dice_proto = dice_proto.replace('export function PrototypeDice', 'export function Dice')
with open('src/components/dice/Dice.tsx', 'w', encoding='utf-8') as f:
    f.write(dice_proto)

