// Curated team archetypes & best-partner pairings (original summaries, current 6.x meta).
// Keys are app character slugs; validated in build-data.mjs.

export const teamData = {
  // ================= CURRENT TOP META =================
  mavuika: {
    partners: [['citlali', 'Her signature partner — RES shred, shield, and Fighting Spirit'], ['xilonen', 'DEF shred + healing + Nightsoul battery'], ['bennett', 'ATK buff stacked under her Burst'], ['escoffier', 'Melt variant — dual shred + Cryo app']],
    teams: [
      { name: 'Mavuika Melt (top meta)', members: ['mavuika', 'citlali', 'bennett', 'escoffier'], desc: 'The current premier Melt comp: Citlali shreds and applies Cryo, Bennett buffs, Escoffier adds dual shred and more Cryo.' },
      { name: 'Mavuika Hypercarry', members: ['mavuika', 'citlali', 'bennett', 'iansan'], desc: 'C6 Iansan (or Xilonen) in the flex slot pumps her ATK sky-high while Citlali shreds.' },
      { name: 'Mavuika Xilonen core', members: ['mavuika', 'citlali', 'xilonen', 'bennett'], desc: 'The all-Natlan engine — double shred, healing, and endless Fighting Spirit.' },
      { name: 'Mavuika Vape', members: ['mavuika', 'furina', 'xilonen', 'citlali'], desc: 'Furina buffs while her Hydro app vaporizes bike hits; Xilonen heals off the drain.' },
    ],
  },
  skirk: {
    partners: [['escoffier', 'Made for each other — dual Cryo/Hydro shred + Void Rifts'], ['furina', 'Hydro rifts + the biggest DMG buff in the game'], ['shenhe', 'Cryo amp quills for the premium slot']],
    teams: [
      { name: 'Skirk Premium Freeze', members: ['skirk', 'furina', 'escoffier', 'shenhe'], desc: 'The current top Freeze team: Furina + Escoffier feed rifts and shred while Shenhe amps every hit.' },
      { name: 'Skirk Freeze (Yelan flex)', members: ['skirk', 'furina', 'escoffier', 'yelan'], desc: 'Yelan in the flex slot adds off-field Hydro damage and rift generation.' },
      { name: 'Neuvillette-Skirk quickswap', members: ['neuvillette', 'skirk', 'furina', 'escoffier'], desc: 'Neuvillette drives on-field while Skirk bursts between beams — both are buffed by the same core.' },
      { name: 'Skirk budget Freeze', members: ['skirk', 'xingqiu', 'rosaria', 'diona'], desc: 'F2P-friendly rift feeders with Cryo resonance and a shield.' },
    ],
  },
  varesa: {
    partners: [['iansan', 'Her dedicated buffer — movement charges the ATK buff'], ['chevreuse', 'Overload shred/buff engine'], ['durin', 'Off-field Pyro for Overload']],
    teams: [
      { name: 'Varesa Overload (top meta)', members: ['varesa', 'chevreuse', 'iansan', 'durin'], desc: 'The current best Varesa comp: Chevreuse converts Overload into shred and ATK while Iansan feeds her plunges.' },
      { name: 'Varesa Overload (Xiangling)', members: ['varesa', 'chevreuse', 'iansan', 'xiangling'], desc: 'Budget Pyro slot — Pyronado keeps Overload rolling.' },
      { name: 'Varesa Hypercarry', members: ['varesa', 'iansan', 'zhongli', 'fischl'], desc: 'Comfort variant: Zhongli keeps her airborne loops uninterrupted.' },
      { name: 'Varesa Furina plunge', members: ['varesa', 'furina', 'iansan', 'jean'], desc: 'Furina buff with team healing to ramp Fanfare.' },
    ],
  },
  mualani: {
    partners: [['citlali', 'Vape enabler with 20% Hydro/Pyro shred'], ['sucrose', 'Shred + EM share for bigger bites'], ['mavuika', 'Premium off-field Pyro']],
    teams: [
      { name: 'Mualani Vape (current)', members: ['mualani', 'sucrose', 'mona', 'mavuika'], desc: 'The modern comp: Sucrose shreds, Mona buffs, Mavuika applies Pyro for every Sharky Bite to vaporize.' },
      { name: 'Mualani Citlali core', members: ['mualani', 'citlali', 'iansan', 'kachina'], desc: 'All-Natlan: Citlali shreds and enables Vape, Iansan buffs, Kachina holds Scroll.' },
      { name: 'Mualani Durin Vape', members: ['mualani', 'sucrose', 'citlali', 'durin'], desc: 'Durin as the low-maintenance Pyro applier behind VV shred.' },
      { name: 'Mualani comfort', members: ['mualani', 'xiangling', 'bennett', 'zhongli'], desc: 'Classic National pieces with shield comfort.' },
    ],
  },
  flins: {
    partners: [['ineffa', 'Designed duo — battery, shield and Lunar-Charged buffs'], ['furina', 'Premium Hydro app + DMG buff'], ['aino', 'Budget Hydro enabler from Nod-Krai']],
    teams: [
      { name: 'Flins Lunar-Charged (top)', members: ['flins', 'ineffa', 'furina', 'xilonen'], desc: 'The premium core: Ineffa batteries and buffs, Furina applies Hydro, Xilonen shreds and heals.' },
      { name: 'Flins budget Lunar', members: ['flins', 'ineffa', 'aino', 'sucrose'], desc: 'The accessible version — Aino sustains Hydro, Sucrose shreds and shares EM.' },
      { name: 'Flins Columbina', members: ['flins', 'ineffa', 'columbina', 'furina'], desc: 'Columbina amplifies the Lunar reactions the whole team generates.' },
      { name: 'Flins Electro-Charged', members: ['flins', 'yelan', 'fischl', 'kaedehara-kazuha'], desc: 'Classic EC shell if you lack the Nod-Krai supports.' },
    ],
  },
  ineffa: {
    partners: [['flins', 'Lunar-Charged core duo'], ['neuvillette', 'Enables his Lunar-Charged hypercarry teams'], ['columbina', 'Moonsign support stack']],
    teams: [
      { name: 'Neuvillette Lunar-Charged', members: ['neuvillette', 'ineffa', 'furina', 'kaedehara-kazuha'], desc: 'Ineffa\'s off-field Electro turns Neuvillette\'s Hydro into constant Lunar-Charged procs — his current best team.' },
      { name: 'Flins core', members: ['flins', 'ineffa', 'furina', 'xilonen'], desc: 'Her designed pairing with full premium support.' },
    ],
  },
  columbina: {
    partners: [['nefer', 'Nod-Krai core — she amplifies Nefer\'s Lunar-Blooms'], ['lauma', 'Moonsign support stack'], ['flins', 'Lunar-Charged amplification']],
    teams: [
      { name: 'Columbina Lunar-Bloom', members: ['columbina', 'nefer', 'lauma', 'furina'], desc: 'The current #1 team in the game: triple Moonsign amplification on constant Lunar-Blooms.' },
      { name: 'Columbina Lunar-Charged', members: ['columbina', 'flins', 'ineffa', 'furina'], desc: 'The Electro flavor — she amplifies Flins\' empowered strikes.' },
      { name: 'Columbina Neuvillette', members: ['neuvillette', 'columbina', 'ineffa', 'furina'], desc: 'She buffs Ineffa\'s Lunar-Charged while Neuvillette beams away.' },
      { name: 'Columbina Zibai', members: ['columbina', 'zibai', 'illuga', 'furina'], desc: 'The newest Nod-Krai pairing as more Moonsign carries release.' },
    ],
  },
  nefer: {
    partners: [['lauma', 'Her best support — Lunar-Bloom amplification'], ['columbina', 'Second Moonsign amplifier'], ['furina', 'Hydro app + buff']],
    teams: [
      { name: 'Nefer Lunar-Bloom (top)', members: ['nefer', 'lauma', 'columbina', 'furina'], desc: 'The strongest current comp: every bloom is moon-amplified twice and Furina buffs it all.' },
      { name: 'Nefer core (no Columbina)', members: ['nefer', 'lauma', 'furina', 'yelan'], desc: 'Double Hydro sustains blooms; Lauma amplifies.' },
      { name: 'Nefer budget', members: ['nefer', 'lauma', 'aino', 'collei'], desc: 'Nod-Krai 4★ Hydro plus budget Dendro resonance.' },
      { name: 'Nefer Hyperbloom hybrid', members: ['nefer', 'furina', 'kuki-shinobu', 'nahida'], desc: 'Kuki detonates leftover cores while Nefer works.' },
    ],
  },
  lauma: {
    partners: [['nefer', 'The premier Lunar-Bloom pairing'], ['columbina', 'Moonsign amplifier stack'], ['neuvillette', 'Shreds Dendro for his Hyperbloom variant']],
    teams: [
      { name: 'Lunar-Bloom core', members: ['nefer', 'lauma', 'columbina', 'furina'], desc: 'Current apex team — Lauma is its engine.' },
      { name: 'Lauma Hyperbloom', members: ['raiden-shogun', 'lauma', 'furina', 'zhongli'], desc: 'She upgrades classic Hyperbloom with EM buffs and Dendro shred.' },
      { name: 'Lauma Burgeon', members: ['traveler-pyro', 'lauma', 'furina', 'baizhu'], desc: 'Dendro resonance EM stacking for Burgeon pops.' },
    ],
  },
  neuvillette: {
    partners: [['ineffa', 'Lunar-Charged upgrade — his current best partner'], ['furina', 'Hydro resonance + huge DMG buff'], ['escoffier', 'Freeze variant dual shred']],
    teams: [
      { name: 'Neuvillette Lunar-Charged', members: ['neuvillette', 'ineffa', 'furina', 'kaedehara-kazuha'], desc: 'His current best: Ineffa\'s Electro makes every beam tick Lunar-Charged.' },
      { name: 'Neuvillette Freeze', members: ['neuvillette', 'escoffier', 'furina', 'citlali'], desc: 'Escoffier + Citlali dual shred with Freeze lockdown — his second-best comp.' },
      { name: 'Neuvillette Hypercarry', members: ['neuvillette', 'furina', 'kaedehara-kazuha', 'baizhu'], desc: 'The classic that still clears everything.' },
      { name: 'Neuvillette Hyperbloom', members: ['neuvillette', 'lauma', 'furina', 'kuki-shinobu'], desc: 'Lauma shreds Dendro RES to boost the bloom layer.' },
    ],
  },
  furina: {
    partners: [['neuvillette', 'Hydro DMG + Fanfare synergy'], ['skirk', 'Freeze core rift feeder'], ['xianyun', 'Team-wide heal charges Fanfare fast'], ['escoffier', 'Freeze duo — her heals cap Fanfare']],
    teams: [
      { name: 'Neuvillette taser', members: ['neuvillette', 'furina', 'ineffa', 'kaedehara-kazuha'], desc: 'Her strongest current home — double Hydro + Lunar-Charged.' },
      { name: 'Skirk Freeze', members: ['skirk', 'furina', 'escoffier', 'shenhe'], desc: 'Core buffer of the premium Freeze comp.' },
      { name: 'Vapemelt', members: ['mavuika', 'furina', 'citlali', 'xilonen'], desc: 'Citlali\'s passive buffs both her and Mavuika; Xilonen heals the drain.' },
      { name: 'Furina plunge', members: ['gaming', 'furina', 'xianyun', 'bennett'], desc: 'Xianyun heals the whole team, ramping Fanfare while enabling plunges.' },
    ],
  },
  escoffier: {
    partners: [['skirk', 'Made for each other'], ['furina', 'The established Freeze duo'], ['neuvillette', 'Freeze + dual shred'], ['mavuika', 'Melt Cryo applier']],
    teams: [
      { name: 'Skirk Premium Freeze', members: ['skirk', 'furina', 'escoffier', 'shenhe'], desc: 'Her defining team.' },
      { name: 'Neuvillette Freeze', members: ['neuvillette', 'escoffier', 'furina', 'citlali'], desc: 'Dual shred makes frozen enemies melt to the beam.' },
      { name: 'Mavuika Melt', members: ['mavuika', 'citlali', 'bennett', 'escoffier'], desc: 'She feeds Melt with Cryo while shredding.' },
      { name: 'Ayaka Freeze upgrade', members: ['kamisato-ayaka', 'escoffier', 'sangonomiya-kokomi', 'shenhe'], desc: 'Slots straight into classic Freeze as a massive upgrade.' },
    ],
  },
  arlecchino: {
    partners: [['yelan', 'Off-field Hydro for Vaporize'], ['zhongli', 'Shield — she cannot be healed easily'], ['xilonen', 'Shred + heal without breaking BoL'], ['citlali', 'Shield + dual shred for Vape']],
    teams: [
      { name: 'Arlecchino Vape', members: ['arlecchino', 'yelan', 'xingqiu', 'zhongli'], desc: 'Double Hydro Vaporize with shield comfort — still her best general comp.' },
      { name: 'Arlecchino Citlali Vape', members: ['arlecchino', 'furina', 'citlali', 'jean'], desc: 'Modern variant: Citlali shreds both her Pyro and Furina\'s Hydro.' },
      { name: 'Arlecchino Overload', members: ['arlecchino', 'chevreuse', 'fischl', 'bennett'], desc: 'Chevreuse converts Overload into a buffing engine.' },
      { name: 'Arlecchino Burnvape', members: ['arlecchino', 'emilie', 'yelan', 'zhongli'], desc: 'Burning ticks feed Emilie while Arlecchino vapes.' },
    ],
  },
  'raiden-shogun': {
    partners: [['nahida', 'Quicken core / EM buff'], ['lauma', 'Modern Hyperbloom upgrade'], ['bennett', 'ATK buff + heal for hypercarry'], ['chevreuse', 'Overload RES shred']],
    teams: [
      { name: 'Raiden Hyperbloom (Lauma)', members: ['raiden-shogun', 'lauma', 'furina', 'zhongli'], desc: 'Lauma\'s EM buffs and Dendro shred modernize her best team.' },
      { name: 'Raiden National', members: ['raiden-shogun', 'xiangling', 'xingqiu', 'bennett'], desc: 'The classic. Still clears everything on a budget.' },
      { name: 'Raiden Overload', members: ['raiden-shogun', 'chevreuse', 'fischl', 'bennett'], desc: 'Pyro+Electro only — Chevreuse shreds RES and pumps ATK.' },
      { name: 'Raiden Hypercarry', members: ['raiden-shogun', 'kujou-sara', 'kaedehara-kazuha', 'bennett'], desc: 'Everything buffs one giant Burst.' },
    ],
  },
  citlali: {
    partners: [['mavuika', 'Signature pairing — shred + Fighting Spirit'], ['mualani', 'Vape enabler with dual shred'], ['furina', 'Her passive buffs them both']],
    teams: [
      { name: 'Mavuika Melt', members: ['mavuika', 'citlali', 'bennett', 'escoffier'], desc: 'Her defining team as shredder and shielder.' },
      { name: 'Mualani Vape', members: ['mualani', 'citlali', 'iansan', 'kachina'], desc: 'Cryo app for reverse-vape Sharky Bites.' },
      { name: 'Neuvillette Freeze', members: ['neuvillette', 'escoffier', 'furina', 'citlali'], desc: 'EM battery + shred in the four-slot.' },
    ],
  },
  xilonen: {
    partners: [['mavuika', 'Core Natlan pairing'], ['flins', 'Shreds Electro for Lunar-Charged'], ['navia', 'Geo partner + universal shred'], ['neuvillette', 'Shred + heal in one slot']],
    teams: [
      { name: 'Mavuika core', members: ['mavuika', 'citlali', 'xilonen', 'bennett'], desc: 'Her most premium home.' },
      { name: 'Flins Lunar-Charged', members: ['flins', 'ineffa', 'furina', 'xilonen'], desc: 'Universal shred slots straight into the newest meta.' },
      { name: 'Navia Geo core', members: ['navia', 'xilonen', 'furina', 'bennett'], desc: 'Xilonen shreds while Furina and Bennett buff the shotgun.' },
    ],
  },
  // ================= ESTABLISHED META =================
  'hu-tao': {
    partners: [['xingqiu', 'The classic Vape enabler'], ['yelan', 'Double Hydro upgrade'], ['furina', 'Her HP drain charges Fanfare'], ['citlali', 'Modern shield + dual shred']],
    teams: [
      { name: 'Hu Tao Double Hydro', members: ['hu-tao', 'yelan', 'xingqiu', 'zhongli'], desc: 'Vaporize every charged attack with total comfort.' },
      { name: 'Hu Tao Citlali Vape', members: ['hu-tao', 'yelan', 'citlali', 'furina'], desc: 'Citlali shreds and shields; Furina buffs off the HP drain.' },
      { name: 'Hu Tao Vape-melt', members: ['hu-tao', 'yelan', 'rosaria', 'zhongli'], desc: 'Cryo adds melt hits between vapes.' },
    ],
  },
  'kamisato-ayaka': {
    partners: [['escoffier', 'Massive Freeze upgrade — dual shred + Cryo sub-DPS'], ['shenhe', 'Cryo DMG amp made for her'], ['sangonomiya-kokomi', 'Freeze enabler + heal']],
    teams: [
      { name: 'Ayaka Modern Freeze', members: ['kamisato-ayaka', 'escoffier', 'sangonomiya-kokomi', 'shenhe'], desc: 'Escoffier\'s shred modernizes the classic Freeze core.' },
      { name: 'Ayaka Classic Freeze', members: ['kamisato-ayaka', 'shenhe', 'sangonomiya-kokomi', 'kaedehara-kazuha'], desc: 'The definitive old-school Freeze team — still strong.' },
    ],
  },
  ganyu: {
    partners: [['shenhe', 'Cryo amp for charged shots'], ['furina', 'Modern melt buff'], ['zhongli', 'Uninterrupted aim time']],
    teams: [
      { name: 'Ganyu Melt', members: ['ganyu', 'xiangling', 'zhongli', 'bennett'], desc: 'Melt charged shots for huge single hits.' },
      { name: 'Ganyu Freeze', members: ['ganyu', 'sangonomiya-kokomi', 'shenhe', 'kaedehara-kazuha'], desc: 'AoE freeze with Frostflake rain.' },
    ],
  },
  nahida: {
    partners: [['raiden-shogun', 'Quicken/Hyperbloom engine'], ['nilou', 'Bloom core'], ['yae-miko', 'Aggravate duo']],
    teams: [
      { name: 'Nahida Hyperbloom', members: ['nahida', 'xingqiu', 'kuki-shinobu', 'zhongli'], desc: 'Kuki pops seeds; Nahida drives everything.' },
      { name: 'Nilou Bloom', members: ['nilou', 'nahida', 'sangonomiya-kokomi', 'yaoyao'], desc: 'Bountiful cores do all the damage.' },
      { name: 'Spread Keqing', members: ['keqing', 'nahida', 'fischl', 'kaedehara-kazuha'], desc: 'Aggravate/Spread with constant off-field Dendro.' },
    ],
  },
  alhaitham: {
    partners: [['nahida', 'Dendro resonance + EM buff'], ['kuki-shinobu', 'Hyperbloom trigger + heal'], ['lauma', 'Modern EM amplifier']],
    teams: [
      { name: 'Alhaitham Quickbloom', members: ['alhaitham', 'nahida', 'kuki-shinobu', 'fischl'], desc: 'Spread + Hyperbloom hybrid — top-tier and flexible.' },
      { name: 'Alhaitham Lauma', members: ['alhaitham', 'lauma', 'furina', 'kuki-shinobu'], desc: 'Lauma\'s shred and EM buffs raise his Spread ceiling.' },
    ],
  },
  nilou: {
    partners: [['nahida', 'Bloom core requirement'], ['lauma', 'Lunar-Bloom era upgrade'], ['sangonomiya-kokomi', 'Hydro app + heals Bloom self-damage']],
    teams: [
      { name: 'Nilou Bloom', members: ['nilou', 'nahida', 'sangonomiya-kokomi', 'yaoyao'], desc: 'Hydro+Dendro only — bountiful cores do the damage.' },
      { name: 'Nilou Lauma Bloom', members: ['nilou', 'lauma', 'furina', 'nahida'], desc: 'Lauma amplifies the bloom line for the modern version.' },
    ],
  },
  cyno: {
    partners: [['odette', 'His new 7.0 Stellar-Conduct enabler — a real meta comeback'], ['nahida', 'Quicken uptime through his long Burst'], ['baizhu', 'Dendro + shield + heal in one']],
    teams: [
      { name: 'Stellar-Conduct (new best)', members: ['cyno', 'odette', 'yae-miko', 'alyosha'], desc: 'His long on-field Burst is perfect for Stellar-Conduct; Yae also batteries him.' },
      { name: 'Cyno Quickbloom', members: ['cyno', 'nahida', 'furina', 'baizhu'], desc: 'Aggravate plus bloom seeds during his extended Burst.' },
    ],
  },
  xiao: {
    partners: [['faruzan', 'Anemo shred + DMG, made for him'], ['xianyun', 'Plunge buffs + heal'], ['furina', 'DMG buff']],
    teams: [
      { name: 'Premium Xiao', members: ['xiao', 'faruzan', 'furina', 'xianyun'], desc: 'Every slot amplifies his plunge loop.' },
    ],
  },
  wanderer: {
    partners: [['faruzan', 'The Anemo buffer he was released with'], ['bennett', 'ATK + heal']],
    teams: [
      { name: 'Wanderer Hypercarry', members: ['wanderer', 'faruzan', 'bennett', 'zhongli'], desc: 'Fly and shoot with full buffs and shield.' },
    ],
  },
  'arataki-itto': {
    partners: [['gorou', 'DEF buff + Geo DMG, his best friend'], ['albedo', 'Off-field Geo damage']],
    teams: [
      { name: 'Mono Geo Itto', members: ['arataki-itto', 'gorou', 'albedo', 'zhongli'], desc: 'The definitive Geo team — big Ushi energy.' },
    ],
  },
  navia: {
    partners: [['furina', 'Crystallize shards + DMG buff'], ['xilonen', 'Shred + heal'], ['bennett', 'ATK buff + Pyro shards']],
    teams: [
      { name: 'Navia Furina', members: ['navia', 'furina', 'xiangling', 'bennett'], desc: 'Two elements feed shards while buffing the cannon.' },
      { name: 'Navia Xilonen', members: ['navia', 'xilonen', 'fischl', 'bennett'], desc: 'Xilonen shred + heal makes her smoothest team.' },
    ],
  },
  clorinde: {
    partners: [['fischl', 'Electro resonance + Oz damage'], ['chevreuse', 'Overload package'], ['sigewinne', 'Skill DMG buff + heal'], ['ineffa', 'Modern battery + shield']],
    teams: [
      { name: 'Clorinde Aggravate', members: ['clorinde', 'nahida', 'fischl', 'kaedehara-kazuha'], desc: 'Quicken-fueled pistol volleys.' },
      { name: 'Clorinde Overload', members: ['clorinde', 'chevreuse', 'fischl', 'bennett'], desc: 'Chevreuse turns Overload pops into buffs.' },
      { name: 'Clorinde Ineffa', members: ['clorinde', 'ineffa', 'furina', 'kaedehara-kazuha'], desc: 'Ineffa shields and batteries while Hydro enables Lunar-Charged.' },
    ],
  },
  eula: {
    partners: [['raiden-shogun', 'Superconduct + energy for her Burst'], ['furina', 'Physical DMG gets the buff too']],
    teams: [
      { name: 'Eula Raiden', members: ['eula', 'raiden-shogun', 'rosaria', 'bennett'], desc: 'Superconduct shreds Physical RES for Lightfall Sword.' },
    ],
  },
  yoimiya: {
    partners: [['yelan', 'Off-field Hydro for arrow Vapes'], ['yun-jin', 'Normal Attack DMG buff made for her']],
    teams: [
      { name: 'Yoimiya Vape', members: ['yoimiya', 'yelan', 'yun-jin', 'zhongli'], desc: 'Every arrow vaporizes with NA buffs stacked.' },
    ],
  },
  keqing: {
    partners: [['fischl', 'Electro battery + Oz'], ['nahida', 'Aggravate enabler']],
    teams: [
      { name: 'Keqing Aggravate', members: ['keqing', 'fischl', 'nahida', 'kaedehara-kazuha'], desc: 'Modern Keqing — Aggravate made her great again.' },
    ],
  },
  kinich: {
    partners: [['emilie', 'Burning specialist duo'], ['citlali', 'Shield + shred that survives Burning'], ['dehya', 'Off-field Pyro that survives Burning']],
    teams: [
      { name: 'Kinich Burning', members: ['kinich', 'emilie', 'dehya', 'bennett'], desc: 'Keep everything on fire; Emilie and Kinich both profit.' },
      { name: 'Kinich Burnmelt', members: ['kinich', 'emilie', 'citlali', 'bennett'], desc: 'Citlali\'s shred boosts the whole Burning package.' },
    ],
  },
  chasca: {
    partners: [['ororon', 'Off-field Electro + Nightsoul synergy'], ['citlali', 'Cryo bullets + shred'], ['furina', 'Hydro bullets + the big buff']],
    teams: [
      { name: 'Chasca Multi-element', members: ['chasca', 'ororon', 'citlali', 'bennett'], desc: 'Three convertible elements = rainbow bullets every volley.' },
      { name: 'Chasca Furina', members: ['chasca', 'furina', 'ororon', 'citlali'], desc: 'Furina buffs and converts bullets to Hydro.' },
    ],
  },
  lyney: {
    partners: [['bennett', 'Mono Pyro core'], ['xiangling', 'Off-field Pyro damage'], ['emilie', 'Burning-adjacent buffer']],
    teams: [
      { name: 'Lyney Mono Pyro', members: ['lyney', 'xiangling', 'bennett', 'kaedehara-kazuha'], desc: 'Pyro-only party keeps his passive stacks maxed.' },
    ],
  },
  wriothesley: {
    partners: [['odette', 'Unlocks his new 7.0 Stellar-Conduct playstyle — his best buff in years'], ['furina', 'HP drain synergy + buff'], ['escoffier', 'Modern Freeze shred'], ['shenhe', 'Cryo amp']],
    teams: [
      { name: 'Stellar-Conduct (new best)', members: ['wriothesley', 'odette', 'yae-miko', 'alyosha'], desc: 'The 7.0 Stellar reaction revived him — his punches now deal Stellar-Conduct damage.' },
      { name: 'Wriothesley Freeze', members: ['wriothesley', 'escoffier', 'furina', 'charlotte'], desc: 'Escoffier\'s dual shred upgrades his freeze comp.' },
    ],
  },
  gaming: {
    partners: [['xianyun', 'Plunge enabler + heal'], ['furina', 'DMG buff charged by his self-drain']],
    teams: [
      { name: 'Gaming Plunge', members: ['gaming', 'xianyun', 'furina', 'bennett'], desc: 'The budget-friendly plunge machine at full power.' },
    ],
  },
  xianyun: {
    partners: [['gaming', 'Plunge DPS she enables'], ['xiao', 'Premium plunge partner'], ['furina', 'Team heal charges Fanfare']],
    teams: [],
  },
  emilie: {
    partners: [['kinich', 'Burning duo'], ['arlecchino', 'Strong Pyro applier for Burning'], ['mavuika', 'Premium Burning enabler']],
    teams: [
      { name: 'Emilie Burnvape', members: ['arlecchino', 'emilie', 'yelan', 'zhongli'], desc: 'Burning ticks feed Emilie while Arlecchino vapes.' },
    ],
  },
  chiori: {
    partners: [['navia', 'Geo duo — extra doll trigger'], ['arataki-itto', 'Mono Geo slot upgrade'], ['neuvillette', 'Off-field damage that needs zero field time']],
    teams: [],
  },
  chevreuse: {
    partners: [['varesa', 'Current top Overload core'], ['raiden-shogun', 'Overload classic'], ['arlecchino', 'Overload hypercarry'], ['clorinde', 'Overload duelist']],
    teams: [],
  },
  ororon: {
    partners: [['chasca', 'Nightsoul + Electro bullets'], ['varesa', 'Off-field Electro support']],
    teams: [],
  },
  sigewinne: {
    partners: [['clorinde', 'Skill DMG buff fits her perfectly'], ['neuvillette', 'Hydro healer that buffs his beam']],
    teams: [],
  },
  iansan: {
    partners: [['varesa', 'Her designed partner'], ['mavuika', 'Natlan ATK buffer — C6 rivals premium slots']],
    teams: [],
  },
  'yae-miko': {
    partners: [['fischl', 'Double off-field Electro'], ['nahida', 'Aggravate turrets']],
    teams: [
      { name: 'Yae Aggravate', members: ['yae-miko', 'nahida', 'fischl', 'kaedehara-kazuha'], desc: 'Turrets crit for days with Quicken up.' },
    ],
  },
  tighnari: {
    partners: [['yae-miko', 'Quick-swap Spread duo'], ['fischl', 'Aggravate battery']],
    teams: [
      { name: 'Tighnari Spread', members: ['tighnari', 'yae-miko', 'fischl', 'zhongli'], desc: 'Fast rotations, big Spread-boosted arrows.' },
    ],
  },
  diluc: {
    partners: [['xingqiu', 'Vape enabler'], ['bennett', 'Pyro resonance + ATK']],
    teams: [
      { name: 'Diluc Vape', members: ['diluc', 'xingqiu', 'bennett', 'kaedehara-kazuha'], desc: 'The OG Vaporize team, still works.' },
    ],
  },
  aino: {
    partners: [['lauma', 'Budget Lunar-Bloom partner'], ['flins', 'Budget Hydro for Lunar-Charged'], ['nefer', 'Hydro app for her blooms']],
    teams: [],
  },
  freminet: {
    partners: [['fischl', 'Superconduct battery'], ['shenhe', 'Cryo buff']],
    teams: [
      { name: 'Freminet Physical', members: ['freminet', 'fischl', 'shenhe', 'diona'], desc: 'Superconduct shreds Physical RES for Pers Pressure.' },
    ],
  },
  'yumemizuki-mizuki': {
    partners: [['bennett', 'Pyro Swirl core'], ['furina', 'Hydro Swirl + buff'], ['xiangling', 'Off-field Pyro to Swirl']],
    teams: [],
  },
  charlotte: {
    partners: [['furina', 'Fontaine passive + heals Fanfare'], ['wriothesley', 'Freeze + heal']],
    teams: [],
  },
  kachina: {
    partners: [['mualani', 'Budget Natlan slot'], ['xilonen', 'Geo Nightsoul duo']],
    teams: [],
  },
  'lan-yan': {
    partners: [['mualani', 'Shield + VV shred for her'], ['chasca', 'Anemo resonance + shield']],
    teams: [],
  },
  sethos: {
    partners: [['nahida', 'Aggravate core'], ['fischl', 'Electro battery']],
    teams: [],
  },
  kirara: {
    partners: [['keqing', 'Aggravate shielder'], ['alhaitham', 'Dendro resonance + shield']],
    teams: [],
  },
  durin: {
    partners: [['varesa', 'Off-field Pyro for her top Overload team'], ['mualani', 'Low-maintenance Vape applier'], ['bennett', 'Classic Pyro core']],
    teams: [
      { name: 'Varesa Overload', members: ['varesa', 'chevreuse', 'iansan', 'durin'], desc: 'His current best home as the off-field Pyro slot.' },
    ],
  },
  zibai: {
    partners: [['columbina', 'Moonsign amplification'], ['illuga', 'Nod-Krai Geo duo']],
    teams: [
      { name: 'Zibai Nod-Krai', members: ['zibai', 'illuga', 'columbina', 'furina'], desc: 'The emerging Nod-Krai Geo core with Moonsign support.' },
      { name: 'Zibai Mono Geo', members: ['zibai', 'illuga', 'xilonen', 'zhongli'], desc: 'Crystallize-focused variant with double shred and a shield.' },
    ],
  },

  // ===== 7.0 SNEZHNAYA / STELLAR GLIMMER ERA =====
  odette: {
    partners: [
      ['sandrone', 'The premium Stellar-Conduct pairing — both act as Stellar enablers at once'],
      ['yae-miko', 'Persistent off-field Electro for constant Stellar-Conduct triggers'],
      ['alyosha', 'ATK + Stellar-Conduct buffs, healing and Electro in one slot'],
      ['wriothesley', 'She unlocks his new Stellar-Conduct on-field playstyle'],
    ],
    teams: [
      { name: 'Sandrone Stellar-Conduct (top)', members: ['sandrone', 'odette', 'yae-miko', 'alyosha'], desc: 'The strongest 7.0 team — double Stellar enablers with off-field Electro and full buffs/healing.' },
      { name: 'Wriothesley Stellar-Conduct', members: ['wriothesley', 'odette', 'yae-miko', 'alyosha'], desc: 'Odette revives Wriothesley as a Stellar-Conduct on-fielder.' },
      { name: 'Cyno Stellar-Conduct', members: ['cyno', 'odette', 'yae-miko', 'alyosha'], desc: 'Electro on-field variant — Yae feeds Cyno energy while Odette converts the reactions.' },
      { name: 'Stellar Swirl', members: ['yumemizuki-mizuki', 'odette', 'kaeya', 'sucrose'], desc: 'Mizuki is currently the only Stellar Swirl trigger; Odette supplies the Cryo Linchpin.' },
      { name: 'Budget Stellar-Conduct', members: ['kaeya', 'odette', 'fischl', 'alyosha'], desc: 'Fully F2P-friendly — Kaeya (or Cryo Traveler) on field with Oz and Alyosha support.' },
    ],
  },
  sandrone: {
    partners: [
      ['odette', 'Her Cryo Double keeps Stellar-Conduct running while Sandrone stays on field'],
      ['yae-miko', 'Off-field Electro turrets for reaction uptime'],
      ['alyosha', 'The dedicated Stellar-Conduct support — buffs, heals, Electro'],
      ['qiqi', 'Cryo Resonance + healing variant that finally gives Qiqi a meta home'],
    ],
    teams: [
      { name: 'Stellar-Conduct (top meta)', members: ['sandrone', 'odette', 'yae-miko', 'alyosha'], desc: 'The defining 7.0 team — Sandrone pioneers the Snezhnaya Stellar-Conduct reaction.' },
      { name: 'Double Cryo Resonance', members: ['sandrone', 'odette', 'yae-miko', 'qiqi'], desc: 'Qiqi brings Cryo Resonance crit rate and healing with Stellar buffs.' },
      { name: 'Budget conduct', members: ['sandrone', 'odette', 'fischl', 'diona'], desc: 'Oz for Electro, Diona for shield/heals — works on older accounts.' },
      { name: 'Furina hybrid', members: ['sandrone', 'odette', 'furina', 'alyosha'], desc: 'Furina\'s universal buff still stacks on top of Stellar damage.' },
    ],
  },
  alyosha: {
    partners: [
      ['sandrone', 'The carry he was designed to support'],
      ['odette', 'The Cryo trigger every Alyosha team needs'],
      ['cyno', 'On-field Electro that drinks his ATK + Stellar-Conduct buffs'],
      ['razor', 'Budget on-fielder — Alyosha covers heals and buffs'],
    ],
    teams: [
      { name: 'Sandrone premium', members: ['sandrone', 'odette', 'yae-miko', 'alyosha'], desc: 'His best home — he cannot start Stellar Glimmer himself, so Odette/Sandrone trigger it.' },
      { name: 'Wriothesley conduct', members: ['wriothesley', 'odette', 'yae-miko', 'alyosha'], desc: 'Comfortable Stellar-Conduct with healing built in.' },
      { name: 'Cyno conduct', members: ['cyno', 'odette', 'yae-miko', 'alyosha'], desc: 'Long on-field Electro rotations with full support coverage.' },
      { name: 'F2P conduct', members: ['kaeya', 'odette', 'fischl', 'alyosha'], desc: 'Free-to-play Stellar-Conduct core (Cryo Traveler also works on field).' },
    ],
  },
  varka: {
    partners: [
      ['prune', 'His tailor-made Anemo buffer — ATK% and DMG% (huge at C2+/C6)'],
      ['durin', 'Hexerei passive trigger + Anemo shred + real off-field damage'],
      ['nicole', 'Teamwide ATK% buff and a shield for his on-field combos'],
      ['venti', 'Serviceable Prune substitute with his own damage'],
    ],
    teams: [
      { name: 'Anemo-Pyro (top)', members: ['varka', 'prune', 'durin', 'nicole'], desc: 'His strongest setup — Pyro Resonance ATK, Hexerei passive active, full DMG%/ATK% coverage.' },
      { name: 'Venti variant', members: ['varka', 'venti', 'durin', 'nicole'], desc: 'Venti replaces Prune with comparable pre-C2 buffing value.' },
      { name: 'Anemo-Cryo', members: ['varka', 'prune', 'citlali', 'shenhe'], desc: 'Cryo Resonance crit rate variant.' },
      { name: 'Budget Anemo', members: ['varka', 'sucrose', 'thoma', 'bennett'], desc: 'Bennett matches Nicole\'s ATK total; Thoma covers the Pyro/Hexerei slot.' },
    ],
  },
  lohen: {
    partners: [
      ['durin', 'Designed pairing — Lohen enables Durin\'s Dragon of Dark Decay form'],
      ['nicole', 'Only she buffs Lohen and Durin simultaneously at full value'],
      ['citlali', 'Pyro RES shred + healing for the Melt variant'],
      ['prune', 'Hexerei buffer for the F2P-adjacent version'],
    ],
    teams: [
      { name: 'Lohen Melt (top)', members: ['lohen', 'durin', 'nicole', 'citlali'], desc: 'His best team — Durin melts on every hit off Lohen\'s Cryo aura.' },
      { name: 'Hexerei core', members: ['lohen', 'prune', 'durin', 'nicole'], desc: 'Full Hexerei stack with double buffer coverage.' },
      { name: 'Budget Melt', members: ['lohen', 'prune', 'xiangling', 'bennett'], desc: 'Xiangling + Bennett replace the premium Pyro slots.' },
      { name: 'Stellar flex', members: ['lohen', 'odette', 'yae-miko', 'alyosha'], desc: 'Lohen can also drive Stellar-Conduct against Cryo-weak content.' },
    ],
  },
  nicole: {
    partners: [
      ['durin', 'Her ATK% buff is best spent on his off-field damage — near-BiS pairing'],
      ['varka', 'ATK-scaling Anemo hypercarry who loves her shield'],
      ['lohen', 'His best team drops off noticeably without her'],
      ['kinich', 'Burning teams appreciate her buff on both Kinich and Emilie'],
    ],
    teams: [
      { name: 'Varka premium', members: ['varka', 'prune', 'durin', 'nicole'], desc: 'Her flagship home — buffs Varka and Durin at once.' },
      { name: 'Lohen Melt', members: ['lohen', 'durin', 'nicole', 'citlali'], desc: 'Reverse Melt with her ATK% feeding both damage sources.' },
      { name: 'Kinich Burning', members: ['kinich', 'emilie', 'durin', 'nicole'], desc: 'Multiple damage sources all scale with her teamwide buff.' },
      { name: 'Overload flex', members: ['clorinde', 'durin', 'chevreuse', 'nicole'], desc: 'Durin as the Pyro applicator in a Chevreuse shell.' },
    ],
  },
  prune: {
    partners: [
      ['varka', 'She is his dedicated Anemo support — Venti-tier buffing, better at C2+'],
      ['lohen', 'Hexerei buffer for his Cryo driver teams'],
      ['durin', 'She buffs the on-fielder while he handles off-field damage'],
    ],
    teams: [
      { name: 'Varka premium', members: ['varka', 'prune', 'durin', 'nicole'], desc: 'The team she was built for.' },
      { name: 'Hexerei DPS', members: ['lohen', 'prune', 'durin', 'nicole'], desc: 'Slot any Hexerei DPS into Lohen\'s spot.' },
      { name: 'VV support flex', members: ['neuvillette', 'prune', 'furina', 'baizhu'], desc: 'Generic 4pc VV shredder duty when not in a Hexerei team.' },
      { name: 'Mizuki Swirl', members: ['yumemizuki-mizuki', 'prune', 'odette', 'diona'], desc: 'Anemo stack for Stellar Swirl experiments.' },
    ],
  },
  linnea: {
    partners: [
      ['columbina', 'Moonsign amplifier stack for Lunar teams'],
      ['nefer', 'Buffs her Lunar-Bloom damage output'],
      ['lauma', 'Double Lunar support core'],
    ],
    teams: [
      { name: 'Lunar-Bloom support', members: ['nefer', 'lauma', 'linnea', 'furina'], desc: 'Linnea slots into the Nod-Krai Lunar core as a flexible buffer.' },
      { name: 'Columbina stack', members: ['columbina', 'linnea', 'lauma', 'furina'], desc: 'Full Moonsign amplification chain.' },
      { name: 'Flins Lunar-Charged', members: ['flins', 'ineffa', 'linnea', 'furina'], desc: 'Linnea as the flex buffer in Lunar-Charged.' },
      { name: 'Skirk flex', members: ['skirk', 'furina', 'escoffier', 'linnea'], desc: 'Freeze shell with Linnea in the flex slot.' },
    ],
  },
  illuga: {
    partners: [
      ['zibai', 'His designed partner — the Nod-Krai Geo pairing'],
      ['columbina', 'Moonsign synergy in Lunar teams'],
    ],
    teams: [
      { name: 'Zibai Geo core', members: ['zibai', 'illuga', 'columbina', 'zhongli'], desc: 'The dedicated Nod-Krai Geo team.' },
      { name: 'Zibai + Furina', members: ['zibai', 'illuga', 'columbina', 'furina'], desc: 'Furina variant for more raw damage.' },
      { name: 'Crystallize comfort', members: ['navia', 'illuga', 'gorou', 'zhongli'], desc: 'Geo stack with full shield uptime.' },
      { name: 'Lunar flex', members: ['columbina', 'illuga', 'lauma', 'furina'], desc: 'Moonsign support duty outside Geo teams.' },
    ],
  },
  jahoda: {
    partners: [
      ['neuvillette', 'Healer + VV holder in his Lunar-Charged teams'],
      ['columbina', 'Moonsign element reapplication synergy'],
    ],
    teams: [
      { name: 'Neuvillette support', members: ['neuvillette', 'ineffa', 'columbina', 'jahoda'], desc: 'Healer/VV alternative to Xilonen in Lunar-Charged.' },
      { name: 'Lunar-Bloom flex', members: ['nefer', 'lauma', 'columbina', 'jahoda'], desc: 'Sustain option for the Lunar-Bloom core.' },
      { name: 'Anemo utility', members: ['flins', 'ineffa', 'furina', 'jahoda'], desc: 'Shred + heals in Lunar-Charged shells.' },
      { name: 'Budget VV', members: ['mualani', 'jahoda', 'furina', 'citlali'], desc: 'Budget VV shredder-healer for Vape teams.' },
    ],
  },
};
