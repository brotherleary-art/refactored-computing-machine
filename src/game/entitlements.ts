export type EntitlementId =
  | 'founder_bronze'
  | 'founder_silver'
  | 'founder_gold'
  | 'season_zero_premium'
  | 'explorers_guild_monthly';

export interface EntitlementDefinition {
  id: EntitlementId;
  label: string;
  productType: 'one_time' | 'subscription';
  grants: string[];
  competitivePower: false;
}

export const ENTITLEMENTS: Record<EntitlementId, EntitlementDefinition> = {
  founder_bronze: {
    id: 'founder_bronze',
    label: 'Founder Bronze',
    productType: 'one_time',
    competitivePower: false,
    grants: ['founder-badge', 'portrait-frame-bronze', 'city-banner-bronze'],
  },
  founder_silver: {
    id: 'founder_silver',
    label: 'Founder Silver',
    productType: 'one_time',
    competitivePower: false,
    grants: ['founder-badge', 'portrait-frame-silver', 'city-banner-silver', 'city-decoration-relic-plinth'],
  },
  founder_gold: {
    id: 'founder_gold',
    label: 'Founder Gold',
    productType: 'one_time',
    competitivePower: false,
    grants: ['founder-badge', 'portrait-frame-gold', 'city-banner-gold', 'city-decoration-relic-plinth', 'hero-cosmetic-founder'],
  },
  season_zero_premium: {
    id: 'season_zero_premium',
    label: 'Season Zero Premium',
    productType: 'one_time',
    competitivePower: false,
    grants: ['season-zero-premium-track', 'season-zero-profile-frame'],
  },
  explorers_guild_monthly: {
    id: 'explorers_guild_monthly',
    label: "Explorer's Guild",
    productType: 'subscription',
    competitivePower: false,
    grants: ['guild-monthly-cosmetic-drop', 'guild-history-archive', 'guild-expedition-quality-of-life'],
  },
};

export interface PlayerEntitlement {
  entitlementId: EntitlementId;
  source: 'stripe' | 'app_store' | 'play_store' | 'admin';
  externalTransactionId: string;
  grantedAt: number;
  expiresAt?: number;
  revokedAt?: number;
}

export const hasActiveEntitlement = (
  entitlements: PlayerEntitlement[],
  id: EntitlementId,
  now = Date.now()
): boolean =>
  entitlements.some(item =>
    item.entitlementId === id &&
    !item.revokedAt &&
    (!item.expiresAt || item.expiresAt > now)
  );

// Server-side fulfillment rule:
// Never grant an entitlement from client purchase UI alone. Grant only after
// a verified provider event or verified server-side transaction lookup.
