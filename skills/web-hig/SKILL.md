---
name: web-hig
description: >-
  Enforces The Web HIG on UI, CSS, and front-end work: archetype resolution,
  HIG-QUICK progressive loading, and Layer 7 guardrails (tokens, motion, a11y, SSR).
  Use when writing or changing interface code, components, styles, forms, or when
  the user mentions The Web HIG, HIG-QUICK, accessibility, or design tokens.
---

# The Web HIG

Pinned contract: The Web HIG v1.13.0  
Read `docs/hig/HIG-QUICK.md` (or repo `HIG-QUICK.md`) — do not paste the Quick Reference into replies.

### How Quick counts relate to rule IDs

- **98** numbered imperatives in HIG-QUICK (Layer 1 default context).
- **76** stable **`HIG-*` IDs** in `docs/hig/rules/registry.yaml` (or repo `rules/registry.yaml`) — cite these in PRs and when declining requests.
- **98 ≠ 76:** Quick bullets are heuristics; the registry is the canonical ID set. Bullets without inline **`HIG-*`** are **Quick-only** — escalate to HIG-LITE / INDEX for IDs. Optional map: `rules/quick-rule-map.yaml`.

## When to apply

Any UI, CSS, layout, component, form, or front-end architecture change.

## Workflow

1. Read the product archetype map (`docs/hig-scope.md` if present).
2. Resolve the page archetype: `content` | `commerce` | `application` | `auth`.
3. For **content**, resolve **surface** from scope: `document` (default) | `hybrid` | `experience` (**HIG-EXP-001**); preload `docs/hig/rules/expressive-surface.md` when surface is hybrid or experience.
4. Apply **Layer 1** default context: `docs/hig/HIG-QUICK.md` — follow The Web HIG Quick Reference.
5. Open **Layer 2** practical guide (`docs/hig/HIG-LITE.md`) when building features or you need rule ID links.
6. Load archetype pack: `docs/hig/rules/archetypes/<archetype>.md` → preload default modules.
7. On topic match, load Layer 2 module from `docs/hig/rules/manifest.yaml`. Load `docs/hig/framework/*.md` when stack-specific.
8. Escalate to **Layer 3** full spec (`docs/hig/HIG.md`) only for edge cases or conflicts.
9. Apply the Layer 0 mandatory/optional matrix from `docs/hig/rules/applicability.md`.
10. Obey the Layer 7 guardrails below. Prefer tokens and semantic HTML over one-off styles.
11. Prefer the simplest implementation that satisfies applicable HIG requirements (HIG-SIM-001).
12. Cite rule IDs when declining conflicting requests (e.g. `HIG-A11Y-003`).

```yaml
agent_enforcement_rules:
  scope:
    resolve_archetype_first: true
    resolve_content_surface: true
    apply_layer0_matrix: true
    prefer_simplest_compliant_implementation: true
    default_context: HIG-QUICK.md
    progressive_loading:
      layer_1: HIG-QUICK.md
      layer_2: HIG-LITE.md
      layer_2_modules: rules/manifest.yaml
      layer_2_archetypes: rules/archetypes/{archetype}.md
      layer_3: HIG.md
      preamble: HIG-CORE.md

  styling_constraints:
    - id: HIG-TOK-001
      rule: disallow_raw_hex_colors_outside_token_files
      severity: error
    - id: HIG-TOK-002
      rule: require_semantic_or_component_tokens
      severity: error
    - id: HIG-MOT-001
      rule: prohibit_transition_all_application_css
      severity: error
    - id: HIG-MOT-002
      rule: require_motion_duration_tokens
      severity: error
    - id: HIG-MOT-003
      rule: prohibit_decorative_micro_animations
      severity: error
    - id: HIG-MOT-004
      rule: micro_animation_max_ms
      value: 300
      scope: micro_feedback_only
      severity: error
    - id: HIG-MOT-005
      rule: micro_feedback_prefers_transform_opacity
      severity: warning
    - id: HIG-CQ-001
      rule: prefer_container_queries_for_component_internal_layout
      severity: warning
    - id: HIG-CQ-002
      rule: require_container_queries_when_multi_context_reuse
      severity: error
    - id: HIG-UX-001
      rule: require_logical_properties
      severity: error
    - id: HIG-A11Y-001
      rule: require_reduced_motion_media_query
      severity: error

  server_rendering_constraints:
    - id: HIG-SSR-001
      rule: default_to_server_rendering
      severity: error
    - id: HIG-SSR-002
      rule: require_streaming_boundary_for_slow_async_regions
      severity: warning
    - id: HIG-SSR-003
      rule: require_form_pending_states_on_server_mutations
      severity: error

  accessibility_constraints:
    - id: HIG-A11Y-002
      rule: target_standard
      value: "WCAG 2.2 AA"
      severity: error
    - id: HIG-A11Y-003
      rule: prefer_native_html_over_aria
      severity: error
    - id: HIG-A11Y-004
      rule: require_accessible_name_on_icon_buttons
      severity: error
    - id: HIG-A11Y-005
      rule: require_alt_text_on_images
      severity: error
    - id: HIG-A11Y-006
      rule: require_visible_focus_styles
      severity: error
    - id: HIG-A11Y-007
      rule: min_target_size_px
      value: 24
      severity: error
      note: "24px MUST floor (WCAG 2.5.8); 44px touch is HIG SHOULD only — not mandatory"
    - id: HIG-A11Y-008
      rule: modal_focus_containment
      severity: error

  mutation_constraints:
    - id: HIG-MUT-001
      rule: no_optimistic_destructive_confirmation
      severity: error
```

If a request conflicts with the HIG, follow the HIG and note the conflict with the relevant rule ID in the change summary.
