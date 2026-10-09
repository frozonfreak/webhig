# The Web HIG

This project follows The Web HIG v1.13.0.

- **Quick Reference (Layer 1):** `docs/hig/HIG-QUICK.md` — *Follow The Web HIG Quick Reference.*
- **Practical guide (Layer 2):** `docs/hig/HIG-LITE.md` + `docs/hig/rules/manifest.yaml`
- **Full spec (Layer 3):** `docs/hig/HIG.md` (edge cases only)
- **Archetype map:** `docs/hig-scope.md`

## Before UI changes

1. Resolve archetype (`content` | `commerce` | `application` | `auth`) from the scope map; for **content**, resolve **surface** (`document` | `hybrid` | `experience`) per **HIG-EXP-001**.
2. Read HIG-QUICK.md for the 98-rule Quick Reference.
3. Open HIG-LITE.md when building features or you need rule ID links.
4. Load archetype pack from `rules/archetypes/<archetype>.md` → preload default modules.
5. Match task keywords against `rules/manifest.yaml` → load matching `rules/*.md` module (and `framework/*.md` if applicable).
6. Apply Layer 0 matrix from `rules/applicability.md`.
7. Enforce Layer 7 rules below.
8. Prefer the simplest compliant implementation (HIG-SIM-001).
9. Cite rule IDs when declining conflicting requests.

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
    - id: HIG-MOT-001
      rule: prohibit_transition_all_application_css
      severity: error
    - id: HIG-MOT-004
      rule: micro_animation_max_ms
      value: 300
      scope: micro_feedback_only
      severity: error
    - id: HIG-CQ-001
      rule: prefer_container_queries_for_component_internal_layout
      severity: warning
    - id: HIG-CQ-002
      rule: require_container_queries_when_multi_context_reuse
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
  accessibility_constraints:
    - id: HIG-A11Y-002
      rule: target_standard
      value: "WCAG 2.2 AA"
      severity: error
    - id: HIG-A11Y-003
      rule: prefer_native_html_over_aria
      severity: error
    - id: HIG-A11Y-007
      rule: min_target_size_px
      value: 24
      severity: error
      note: "24px MUST floor (WCAG 2.5.8); 44px touch is HIG SHOULD only — not mandatory"
  mutation_constraints:
    - id: HIG-MUT-001
      rule: no_optimistic_destructive_confirmation
      severity: error
```

Do not paste the entire HIG into responses. Cite the relevant rule ID when declining a conflicting request.
