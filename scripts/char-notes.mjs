// Curated playstyle + downsides notes, merged into builds.json by build-data.mjs.
// Chars without an entry get an auto-generated playstyle from their role.
export const charNotes = {
  neuvillette: {
    playstyle: 'Hold Charged Attack to channel his Judgment beam; keep absorbing droplets to sustain the channel. Very simple rotation — supports set up, then you stand and beam.',
    downsides: 'Locked in place while channeling (needs a shield or interruption resistance), struggles vs highly mobile enemies, and heavily incentivizes his signature weapon/C1.',
  },
  mavuika: {
    playstyle: 'Burst for the huge frontloaded nuke, then ride the Flamestrider bike with Normal/Charged attacks. Learn her charged-cancel combos for top output.',
    downsides: 'Fighting Spirit management takes practice, her best combos are execution-heavy, and she wants premium Natlan teammates (Citlali/Xilonen) to peak.',
  },
  skirk: {
    playstyle: 'Build Serpent\'s Subtlety off-field via Hydro/Cryo rifts, then go on-field for a fast, aggressive melee window. Quick, high-APM gameplay.',
    downsides: 'Needs specific Hydro/Cryo teammates to generate rifts (team-locked), and her damage drops sharply outside her empowered window.',
  },
  varesa: {
    playstyle: 'Plunge-attack loop — Skill hop into plunge, repeat, then unleash her enhanced Burst in Fiery Passion state.',
    downsides: 'Very energy hungry, plunge loops feel clunky vs small/mobile enemies, and she is nearly hard-locked to Overload teams for top results.',
  },
  mualani: {
    playstyle: 'Surf on her shark, tag enemies to stack Wave Momentum, then bite for a huge Vaporized nuke every few seconds. Mobile and fun.',
    downsides: 'Nuke-only profile (weak vs waves of small enemies), needs C1/C2 Mona or Sucrose-tier support to shine, and surfing can overshoot targets.',
  },
  arlecchino: {
    playstyle: 'Apply Blood-Debt with Skill, absorb it to gain Bond of Life, then burn it down with empowered Normal attacks. Aggressive hit-and-run melee.',
    downsides: 'Cannot be healed by others while in her Bond of Life state (bring shields), and her pre-C1 gameplay is interruption-prone.',
  },
  furina: {
    playstyle: 'Cast Skill, swap out, and let her Salon Members drain and damage. Manage Arkhe alignment and keep the team healing to stack Fanfare.',
    downsides: 'Drains your team\'s HP constantly — mandatory team-wide healer — and her buff ramps up over the rotation rather than being instant.',
  },
  columbina: {
    playstyle: 'Off-field Moonsign enabler — set up her Hydro presence, then amplify Lunar reactions for the on-field carry.',
    downsides: 'Team-dependent by design: outside Lunar/Moonsign teams much of her kit does nothing special.',
  },
  nefer: {
    playstyle: 'On-field Dendro carry built around Lunar-Bloom — weave Charged Attacks with EM-stacked gear while Lauma amplifies.',
    downsides: 'Wants a very specific Nod-Krai core (Lauma especially); generic Dendro teams waste her Lunar scaling.',
  },
  flins: {
    playstyle: 'On-field Electro polearm — empowered strikes trigger Lunar-Charged with an off-field Hydro partner. Straightforward and fast.',
    downsides: 'Needs Ineffa/Hydro support to enable Lunar-Charged; without the reaction he is a mid on-field Electro.',
  },
  ineffa: {
    playstyle: 'Set-and-forget off-field Electro with a shield — cast and swap while she batteries and buffs Lunar-Charged.',
    downsides: 'Mostly a Lunar-Charged specialist; in classic Electro teams Fischl often matches her for less.',
  },
  lauma: {
    playstyle: 'Off-field Dendro/EM amplifier — quick setup, then she boosts Lunar-Bloom and shreds for the team.',
    downsides: 'Her value collapses outside Bloom/Lunar-Bloom teams; not a generic buffer.',
  },
  citlali: {
    playstyle: 'Cast Skill for a shield plus off-field Cryo, Burst for damage, swap out. Low field time, high utility.',
    downsides: 'Cryo application is on the slower side, and her shred passive requires Pyro/Hydro teammates to activate.',
  },
  xilonen: {
    playstyle: 'Quick swap-in, roller-blade a few Normal attacks to activate her RES shred samplers, then leave. Also heals at Burst.',
    downsides: 'Shreds only the elements matching your team\'s composition, and DEF-scaling gear does not transfer from other characters.',
  },
  escoffier: {
    playstyle: 'Off-field Cryo sub-DPS and healer — Skill turret plus Burst, with a big Hydro/Cryo RES shred for the team.',
    downsides: 'Shred requires Hydro+Cryo-leaning teams; in other comps she is just a decent healer.',
  },
  bennett: {
    playstyle: 'Burst on cooldown to drop his circle — massive ATK buff plus healing for whoever stands in it. Skill-spam for energy in between.',
    downsides: 'Buff requires staying inside his circle (bad vs mobile bosses), and his Pyro aura in the field can disturb some reaction teams.',
  },
  'kaedehara-kazuha': {
    playstyle: 'Skill into plunge to group enemies and Swirl, Burst for sustained field, swap. Short, elegant rotations.',
    downsides: 'Grouping is wasted on single heavy targets, and he wants 4pc VV plus decent EM investment before he outperforms cheaper anemos.',
  },
  nahida: {
    playstyle: 'Hold Skill to mark enemies with Seeds, then swap — her Tri-Karma triggers off teammates\' reactions all rotation.',
    downsides: 'On-field damage is modest; she is a catalyst for reactions rather than a carry in most teams.',
  },
  'raiden-shogun': {
    playstyle: 'Skill for off-field Electro, then Burst for a long empowered sword window that refunds team energy.',
    downsides: 'Her damage concentrates in the Burst window — if it gets interrupted or misses the window, the rotation suffers.',
  },
  'hu-tao': {
    playstyle: 'Skill to convert HP into ATK, then Charged Attack cancel loops for big Vaporize hits. Rewards tight execution.',
    downsides: 'Lives below 50% HP for her passive (risky), charged-cancel technique has a learning curve, and she is stamina hungry.',
  },
  ayaka: null,
  'kamisato-ayaka': {
    playstyle: 'Alternate sprint (Cryo infusion) with Normal attacks, Burst for the big cutting storm. Comfortable freeze gameplay.',
    downsides: 'Burst can drift past moving enemies, and freeze teams fall off vs bosses that cannot be frozen.',
  },
  xiangling: {
    playstyle: 'Burst to launch Pyronado, then swap and keep it spinning through teammates\' rotations. Skill turret in between.',
    downsides: 'Extremely energy hungry (needs ER and often a Pyro battery), and contributes little outside her Burst.',
  },
  xingqiu: {
    playstyle: 'Burst then Skill, swap out — rain swords follow your carry\'s Normal attacks with Hydro application and damage.',
    downsides: 'High energy needs, and his Hydro application rate is outclassed by Yelan/Furina in premium teams.',
  },
  yelan: {
    playstyle: 'Burst then Skill dash, swap — her dice follow the on-fielder. Occasionally re-dash for stacks.',
    downsides: 'Very Burst-reliant (wants 200%+ ER), and her buff ramps over the rotation rather than frontloading.',
  },
  zhongli: {
    playstyle: 'Hold Skill for the strongest shield in the game plus universal RES shred; Burst petrifies. Then forget he exists.',
    downsides: 'Pure comfort pick — damage contribution is minimal without heavy investment, and the shield can encourage lazy dodging habits.',
  },
  fischl: {
    playstyle: 'Summon Oz and swap — he zaps for the whole rotation. Recast via Burst. Zero-effort off-field Electro.',
    downsides: 'Oz has a fixed duration/uptime gap pre-C6, and she brings no defensive utility.',
  },
  sucrose: {
    playstyle: 'Skill and Burst to group enemies, Swirl elements, and share her EM with the team. Driver or quick-swap.',
    downsides: 'Grouping is weaker than Kazuha\'s, and her buffs favor reaction teams only — crit carries gain little.',
  },
  kinich: {
    playstyle: 'Grapple around enemies with his Skill loops while Ajaw fires — mobile, angular gameplay built around Burning teams.',
    downsides: 'The grapple loop is awkward in tight spaces or vs moving targets, and he really wants Emilie/Burning setups.',
  },
  clorinde: {
    playstyle: 'Bond of Life duelist — pistol-blade combos convert BoL into healing and damage. Fast, dodge-heavy melee.',
    downsides: 'Self-sufficient but complex resource loop; damage falls behind top carries without Overload/aggravate support.',
  },
  chasca: {
    playstyle: 'Fly on her gun, charging multi-element bullets, then release homing shots. Great AoE coverage and mobility.',
    downsides: 'Needs 2+ PHEC (non-Anemo/Geo) teammates for bullet conversion, and charging leaves her exposed without IR.',
  },
  navia: {
    playstyle: 'Collect Crystallize shards, then fire her shotgun Skill point-blank for huge Geo hits. Punchy, immediate gameplay.',
    downsides: 'Needs constant Crystallize generation (two+ element teammates), and Geo lacks reaction amplification.',
  },
  emilie: {
    playstyle: 'Off-field Burning specialist — her Lumidouce cases tick away while Burning is active. Set up and swap.',
    downsides: 'Locked to Burning teams for her passive; outside them she is a modest Dendro sub-DPS.',
  },
  odette: {
    playstyle: 'Off-field Cryo enabler — summon her Dance Double, cast the duet when available, then swap. Frontloaded damage suits quick-swap comps.',
    downsides: 'Brand-new Stellar mechanics require Snezhnaya teammates (Sandrone/Alyosha/Mizuki) for full value; generic Cryo teams waste her Linchpin role.',
  },
  sandrone: {
    playstyle: 'On-field Stellar-Conduct carry — she and her Automaton pressure enemies while Cryo+Electro teammates keep the reaction rolling.',
    downsides: 'Team-locked to Stellar-Conduct cores; as a plain Cryo DPS she loses to established carries.',
  },
  alyosha: {
    playstyle: 'Support — ATK and Stellar-Conduct buffs, healing, off-field Electro from Tugarin, and a taunt. Cast and swap.',
    downsides: 'Cannot start Stellar Glimmer himself — always needs a Cryo trigger — and scales heavily with C6.',
  },
  varka: {
    playstyle: 'On-field Anemo hypercarry — Normal/Charged combos buffed by his Hexerei passive and dual-element teammates.',
    downsides: 'Strict teambuilding: wants 2 Anemo + 2 same-element PHEC units plus a Hexerei teammate for full buffs.',
  },
  lohen: {
    playstyle: 'On-field Cryo driver — constant Cryo application feeds Durin\'s melt hits. Steady, rhythmic gameplay.',
    downsides: 'His flagship team is expensive (Durin+Nicole+Citlali) and drops off clearly with substitutes.',
  },
  zibai: {
    playstyle: 'On-field Geo DPS with Nod-Krai Moonsign synergies — sustained damage with crystallize utility.',
    downsides: 'Best team wants Illuga and Moonsign partners; Geo remains reaction-agnostic.',
  },
  durin: {
    playstyle: 'Off-field Pyro (or Dark Decay) dragon — cast and swap while he strafes the field. Two forms for different teams.',
    downsides: 'Form-switching adds team-planning overhead, and he competes with Xiangling/Bennett-tier staples in Pyro slots.',
  },
  nicole: {
    playstyle: 'Shielder-buffer — teamwide ATK% and a sturdy shield. Cast, verify the buff, swap.',
    downsides: 'Buffing value peaks only in teams with multiple damage sources (Durin comps); solo-carry teams may prefer Bennett.',
  },
  prune: {
    playstyle: 'Anemo buffer — VV shred plus ATK%/DMG% for the on-fielder. Simple support rotations.',
    downsides: 'Noticeably better at C2/C6; at C0 Venti-tier alternatives keep pace.',
  },
  wriothesley: {
    playstyle: 'On-field Cryo boxer — chained punches with HP-drain empowered states; now revived as a Stellar-Conduct carry with Odette.',
    downsides: 'Self-drain demands healing, and outside the new Stellar teams his numbers lag modern carries.',
  },
  cyno: {
    playstyle: 'Long empowered Burst windows of fast polearm strikes — commit to extended on-field sequences.',
    downsides: 'Long rotations punish interruptions, and his classic Quickbloom teams have aged; Stellar-Conduct is his comeback.',
  },
  'yae-miko': {
    playstyle: 'Drop three Sesshou turrets, swap out, recast after Burst. Elegant off-field Electro.',
    downsides: 'Turrets can target awkwardly and are stationary; her Burst eats her own turrets pre-C4 planning.',
  },
  nilou: {
    playstyle: 'Dance through Sword/Whirl stances to enable huge Bountiful Bloom cores. Hydro+Dendro-only teams.',
    downsides: 'The strictest teambuilding rule in the game (only Hydro/Dendro allowed), and bloom cores damage your own team without a healer.',
  },
  alhaitham: {
    playstyle: 'Generate Chisel mirrors, then mirror-infused sword combos for Spread damage. Smooth on-field flow.',
    downsides: 'Mirror timing/uptime management takes practice, and he competes with Nefer for the Dendro carry slot now.',
  },
  kokomi: null,
  'sangonomiya-kokomi': {
    playstyle: 'Drop her jellyfish for heals and Hydro, Burst for an empowered on-field healing window. Relaxed gameplay.',
    downsides: 'Zero crit by design (her builds ignore crit entirely), and damage is modest outside dedicated setups.',
  },
  venti: {
    playstyle: 'Burst to vacuum crowds into a hole, Skill for energy. Trivializes small-enemy chambers.',
    downsides: 'Heavy bosses ignore his pull, which deletes most of his value in boss-heavy content.',
  },
  eula: {
    playstyle: 'Stack Grimheart with Skills, Burst, then land the giant Lightfall Sword explosion at the end of her combo.',
    downsides: 'Physical damage has no amplifying reactions and poor RES-shred support; her nuke is lost if the target dies or she gets interrupted first.',
  },
  keqing: {
    playstyle: 'Teleport stiletto into infused sword combos — fast, mobile Aggravate gameplay.',
    downsides: 'Needs Dendro (Aggravate) to stay relevant; pure Electro Keqing lags far behind.',
  },
  qiqi: {
    playstyle: 'Consistent healing from Skill/Normals — and in 7.0 she finally gained a real team home in Stellar-Conduct Cryo cores.',
    downsides: 'No Burst-energy synergy, very low personal damage, and outside Stellar teams she remains a pure healbot.',
  },
};
