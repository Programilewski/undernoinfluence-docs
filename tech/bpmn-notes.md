# BPMN in UNI — Usage Notes

BPMN fits UNI as a **documentation and planning tool** for multi-actor workflows, not as a runtime engine. No BPMN engine needed — Laravel controllers and Filament actions handle orchestration.

## High-value processes to model

### 1. Venue Claim Flow (highest priority)

The most complex process in UNI. Spans 3 actors (visitor, owner, admin) and 2 systems (public site, admin panel).

- Branching: approve/reject
- State transitions: `pending` → `approved` / `rejected`
- Side effects: email notification, role assignment, panel access grant
- Code spread across: `VenueClaimController`, `VenueClaimsResource` approve/reject actions, `VenueClaim` model

### 2. Product Freshness Lifecycle

A cycle, not a linear flow — BPMN timer events model decay naturally.

- Owner confirms → `confirmed_at` updates → 90-day decay timer starts → product visually dims → owner re-confirms or product goes stale

### 3. Venue Data Lifecycle

Multiple actors touch the same entity at different stages.

- Manual admin creation → products attached → menu check → verified toggle → owner claims → owner edits limited fields

## Recommended approach

- Store `.bpmn` files (editable in bpmn.io) alongside exported SVGs in `docs/processes/`
- Use for onboarding, stakeholder alignment, and planning Phase 2 complexity (credibility scoring, end-user registration, B2B analytics)

## Where BPMN is not worth it

- Simple CRUD (category/product management)
- PostHog event tracking (instrumentation, not a business process)
- Static pages
