# THE SHATTERED AGES — Phase 0 Architecture

## Product
Standalone original persistent strategy RPG / 4X title.

## Core loop
GATHER → BUILD → RESEARCH → EXPLORE → FIGHT → DISCOVER → EXPAND → GOVERN

## Vertical-slice architecture

### Client
- Mobile-first game client
- Desktop-adapted layout
- City screen
- World map
- Heroes
- Expedition/Ruin interface
- Alliance shell
- Store shell

### Authoritative backend
- Authentication and player profile
- Settlement and building state
- Resource economy and ledger
- Timers and queues
- Inventory and storage
- Combat resolution
- World map state
- Expedition state
- Hero state
- Alliance state
- Purchase entitlements
- Audit logging

### Services
1. Auth Service
2. Game API
3. Economy Service
4. World State Service
5. Combat Service
6. Expedition Service
7. Social/Alliance Service
8. Live Ops Service
9. Entitlement Service
10. Analytics pipeline

### Storage principles
- Never trust client-side resource balances.
- Every premium or scarce resource change gets a ledger record.
- Purchases grant entitlements only after verified server-side payment confirmation.
- Build timers are server-time based.
- Battle outcomes are calculated server-side.

## Core data entities
User, PlayerProfile, RealmServer, Settlement, Building, BuildingLevel, Inventory, ResourceTransaction, Hero, HeroTrait, Dynasty, FamilyMember, Army, Unit, Equipment, WorldTile, ResourceNode, Ruin, Expedition, ResearchNode, PlayerResearch, Alliance, AllianceMember, AllianceTerritory, Battle, BattleReport, Quest, QuestProgress, Season, Purchase, Entitlement, Notification, AuditLog.

## MVP building chain
Town Hall → Farm → Lumber Camp → Quarry → Storehouse → Barracks → Scout Lodge → Forge → Academy → Expedition Hall → Ancient Research Annex.

Parallel support buildings: Granary, Clay Pit, Iron Mine, Infirmary, Wall.

## Starter resource flow
Food → population support, troop upkeep.
Timber → buildings, siege, repairs.
Stone → fortifications, advanced buildings.
Clay → masonry, storage, early industry.
Iron → weapons, tools, military upgrades.

## First-session progression
1. Repair shelter
2. Build farm
3. Build lumber camp
4. Build storehouse
5. Recruit scout
6. Explore nearby tile
7. Discover resource node
8. Encounter hostile patrol
9. Train troops
10. Fight first PvE battle
11. Discover buried structure
12. Begin excavation
13. Reveal first ruin

## Originality guardrails
- No Wheel/Pattern/One Power analogue.
- No recognizable dynasty/house copies from existing fantasy franchises.
- No copied maps, city layouts, UI, art, terminology, lore, characters, or quests.
- Resonance must have costs, specialization, and consequences.
- The Between is a distinct dimensional environment, not hyperspace or a cosmic wheel.

## Monetization architecture
Use test mode first. Planned products:
- Founder Pack I: $9.99
- Founder Pack II: $24.99
- Founder Pack III: $49.99
- Cosmetic bundles
- Optional seasonal pass
- Optional Explorer's Guild membership

No direct sale of unbeatable troops or exclusive combat power.

Payment fulfillment rules:
- Server creates checkout/payment session.
- Webhook verifies success.
- Entitlement service records grant idempotently.
- Client reads entitlements from backend.
- Refunds/reversals revoke or adjust entitlements according to policy.

## First engineering milestone
A player can create/load an account, restore a damaged settlement, collect five resources, build prerequisite-gated structures, send a scout, win a PvE battle, and open the first ruin. All state persists server-side.
