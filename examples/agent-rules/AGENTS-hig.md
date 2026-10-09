# Agent instructions — The Web HIG

Pinned contract: The Web HIG v1.13.0  
Default context: `docs/hig/HIG-QUICK.md` — *Follow The Web HIG Quick Reference.*  
Practical guide: `docs/hig/HIG-LITE.md`  
Topic index: `docs/hig/rules/manifest.yaml`  
Full spec: `docs/hig/HIG.md` (edge cases only)  
Archetype map: `docs/hig-scope.md`

## Mandatory workflow for UI / CSS / front-end tasks

1. **Archetype first** — `content` | `commerce` | `application` | `auth`; for **content**, resolve **surface** (`document` | `hybrid` | `experience`) from `hig-scope.md` (**HIG-EXP-001**)
2. **Layer 1** — read `HIG-QUICK.md` for the 98-rule Quick Reference
3. **Layer 2** — open `HIG-LITE.md` when building features or you need rule ID links
4. **Archetype pack** — load `rules/archetypes/<archetype>.md` → preload default modules
5. **Layer 2 modules** — match task against `rules/manifest.yaml`; load referenced `rules/*.md` module (and `framework/*.md` if applicable)
6. **Layer 0 matrix** — only enforce mandatory/conditional rules for that archetype (`rules/applicability.md`)
7. **Layer 7 guardrails** — see YAML below (source of truth for agent behavior)
8. **Layer 3** — open full `HIG.md` only for edge cases or spec conflicts
9. **Simplicity** — prefer the simplest implementation that satisfies applicable requirements (HIG-SIM-001)
10. **Cite rule IDs** when declining conflicting requests

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

When the user asks for something that violates the HIG, implement the compliant alternative and state which rule blocked the request.
