// Original build summaries written for this project (KQM-inspired recommendations, original text).
// Format mirrors the processed paimon-moe build format used in build-data.mjs.
// weapon/artifact ids are app slugs.

const W = (key, refine) => ({ key, id: key, refine: refine || null, stack: null });
const A = (...keys) => keys.map((k) => (k.startsWith('+') ? { label: k } : { key: k }));

export const extraBuilds = {
  arlecchino: {
    roles: {
      'ON-FIELD DPS': {
        recommended: true,
        weapons: [W('crimson-moons-semblance'), W('staff-of-homa'), W('primordial-jade-winged-spear'), W('deathmatch'), W('lithic-spear'), W('missive-windspear', [5]), W('white-tassel', [5])],
        artifacts: [A('fragment-of-harmonic-whimsy'), A('gladiators-finale'), A('shimenawas-reminiscence'), A('crimson-witch-of-flames')],
        mainStats: { sands: ['ATK%', 'Elemental Mastery'], goblet: ['Pyro DMG'], circlet: ['Crit Rate', 'Crit DMG'] },
        subStats: ['Crit Rate', 'Crit DMG', 'ATK%', 'Elemental Mastery'],
        talent: ['Normal Attack', 'Skill', 'Burst'],
        tip: 'Apply the Blood-Debt Directive with her Skill, absorb it with a Charged Attack, then deal empowered Normal Attacks fueled by her Bond of Life.',
        note: 'Arlecchino is a premier on-field Pyro DPS. She heals only through her Burst, so pair her with shielders (Zhongli, Layla) rather than healers to preserve her Bond of Life. Vaporize teams with Yelan/Xingqiu or overload with Chevreuse are both excellent. Energy Recharge is largely unnecessary; focus entirely on offensive stats.',
      },
    },
  },
  charlotte: {
    roles: {
      'HEALER / FREEZE SUPPORT': {
        recommended: true,
        weapons: [W('everlasting-moonglow'), W('prototype-amber', [5]), W('favonius-codex'), W('thrilling-tales-of-dragon-slayers', [5]), W('sacrificial-fragments')],
        artifacts: [A('maiden-beloved'), A('ocean-hued-clam'), A('noblesse-oblige'), A('song-of-days-past')],
        mainStats: { sands: ['ATK%', 'Energy Recharge'], goblet: ['ATK%'], circlet: ['Healing Bonus', 'ATK%'] },
        subStats: ['Energy Recharge', 'ATK%', 'Crit Rate (Favonius)'],
        talent: ['Burst', 'Skill', 'Normal Attack'],
        tip: 'Her healing scales off ATK. Aim for 180-220% Energy Recharge to keep her Burst available every rotation.',
        note: 'Charlotte is a Cryo healer who shines in Freeze and Fontaine teams. Her passive boosts her healing when the party is all Fontainian. Off-field Cryo application from her Skill enables Freeze comps without a dedicated Cryo DPS.',
      },
    },
  },
  chasca: {
    roles: {
      'ON-FIELD DPS': {
        recommended: true,
        weapons: [W('astral-vultures-crimson-plumage'), W('aqua-simulacra'), W('polar-star'), W('rainbow-serpents-rain-bow'), W('the-first-great-magic'), W('rust'), W('range-gauge')],
        artifacts: [A('obsidian-codex'), A('desert-pavilion-chronicle'), A('wanderers-troupe')],
        mainStats: { sands: ['ATK%'], goblet: ['Anemo DMG'], circlet: ['Crit Rate', 'Crit DMG'] },
        subStats: ['Crit Rate', 'Crit DMG', 'ATK%', 'Elemental Mastery'],
        talent: ['Skill', 'Burst', 'Normal Attack'],
        tip: 'Hold her Skill to mount the Soulsniper and fire multi-element Shadowhunt Shells. Team elements convert her bullets, so run 2-3 different PHEC (Pyro/Hydro/Electro/Cryo) teammates.',
        note: 'Chasca is a flying Anemo bow DPS whose Charged Shots absorb the elements of her teammates. Best teams give her two or three different convertible elements (e.g. Ororon + Citlali + Bennett). Obsidian Codex 4pc is her best set since she is almost always in Nightsoul Blessing.',
      },
    },
  },
  chevreuse: {
    roles: {
      'OVERLOAD SUPPORT': {
        recommended: true,
        weapons: [W('rightful-reward', [5]), W('dialogues-of-the-desert-sages'), W('favonius-lance'), W('the-catch', [5]), W('black-tassel', [5])],
        artifacts: [A('noblesse-oblige'), A('song-of-days-past'), A('tenacity-of-the-millelith'), A('+20%_er_set', '+20%_er_set')],
        mainStats: { sands: ['HP%', 'Energy Recharge'], goblet: ['HP%'], circlet: ['HP%', 'Healing Bonus'] },
        subStats: ['HP%', 'Energy Recharge', 'Flat HP'],
        talent: ['Skill', 'Burst', 'Normal Attack'],
        tip: 'Only works in pure Pyro+Electro (Overload) teams — her passive shreds Pyro/Electro RES and buffs ATK based on her max HP.',
        note: 'Chevreuse is the engine of Overload teams: with only Pyro and Electro party members she grants huge RES shred and ATK buffs while healing the on-fielder. Build pure HP and enough ER (~180-200%) to loop her kit. Signature teams: Raiden Overload, Arlecchino-Fischl, Clorinde Overload.',
      },
    },
  },
  chiori: {
    roles: {
      'OFF-FIELD GEO DPS': {
        recommended: true,
        weapons: [W('uraku-misugiri'), W('primordial-jade-cutter'), W('light-of-foliar-incision'), W('kagotsurube-isshin'), W('harbinger-of-dawn', [5]), W('cinnabar-spindle', [5])],
        artifacts: [A('golden-troupe'), A('husk-of-opulent-dreams'), A('gladiators-finale')],
        mainStats: { sands: ['ATK%', 'DEF%'], goblet: ['Geo DMG'], circlet: ['Crit Rate', 'Crit DMG'] },
        subStats: ['Crit Rate', 'Crit DMG', 'DEF%', 'ATK%'],
        talent: ['Skill', 'Normal Attack', 'Burst'],
        tip: 'Her Skill dolls scale off both ATK and DEF. Pair with another Geo construct user (or a Geo teammate) to trigger her extra doll.',
        note: 'Chiori is a low-maintenance off-field Geo striker. Golden Troupe 4pc maximizes her turret damage. Strongest alongside Navia, Ningguang or in mono-Geo. She needs almost no Energy Recharge since her Burst is optional in most rotations.',
      },
    },
  },
  citlali: {
    roles: {
      'SHIELDER / CRYO SUPPORT': {
        recommended: true,
        weapons: [W('starcallers-watch'), W('a-thousand-floating-dreams'), W('thrilling-tales-of-dragon-slayers', [5]), W('favonius-codex'), W('sacrificial-fragments')],
        artifacts: [A('scroll-of-the-hero-of-cinder-city'), A('tenacity-of-the-millelith'), A('instructor')],
        mainStats: { sands: ['Elemental Mastery'], goblet: ['Elemental Mastery'], circlet: ['Elemental Mastery'] },
        subStats: ['Elemental Mastery', 'Energy Recharge', 'HP%'],
        talent: ['Skill', 'Burst', 'Normal Attack'],
        tip: 'Full EM build — her shield scales off Elemental Mastery, and her passive shreds Pyro/Hydro RES when reactions occur.',
        note: 'Citlali is a premium support for Melt/Vaporize teams: strong EM-scaling shield, off-field Cryo application, and 20% Pyro/Hydro RES shred. Scroll of the Hero 4pc turns her into a major damage buffer in Natlan teams. Excellent with Mavuika, Arlecchino, Neuvillette and Mualani.',
      },
    },
  },
  clorinde: {
    roles: {
      'ON-FIELD DPS': {
        recommended: true,
        weapons: [W('absolution'), W('mistsplitter-reforged'), W('haran-geppaku-futsu'), W('primordial-jade-cutter'), W('finale-of-the-deep'), W('the-black-sword'), W('fleuve-cendre-ferryman', [5])],
        artifacts: [A('fragment-of-harmonic-whimsy'), A('thundering-fury'), A('gladiators-finale')],
        mainStats: { sands: ['ATK%'], goblet: ['Electro DMG'], circlet: ['Crit Rate', 'Crit DMG'] },
        subStats: ['Crit Rate', 'Crit DMG', 'ATK%', 'Elemental Mastery (Aggravate)'],
        talent: ['Skill', 'Normal Attack', 'Burst'],
        tip: 'Her Skill converts attacks into Bond-of-Life-fueled pistol volleys. Weave Hunter\'s Vigil shots and dashes; her healing comes from clearing Bond of Life.',
        note: 'Clorinde is a fast, self-sufficient Electro duelist. Best teams: Aggravate with Nahida/Kirara, or Overload with Chevreuse + Fischl. Fragment of Harmonic Whimsy 4pc synergizes with her constant Bond of Life changes.',
      },
    },
  },
  emilie: {
    roles: {
      'OFF-FIELD BURNING DPS': {
        recommended: true,
        weapons: [W('lumidouce-elegy'), W('staff-of-homa'), W('deathmatch'), W('ballad-of-the-fjords'), W('footprint-of-the-rainbow', [5]), W('white-tassel', [5])],
        artifacts: [A('unfinished-reverie'), A('gladiators-finale'), A('golden-troupe')],
        mainStats: { sands: ['ATK%'], goblet: ['Dendro DMG'], circlet: ['Crit Rate', 'Crit DMG'] },
        subStats: ['Crit Rate', 'Crit DMG', 'ATK%'],
        talent: ['Skill', 'Burst', 'Normal Attack'],
        tip: 'Requires Burning: keep a Pyro applier and Dendro on-field enemies aflame so her Lumidouce Case levels up and her passive buffs kick in.',
        note: 'Emilie is a specialist off-field DPS for Burning teams. Her scent-collecting cases deal steady Dendro damage that ignores the usual EM-centric Dendro builds — she is a pure ATK/Crit unit. Team her with Arlecchino, Lyney or Mavuika plus a Dendro enabler.',
      },
    },
  },
  escoffier: {
    roles: {
      'CRYO SUPPORT / SUB-DPS': {
        recommended: true,
        weapons: [W('symphonist-of-scents'), W('lumidouce-elegy'), W('rightful-reward', [5]), W('favonius-lance'), W('dialogues-of-the-desert-sages')],
        artifacts: [A('golden-troupe'), A('emblem-of-severed-fate'), A('noblesse-oblige')],
        mainStats: { sands: ['ATK%', 'Energy Recharge'], goblet: ['Cryo DMG'], circlet: ['Crit Rate', 'Crit DMG'] },
        subStats: ['Crit Rate', 'Crit DMG', 'Energy Recharge', 'ATK%'],
        talent: ['Skill', 'Burst', 'Normal Attack'],
        tip: 'Her RES shred passive scales with the number of Hydro/Cryo teammates — strongest in pure Freeze/Frozen teams.',
        note: 'Escoffier is a top-tier enabler for Cryo and Hydro teams: massive dual RES shred, off-field Cryo damage from her cooking mek, and healing from her Burst. Pairs beautifully with Skirk, Neuvillette Freeze, Ayaka and Wriothesley.',
      },
    },
  },
  freminet: {
    roles: {
      'PHYSICAL DPS': {
        recommended: true,
        weapons: [W('song-of-broken-pines'), W('serpent-spine'), W('redhorn-stonethresher'), W('the-unforged'), W('rainslasher'), W('snow-tombed-starsilver', [5])],
        artifacts: [A('pale-flame'), A('pale-flame', '+25%_physical_dmg_set'), A('shimenawas-reminiscence')],
        mainStats: { sands: ['ATK%'], goblet: ['Physical DMG'], circlet: ['Crit Rate', 'Crit DMG'] },
        subStats: ['Crit Rate', 'Crit DMG', 'ATK%'],
        talent: ['Normal Attack', 'Skill', 'Burst'],
        tip: 'Use his Skill, stack Pers Pressure with Normal Attacks, then release for a big Shattering Pressure hit. His Burst mainly resets his Skill.',
        note: 'Freminet is a Physical/Cryo hybrid on-field DPS. Superconduct teams with Fischl and a Cryo battery (Rosaria, Shenhe) serve him best. Cheap to gear and a great 4-star main DPS project.',
      },
    },
  },
  furina: {
    roles: {
      'OFF-FIELD DPS / BUFFER': {
        recommended: true,
        weapons: [W('splendor-of-tranquil-waters'), W('primordial-jade-cutter'), W('key-of-khaj-nisut'), W('festering-desire', [5]), W('fleuve-cendre-ferryman', [5]), W('favonius-sword'), W('harbinger-of-dawn', [5])],
        artifacts: [A('golden-troupe'), A('emblem-of-severed-fate'), A('tenacity-of-the-millelith')],
        mainStats: { sands: ['HP%', 'Energy Recharge'], goblet: ['HP%', 'Hydro DMG'], circlet: ['Crit Rate', 'Crit DMG'] },
        subStats: ['Crit Rate', 'Crit DMG', 'HP%', 'Energy Recharge'],
        talent: ['Skill', 'Burst', 'Normal Attack'],
        tip: 'Her Burst buff (Fanfare) grows as the party gains and loses HP — pair her with an off-field or team-wide healer like Jean, Charlotte, Baizhu or Xianyun.',
        note: 'Furina is arguably the strongest off-field unit in the game: huge Hydro damage from her Salon Members plus a massive universal DMG buff. Needs ~140-180% ER depending on team. She slots into nearly every team — Neuvillette, Arlecchino, Hu Tao, Ayaka, Navia, Xianyun plunge and more.',
      },
    },
  },
  gaming: {
    roles: {
      'PLUNGE DPS': {
        recommended: true,
        weapons: [W('serpent-spine'), W('wolfs-gravestone'), W('redhorn-stonethresher'), W('rainslasher'), W('mailed-flower'), W('lithic-blade')],
        artifacts: [A('crimson-witch-of-flames'), A('marechaussee-hunter'), A('gladiators-finale')],
        mainStats: { sands: ['ATK%', 'Elemental Mastery'], goblet: ['Pyro DMG'], circlet: ['Crit Rate', 'Crit DMG'] },
        subStats: ['Crit Rate', 'Crit DMG', 'ATK%', 'Elemental Mastery'],
        talent: ['Skill', 'Normal Attack', 'Burst'],
        tip: 'Loop his Skill plunges continuously; his self-heal keeps him above the HP threshold for his passive damage bonus.',
        note: 'Gaming is a fun, spammable Pyro plunge DPS. He loves Xianyun (plunge buffs) and Furina, and works great with Bennett in Melt or Vaporize teams. One of the best 4-star DPS releases in years.',
      },
    },
  },
  iansan: {
    roles: {
      'ATK BUFFER': {
        recommended: true,
        weapons: [W('tamayuratei-no-ohanashi', [5]), W('rightful-reward', [5]), W('favonius-lance'), W('the-catch', [5])],
        artifacts: [A('scroll-of-the-hero-of-cinder-city'), A('noblesse-oblige'), A('+20%_er_set', '+20%_er_set')],
        mainStats: { sands: ['Energy Recharge', 'ATK%'], goblet: ['ATK%'], circlet: ['ATK%'] },
        subStats: ['Energy Recharge', 'ATK%', 'Flat ATK'],
        talent: ['Burst', 'Skill', 'Normal Attack'],
        tip: 'Her Burst grants a scaling ATK buff that ramps with the on-fielder\'s movement and Nightsoul points — ideal for mobile DPS characters.',
        note: 'Iansan is a compact ATK buffer for Natlan teams. She is Varesa\'s best partner and slots well into Mavuika and Xilonen comps. Build ER first (~220%+), then ATK.',
      },
    },
  },
  ifa: {
    roles: {
      'ANEMO HEALER / DRIVER': {
        recommended: true,
        weapons: [W('sunny-morning-sleep-in'), W('a-thousand-floating-dreams'), W('sacrificial-fragments'), W('favonius-codex'), W('thrilling-tales-of-dragon-slayers', [5])],
        artifacts: [A('scroll-of-the-hero-of-cinder-city'), A('viridescent-venerer'), A('instructor')],
        mainStats: { sands: ['Elemental Mastery'], goblet: ['Elemental Mastery'], circlet: ['Elemental Mastery'] },
        subStats: ['Elemental Mastery', 'Energy Recharge', 'HP%'],
        talent: ['Skill', 'Burst', 'Normal Attack'],
        tip: 'Full EM: his healing and Swirl damage both benefit, and he passes big EM-based buffs to reaction teams.',
        note: 'Ifa is a flexible Anemo healer who applies Anemo while hovering and healing. Great VV/Scroll holder for Natlan and Swirl teams — an easy-to-build glue unit.',
      },
    },
  },
  kachina: {
    roles: {
      'GEO SUB-DPS': {
        recommended: true,
        weapons: [W('footprint-of-the-rainbow', [5]), W('deathmatch'), W('favonius-lance'), W('the-catch', [5])],
        artifacts: [A('scroll-of-the-hero-of-cinder-city'), A('husk-of-opulent-dreams'), A('golden-troupe')],
        mainStats: { sands: ['DEF%'], goblet: ['Geo DMG', 'DEF%'], circlet: ['Crit Rate', 'Crit DMG', 'DEF%'] },
        subStats: ['DEF%', 'Crit Rate', 'Crit DMG', 'Energy Recharge'],
        talent: ['Skill', 'Burst', 'Normal Attack'],
        tip: 'Park her Turbo Twirly on enemies for off-field Geo ticks; she scales off DEF.',
        note: 'Kachina is a simple DEF-scaling Geo sub-DPS and a solid Scroll of the Hero holder in Natlan teams, particularly for Navia and Xilonen comps or as a budget option alongside Mualani.',
      },
    },
  },
  kinich: {
    roles: {
      'ON-FIELD DENDRO DPS': {
        recommended: true,
        weapons: [W('fang-of-the-mountain-king'), W('beacon-of-the-reed-sea'), W('serpent-spine'), W('the-bell'), W('mailed-flower'), W('earth-shaker', [5])],
        artifacts: [A('obsidian-codex'), A('deepwood-memories'), A('gladiators-finale')],
        mainStats: { sands: ['ATK%'], goblet: ['Dendro DMG'], circlet: ['Crit Rate', 'Crit DMG'] },
        subStats: ['Crit Rate', 'Crit DMG', 'ATK%'],
        talent: ['Skill', 'Burst', 'Normal Attack'],
        tip: 'Swing sideways with his Skill grapple and fire Loop Shots; his damage is nearly all Skill-based. Burning teams boost his passive.',
        note: 'Kinich is a Dendro on-field DPS built for Burning and Burgeon teams with Emilie, Xiangling or Dehya. Obsidian Codex is tailor-made for him. He wants almost no ER — pure offense.',
      },
    },
  },
  kirara: {
    roles: {
      'SHIELDER': {
        recommended: true,
        weapons: [W('key-of-khaj-nisut'), W('primordial-jade-cutter'), W('freedom-sworn'), W('sacrificial-sword'), W('favonius-sword'), W('iron-sting')],
        artifacts: [A('tenacity-of-the-millelith'), A('deepwood-memories'), A('instructor')],
        mainStats: { sands: ['HP%'], goblet: ['HP%'], circlet: ['HP%'] },
        subStats: ['HP%', 'Energy Recharge', 'Elemental Mastery'],
        talent: ['Skill', 'Burst', 'Normal Attack'],
        tip: 'HP-scaling shielder — hold her Skill to roll around in the box and shield while exploring.',
        note: 'Kirara is the premier Dendro shielder, perfect for Aggravate/Hyperbloom teams that want survivability without breaking Dendro resonance. Deepwood holder if no one else runs it.',
      },
    },
  },
  'lan-yan': {
    roles: {
      'ANEMO SHIELDER': {
        recommended: true,
        weapons: [W('sacrificial-jade'), W('a-thousand-floating-dreams'), W('prototype-amber', [5]), W('favonius-codex'), W('mappa-mare')],
        artifacts: [A('viridescent-venerer'), A('tenacity-of-the-millelith'), A('maiden-beloved')],
        mainStats: { sands: ['ATK%', 'Elemental Mastery'], goblet: ['ATK%'], circlet: ['ATK%'] },
        subStats: ['ATK%', 'Elemental Mastery', 'Energy Recharge'],
        talent: ['Skill', 'Burst', 'Normal Attack'],
        tip: 'Her shield scales off ATK and absorbs an element like Anemo damage does; she carries VV shred for reaction teams.',
        note: 'Lan Yan is a rare Anemo shielder — a great VV holder who adds safety to Swirl teams that lack a defensive slot. Simple to build; grab ER from substats until her Burst loops.',
      },
    },
  },
  lynette: {
    roles: {
      'ANEMO SUPPORT': {
        recommended: true,
        weapons: [W('freedom-sworn'), W('sacrificial-sword'), W('favonius-sword'), W('iron-sting'), W('skyward-blade')],
        artifacts: [A('viridescent-venerer'), A('noblesse-oblige'), A('+20%_er_set', '+20%_er_set')],
        mainStats: { sands: ['Energy Recharge', 'ATK%'], goblet: ['Anemo DMG', 'ATK%'], circlet: ['Crit Rate', 'Crit DMG'] },
        subStats: ['Energy Recharge', 'Crit Rate', 'Crit DMG', 'ATK%'],
        talent: ['Burst', 'Skill', 'Normal Attack'],
        tip: 'Burst grouping + ATK buff from her passive; her Skill self-heals with Bond of Life.',
        note: 'Lynette is a free, low-investment Anemo support: VV shred, light grouping and a team ATK buff. A solid budget alternative to Sucrose/Kazuha in many teams.',
      },
    },
  },
  lyney: {
    roles: {
      'CHARGED SHOT DPS': {
        recommended: true,
        weapons: [W('the-first-great-magic'), W('aqua-simulacra'), W('thundering-pulse'), W('amos-bow'), W('song-of-stillness'), W('blackcliff-warbow'), W('prototype-crescent')],
        artifacts: [A('marechaussee-hunter'), A('vermillion-hereafter'), A('shimenawas-reminiscence'), A('gladiators-finale')],
        mainStats: { sands: ['ATK%'], goblet: ['Pyro DMG'], circlet: ['Crit Rate', 'Crit DMG'] },
        subStats: ['Crit Rate', 'Crit DMG', 'ATK%'],
        talent: ['Normal Attack', 'Burst', 'Skill'],
        tip: 'Charge shots to place Grin-Malkin Hats; his kit trades HP for damage, so Marechaussee Hunter 4pc procs constantly.',
        note: 'Lyney excels in mono-Pyro (Bennett + Xiangling/Dehya + anemo) and Vape variants. His best teams keep other elements off the field so his passive Pyro bonus stacks stay active.',
      },
    },
  },
  mavuika: {
    roles: {
      'ON-FIELD / BURST DPS': {
        recommended: true,
        weapons: [W('a-thousand-blazing-suns'), W('serpent-spine'), W('wolfs-gravestone'), W('the-unforged'), W('blackcliff-slasher'), W('ultimate-overlords-mega-magic-sword', [5])],
        artifacts: [A('obsidian-codex'), A('scroll-of-the-hero-of-cinder-city'), A('gladiators-finale')],
        mainStats: { sands: ['ATK%'], goblet: ['Pyro DMG'], circlet: ['Crit Rate', 'Crit DMG'] },
        subStats: ['Crit Rate', 'Crit DMG', 'ATK%', 'Elemental Mastery'],
        talent: ['Burst', 'Skill', 'Normal Attack'],
        tip: 'Her Burst consumes Fighting Spirit charged by teammates — she needs zero Energy Recharge. Ride the Flamestrider for continuous Pyro damage.',
        note: 'Mavuika is a top-tier Pyro DPS whose massive Sunfell Slice and bike attacks scale with Fighting Spirit. Best teams: Citlali + Xilonen + flex (Bennett or a Hydro for Vape). Obsidian Codex 4pc fits her constant Nightsoul uptime.',
      },
    },
  },
  mualani: {
    roles: {
      'VAPORIZE DPS': {
        recommended: true,
        weapons: [W('surfs-up'), W('tome-of-the-eternal-flow'), W('kaguras-verity'), W('sacrificial-jade'), W('flowing-purity'), W('prototype-amber', [5])],
        artifacts: [A('obsidian-codex'), A('heart-of-depth'), A('nymphs-dream')],
        mainStats: { sands: ['HP%'], goblet: ['Hydro DMG', 'HP%'], circlet: ['Crit Rate', 'Crit DMG'] },
        subStats: ['Crit Rate', 'Crit DMG', 'HP%'],
        talent: ['Normal Attack', 'Skill', 'Burst'],
        tip: 'Surf onto enemies to stack Wave Momentum, then unleash a huge Sharky Bite — always aim to Vaporize the bite.',
        note: 'Mualani is an HP-scaling Hydro nuke DPS. Her ideal teams provide steady off-field Pyro for Vaporize without disturbing her surf loop: Citlali + Iansan/Kachina, or Xiangling variants. Avoid ATK stats entirely — HP and Crit only.',
      },
    },
  },
  navia: {
    roles: {
      'ON-FIELD GEO DPS': {
        recommended: true,
        weapons: [W('verdict'), W('redhorn-stonethresher'), W('serpent-spine'), W('wolfs-gravestone'), W('ultimate-overlords-mega-magic-sword', [5]), W('tidal-shadow'), W('blackcliff-slasher')],
        artifacts: [A('nighttime-whispers-in-the-echoing-woods'), A('marechaussee-hunter'), A('golden-troupe'), A('gladiators-finale')],
        mainStats: { sands: ['ATK%'], goblet: ['Geo DMG', 'ATK%'], circlet: ['Crit Rate', 'Crit DMG'] },
        subStats: ['Crit Rate', 'Crit DMG', 'ATK%'],
        talent: ['Skill', 'Burst', 'Normal Attack'],
        tip: 'Collect Crystallize shards to charge her shotgun Skill to full power. Run two Pyro/Hydro/Electro/Cryo teammates to generate shards.',
        note: 'Navia is a satisfying burst-cannon Geo DPS who bypasses Geo\'s usual team restrictions — she wants elemental teammates to feed Crystallize shards. Great with Furina, Bennett and Xiangling or Fischl flex slots.',
      },
    },
  },
  neuvillette: {
    roles: {
      'ON-FIELD HYDRO DPS': {
        recommended: true,
        weapons: [W('tome-of-the-eternal-flow'), W('surfs-up'), W('lost-prayer-to-the-sacred-winds'), W('kaguras-verity'), W('the-widsith'), W('prototype-amber', [5]), W('sacrificial-jade')],
        artifacts: [A('marechaussee-hunter'), A('heart-of-depth'), A('nymphs-dream')],
        mainStats: { sands: ['HP%'], goblet: ['Hydro DMG'], circlet: ['Crit Rate', 'Crit DMG'] },
        subStats: ['Crit Rate', 'Crit DMG', 'HP%', 'Energy Recharge (a little)'],
        talent: ['Normal Attack', 'Skill', 'Burst'],
        tip: 'His Charged Attack: Equitable Judgment is his whole kit — absorb 3 element droplets to fire an empowered beam without draining HP.',
        note: 'Neuvillette is one of the strongest on-field DPS units ever released. He scales off HP and wants elemental variety for his passive (each unique element reaction boosts his beam). Classic team: Neuvillette + Furina + Kazuha + Baizhu/Zhongli. Marechaussee Hunter 4pc is made for him.',
      },
    },
  },
  ororon: {
    roles: {
      'OFF-FIELD ELECTRO SUPPORT': {
        recommended: true,
        weapons: [W('astral-vultures-crimson-plumage'), W('polar-star'), W('rust'), W('favonius-warbow'), W('rainbow-serpents-rain-bow')],
        artifacts: [A('scroll-of-the-hero-of-cinder-city'), A('golden-troupe'), A('emblem-of-severed-fate')],
        mainStats: { sands: ['ATK%', 'Energy Recharge'], goblet: ['Electro DMG'], circlet: ['Crit Rate', 'Crit DMG'] },
        subStats: ['Energy Recharge', 'Crit Rate', 'Crit DMG', 'ATK%'],
        talent: ['Skill', 'Burst', 'Normal Attack'],
        tip: 'His passive turns Nightsoul transitions and Electro-related reactions into free bonus damage — he works even from the bench.',
        note: 'Ororon is a cheap-to-run off-field Electro unit who shines in Chasca and Electro-charged teams. His Hypersense passive triggers off teammates\' reactions, making him one of the easiest sub-DPS units to slot in.',
      },
    },
  },
  sethos: {
    roles: {
      'AGGRAVATE DPS': {
        recommended: true,
        weapons: [W('hunters-path'), W('the-first-great-magic'), W('kings-squire', [5]), W('ibis-piercer'), W('fading-twilight', [5])],
        artifacts: [A('wanderers-troupe'), A('gilded-dreams'), A('thundering-fury')],
        mainStats: { sands: ['Elemental Mastery', 'ATK%'], goblet: ['Electro DMG'], circlet: ['Crit Rate', 'Crit DMG'] },
        subStats: ['Elemental Mastery', 'Crit Rate', 'Crit DMG', 'Energy Recharge'],
        talent: ['Normal Attack', 'Skill', 'Burst'],
        tip: 'Charge his Dusk Bolt shots — they consume Energy for big Electro AoE. He wants EM and enough Energy income to keep firing.',
        note: 'Sethos is an Aggravate specialist: charged-shot Electro DPS with heavy EM scaling. Pair with Nahida/Yaoyao + an Anemo like Sucrose or Kazuha for the classic quicken core.',
      },
    },
  },
  sigewinne: {
    roles: {
      'HEALER / HYDRO SUPPORT': {
        recommended: true,
        weapons: [W('silvershower-heartstrings'), W('favonius-warbow'), W('sacrificial-bow'), W('recurve-bow', [5])],
        artifacts: [A('ocean-hued-clam'), A('noblesse-oblige'), A('song-of-days-past'), A('maiden-beloved')],
        mainStats: { sands: ['HP%', 'Energy Recharge'], goblet: ['HP%'], circlet: ['HP%', 'Healing Bonus'] },
        subStats: ['HP%', 'Energy Recharge'],
        talent: ['Skill', 'Burst', 'Normal Attack'],
        tip: 'Her Skill bouncing Bolstering Bubblebalms heal the whole team while applying Hydro; her passive buffs teammates\' Skill damage.',
        note: 'Sigewinne is a strong HP-scaling Hydro healer who quietly buffs Elemental Skill DMG for the team. She is an ideal partner for Clorinde and other Skill-centric DPS units, and a comfy alternative to Kokomi in some teams.',
      },
    },
  },
  skirk: {
    roles: {
      'ON-FIELD CRYO DPS': {
        recommended: true,
        weapons: [W('azurelight'), W('calamity-of-eshu'), W('mistsplitter-reforged'), W('haran-geppaku-futsu'), W('finale-of-the-deep'), W('the-black-sword')],
        artifacts: [A('finale-of-the-deep-galleries'), A('marechaussee-hunter'), A('blizzard-strayer')],
        mainStats: { sands: ['ATK%'], goblet: ['Cryo DMG'], circlet: ['Crit Rate', 'Crit DMG'] },
        subStats: ['Crit Rate', 'Crit DMG', 'ATK%'],
        talent: ['Normal Attack', 'Skill', 'Burst'],
        tip: 'She uses no Energy at all — collect Void Rifts from Hydro/Cryo teammates\' hits to power her Seven-Phase Flash and Havoc: Ruin.',
        note: 'Skirk is an elite Cryo main DPS who requires Hydro and Cryo teammates to fuel her Serpent\'s Subtlety. Signature team: Skirk + Escoffier + Furina + flex. Finale of the Deep Galleries 4pc is designed around her Energy-less kit.',
      },
    },
  },
  varesa: {
    roles: {
      'PLUNGE DPS': {
        recommended: true,
        weapons: [W('vivid-notions'), W('skyward-atlas'), W('kaguras-verity'), W('the-widsith'), W('blackcliff-agate'), W('dodoco-tales', [5])],
        artifacts: [A('long-nights-oath'), A('obsidian-codex'), A('vermillion-hereafter')],
        mainStats: { sands: ['ATK%'], goblet: ['Electro DMG'], circlet: ['Crit Rate', 'Crit DMG'] },
        subStats: ['Crit Rate', 'Crit DMG', 'ATK%'],
        talent: ['Normal Attack', 'Skill', 'Burst'],
        tip: 'Enter Fiery Passion by using her Skill, then chain rainbow plunge attacks. Her Burst refunds and empowers plunges.',
        note: 'Varesa is an Electro plunge nuker from Natlan. Iansan is her best teammate (movement-charged ATK buff); add Zhongli or a healer for comfort. Long Night\'s Oath 4pc is her tailored plunge set.',
      },
    },
  },
  wriothesley: {
    roles: {
      'ON-FIELD CRYO DPS': {
        recommended: true,
        weapons: [W('cashflow-supervision'), W('tulaytullahs-remembrance'), W('lost-prayer-to-the-sacred-winds'), W('the-widsith'), W('blackcliff-agate'), W('flowing-purity')],
        artifacts: [A('marechaussee-hunter'), A('blizzard-strayer'), A('gladiators-finale')],
        mainStats: { sands: ['ATK%'], goblet: ['Cryo DMG'], circlet: ['Crit Rate', 'Crit DMG'] },
        subStats: ['Crit Rate', 'Crit DMG', 'ATK%'],
        talent: ['Normal Attack', 'Burst', 'Skill'],
        tip: 'His Skill drains HP to empower punches; his passive charged attack (Rebuke) procs when below 60% HP and heals him.',
        note: 'Wriothesley is a boxer-style Cryo DPS whose HP fluctuation makes him a natural Marechaussee Hunter user and Furina partner. Freeze teams (with Kokomi/Sigewinne) and Melt variants both work.',
      },
    },
  },
  xianyun: {
    roles: {
      'PLUNGE SUPPORT / HEALER': {
        recommended: true,
        weapons: [W('cranes-echoing-call'), W('skyward-atlas'), W('oathsworn-eye', [5]), W('favonius-codex'), W('prototype-amber', [5])],
        artifacts: [A('viridescent-venerer'), A('noblesse-oblige'), A('song-of-days-past'), A('+20%_er_set', '+20%_er_set')],
        mainStats: { sands: ['ATK%', 'Energy Recharge'], goblet: ['ATK%'], circlet: ['ATK%'] },
        subStats: ['Energy Recharge', 'ATK%'],
        talent: ['Burst', 'Skill', 'Normal Attack'],
        tip: 'Her Burst heals and lets the whole team leap and plunge; her passive adds huge flat ATK-scaled bonus damage to plunges.',
        note: 'Xianyun single-handedly created the plunge archetype: she converts Gaming, Xiao, Diluc and even Navia into plunge machines. Build pure ATK + ER (~160%). Pairs perfectly with Furina and Bennett.',
      },
    },
  },
  xilonen: {
    roles: {
      'DEF SUPPORT / SHREDDER': {
        recommended: true,
        weapons: [W('peak-patrol-song'), W('freedom-sworn'), W('key-of-khaj-nisut'), W('favonius-sword'), W('sacrificial-sword'), W('festering-desire', [5])],
        artifacts: [A('scroll-of-the-hero-of-cinder-city'), A('archaic-petra'), A('husk-of-opulent-dreams')],
        mainStats: { sands: ['DEF%'], goblet: ['DEF%'], circlet: ['DEF%', 'Healing Bonus'] },
        subStats: ['DEF%', 'Energy Recharge', 'Crit (weapon dependent)'],
        talent: ['Skill', 'Burst', 'Normal Attack'],
        tip: 'Her Source Samples shred the RES of elements matching her teammates. With 2+ non-Geo elements she becomes a universal shredder + healer.',
        note: 'Xilonen is a top-3 support in the game: massive multi-element RES shred, healing, and Geo application, all scaling off DEF. She fits Mavuika, Neuvillette, Arlecchino — nearly everyone. Scroll 4pc in Natlan teams, Archaic Petra elsewhere.',
      },
    },
  },
  'yumemizuki-mizuki': {
    roles: {
      'SWIRL SUPPORT / HEALER': {
        recommended: true,
        weapons: [W('sunny-morning-sleep-in'), W('a-thousand-floating-dreams'), W('sacrificial-jade'), W('prototype-amber', [5]), W('favonius-codex')],
        artifacts: [A('viridescent-venerer'), A('instructor'), A('gilded-dreams')],
        mainStats: { sands: ['Elemental Mastery'], goblet: ['Elemental Mastery'], circlet: ['Elemental Mastery'] },
        subStats: ['Elemental Mastery', 'Energy Recharge'],
        talent: ['Skill', 'Burst', 'Normal Attack'],
        tip: 'Enter Dreamdrifter with her Skill to float, continuously Swirl, and boost teammates\' Swirl DMG with her EM.',
        note: 'Mizuki is an EM-stacking Anemo support/healer whose Dreamdrifter state amplifies Swirl damage. Excellent in Mono-element Swirl teams and comfy overworld healing with snacks from her Burst.',
      },
    },
  },
  'traveler-hydro': {
    roles: {
      'HYDRO SUPPORT': {
        recommended: true,
        weapons: [W('favonius-sword'), W('sacrificial-sword'), W('festering-desire', [5]), W('skyward-blade')],
        artifacts: [A('emblem-of-severed-fate'), A('noblesse-oblige'), A('heart-of-depth')],
        mainStats: { sands: ['Energy Recharge', 'ATK%'], goblet: ['Hydro DMG'], circlet: ['Crit Rate', 'Crit DMG'] },
        subStats: ['Energy Recharge', 'Crit Rate', 'Crit DMG', 'ATK%'],
        talent: ['Skill', 'Burst', 'Normal Attack'],
        tip: 'Aim the Skill\'s Dewdrops for HP-restoring hits; the Burst provides light off-field Hydro.',
        note: 'Hydro Traveler is a budget Hydro applier with self-healing. Usable in Bloom/Vape teams when premium Hydro units are busy elsewhere.',
      },
    },
  },
  lauma: {
    roles: {
      'LUNAR-BLOOM SUPPORT': {
        recommended: true,
        weapons: [W('nightweavers-looking-glass'), W('a-thousand-floating-dreams'), W('blackmarrow-lantern'), W('sacrificial-fragments'), W('favonius-codex')],
        artifacts: [A('silken-moons-serenade'), A('deepwood-memories'), A('gilded-dreams'), A('instructor')],
        mainStats: { sands: ['Elemental Mastery'], goblet: ['Elemental Mastery'], circlet: ['Elemental Mastery'] },
        subStats: ['Elemental Mastery', 'Energy Recharge'],
        talent: ['Skill', 'Burst', 'Normal Attack'],
        tip: 'Full EM — her buffs to Lunar-Bloom and Bloom-family reactions scale off her Elemental Mastery.',
        note: 'Lauma is the premier Lunar-Bloom amplifier from Nod-Krai: off-field Dendro application, team-wide EM conversion, and huge multipliers for moon-empowered Bloom reactions. She is Nefer\'s best partner and also slots into classic Hyperbloom/Bloom cores as a Deepwood holder.',
      },
    },
  },
  nefer: {
    roles: {
      'LUNAR-BLOOM DPS': {
        recommended: true,
        weapons: [W('reliquary-of-truth'), W('a-thousand-floating-dreams'), W('kaguras-verity'), W('dawning-frost'), W('the-widsith'), W('mappa-mare', [5])],
        artifacts: [A('silken-moons-serenade'), A('aubade-of-morningstar-and-moon'), A('gilded-dreams'), A('deepwood-memories')],
        mainStats: { sands: ['Elemental Mastery', 'ATK%'], goblet: ['Dendro DMG', 'Elemental Mastery'], circlet: ['Crit Rate', 'Crit DMG'] },
        subStats: ['Elemental Mastery', 'Crit Rate', 'Crit DMG'],
        talent: ['Skill', 'Normal Attack', 'Burst'],
        tip: 'Keep Hydro flowing from the bench so her empowered attacks continuously trigger Lunar-Bloom.',
        note: 'Nefer is a Dendro DPS built around detonating Lunar-Bloom reactions. Her ceiling comes from pairing with Lauma — the two were designed together. Round the team out with Furina or Yelan for steady off-field Hydro.',
      },
    },
  },
  flins: {
    roles: {
      'LUNAR-CHARGED DPS': {
        recommended: true,
        weapons: [W('bloodsoaked-ruins'), W('fractured-halo'), W('staff-of-homa'), W('deathmatch'), W('missive-windspear', [5])],
        artifacts: [A('night-of-the-skys-unveiling'), A('thundering-fury'), A('gladiators-finale')],
        mainStats: { sands: ['ATK%', 'Elemental Mastery'], goblet: ['Electro DMG'], circlet: ['Crit Rate', 'Crit DMG'] },
        subStats: ['Crit Rate', 'Crit DMG', 'ATK%', 'Elemental Mastery'],
        talent: ['Skill', 'Normal Attack', 'Burst'],
        tip: 'Keep enemies wet — his empowered spear strikes convert Electro-Charged into the stronger Lunar-Charged reaction.',
        note: 'Flins is an on-field Electro DPS who headlines the Lunar-Charged archetype. Ineffa is his best partner (battery + buffs); add a strong Hydro applier like Furina or Yelan to sustain the reaction loop.',
      },
      'OFF-FIELD SUB-DPS': {
        recommended: false,
        weapons: [W('fractured-halo'), W('the-catch', [5]), W('favonius-lance'), W('deathmatch')],
        artifacts: [A('night-of-the-skys-unveiling'), A('emblem-of-severed-fate'), A('noblesse-oblige')],
        mainStats: { sands: ['ATK%', 'Energy Recharge'], goblet: ['Electro DMG'], circlet: ['Crit Rate', 'Crit DMG'] },
        subStats: ['Energy Recharge', 'Crit Rate', 'Crit DMG', 'ATK%'],
        talent: ['Burst', 'Skill', 'Normal Attack'],
        tip: 'Burst-focused build for quick-swap teams; needs more ER (~160-180%).',
        note: 'Flins can run as an off-field Electro sub-DPS in Electro-Charged teams when someone else wants the field, though his on-field Lunar-Charged role is stronger.',
      },
    },
  },
  ineffa: {
    roles: {
      'OFF-FIELD SUPPORT / SUB-DPS': {
        recommended: true,
        weapons: [W('fractured-halo'), W('engulfing-lightning'), W('the-catch', [5]), W('favonius-lance'), W('frostbreath')],
        artifacts: [A('night-of-the-skys-unveiling'), A('noblesse-oblige'), A('emblem-of-severed-fate'), A('tenacity-of-the-millelith')],
        mainStats: { sands: ['ATK%', 'Energy Recharge'], goblet: ['Electro DMG', 'ATK%'], circlet: ['Crit Rate', 'Crit DMG'] },
        subStats: ['Energy Recharge', 'Crit Rate', 'Crit DMG', 'ATK%'],
        talent: ['Skill', 'Burst', 'Normal Attack'],
        tip: 'Set up her off-field Electro, shield, and buffs, then swap to your carry — she is a low-maintenance one-rotation support.',
        note: 'Ineffa provides off-field Electro damage, shielding and Lunar-Charged support in one slot. She is Flins\' designed partner and also batteries Raiden or Clorinde teams nicely.',
      },
    },
  },
  columbina: {
    roles: {
      'LUNAR REACTION SUPPORT': {
        recommended: true,
        weapons: [W('nocturnes-curtain-call'), W('prototype-amber', [5]), W('favonius-codex'), W('etherlight-spindlelute')],
        artifacts: [A('silken-moons-serenade'), A('aubade-of-morningstar-and-moon'), A('noblesse-oblige')],
        mainStats: { sands: ['HP%', 'Energy Recharge'], goblet: ['HP%'], circlet: ['Crit DMG'] },
        subStats: ['Crit Rate', 'Crit DMG', 'HP%', 'Energy Recharge'],
        talent: ['Burst', 'Skill', 'Normal Attack'],
        tip: 'Aim for roughly 35-40k HP, high Crit DMG (she gets free Crit Rate from her kit), and 160-200% ER depending on weapon and team.',
        note: 'Columbina is an HP-scaling Hydro support who amplifies the new Lunar reactions from the bench. Burst and Skill are equal priority; her Normal Attacks can stay at 1. Prototype Amber is a fantastic F2P option since her ER needs are heavy.',
      },
    },
  },
  aino: {
    roles: {
      'HYDRO SUPPORT': {
        recommended: true,
        weapons: [W('flame-forged-insight'), W('forest-regalia'), W('katsuragikiri-nagamasa'), W('favonius-greatsword'), W('sacrificial-greatsword')],
        artifacts: [A('silken-moons-serenade'), A('noblesse-oblige'), A('+20%_er_set', '+20%_er_set'), A('instructor')],
        mainStats: { sands: ['Elemental Mastery', 'Energy Recharge'], goblet: ['Elemental Mastery'], circlet: ['Elemental Mastery'] },
        subStats: ['Elemental Mastery', 'Energy Recharge'],
        talent: ['Skill', 'Burst', 'Normal Attack'],
        tip: 'EM-focused budget support for Lunar-Bloom teams — her off-field Hydro keeps blooms flowing.',
        note: 'Aino is a friendly 4-star Hydro enabler from Nod-Krai. She is a budget stand-in for premium Hydro slots in Lauma/Nefer bloom teams and an easy pickup for newer accounts.',
      },
    },
  },
  durin: {
    roles: {
      'PYRO DPS': {
        recommended: true,
        weapons: [W('athame-artis'), W('lightbearing-moonshard'), W('mistsplitter-reforged'), W('primordial-jade-cutter'), W('heretics-molten-blade'), W('the-black-sword')],
        artifacts: [A('heart-of-the-furnace'), A('crimson-witch-of-flames'), A('gladiators-finale')],
        mainStats: { sands: ['ATK%', 'Elemental Mastery'], goblet: ['Pyro DMG'], circlet: ['Crit Rate', 'Crit DMG'] },
        subStats: ['Crit Rate', 'Crit DMG', 'ATK%', 'Elemental Mastery'],
        talent: ['Normal Attack', 'Skill', 'Burst'],
        tip: 'Fresh release — check the KQM guide for refined numbers as theorycrafting settles.',
        note: 'Durin is a Pyro sword DPS from the Nod-Krai era. Build him like a classic crit-stacking Pyro carry: Vaporize with a Hydro partner or Melt with Cryo support. Early build advice here is provisional.',
      },
    },
  },
  dahlia: {
    roles: {
      'HYDRO SUPPORT / BATTERY': {
        recommended: true,
        weapons: [W('sacrificial-sword'), W('favonius-sword'), W('festering-desire', [5]), W('skyward-blade')],
        artifacts: [A('noblesse-oblige'), A('+20%_er_set', '+20%_er_set'), A('tenacity-of-the-millelith')],
        mainStats: { sands: ['Energy Recharge', 'HP%'], goblet: ['HP%'], circlet: ['HP%', 'Healing Bonus'] },
        subStats: ['Energy Recharge', 'HP%'],
        talent: ['Burst', 'Skill', 'Normal Attack'],
        tip: 'Stack ER and HP; he is a set-and-forget support slot.',
        note: 'Dahlia is a 4-star Hydro support who batteries the team and provides utility from the bench. Cheap to build — ER weapon plus any leftover HP pieces gets him working.',
      },
    },
  },
  'traveler-pyro': {
    roles: {
      'PYRO SUPPORT': {
        recommended: true,
        weapons: [W('favonius-sword'), W('skyward-blade'), W('festering-desire', [5]), W('the-alley-flash')],
        artifacts: [A('scroll-of-the-hero-of-cinder-city'), A('crimson-witch-of-flames'), A('noblesse-oblige')],
        mainStats: { sands: ['ATK%', 'Energy Recharge'], goblet: ['Pyro DMG'], circlet: ['Crit Rate', 'Crit DMG'] },
        subStats: ['Energy Recharge', 'Crit Rate', 'Crit DMG', 'ATK%'],
        talent: ['Skill', 'Burst', 'Normal Attack'],
        tip: 'Gains Nightsoul points in Natlan teams; the Skill leaves a Pyro field for steady application.',
        note: 'Pyro Traveler offers accessible off-field Pyro with Nightsoul synergy for Natlan teams — a serviceable budget enabler for Melt/Vape/Overload.',
      },
    },
  },
};
