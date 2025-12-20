---
name: dark_pattern_review
description: Conducts a UX audit to identify, analyze, and remediate dark patterns in user interfaces. Produces a risk matrix and improvement suggestions. (執行 UX 審查以識別、分析和修復使用者介面中的暗黑模式。產出風險矩陣與改善建議。)
---

# Dark Pattern Design Review Skill (暗黑模式設計審查技能)

This skill guides the agent in performing a specialized User Experience (UX) audit focused on "Dark Patterns" or "Deceptive Design".
本技能引導 Agent 執行專注於「暗黑模式」(Dark Patterns) 或「欺騙性設計」(Deceptive Design) 的專業使用者體驗 (UX) 審查。

## 1. Context & Trigger (Layer 1) / 情境與觸發 (第一層)
**When to load this skill (何時載入本技能):**
- User requests a "Design Review", "UX Audit", or "Ethical Check".
  (當使用者請求「設計審查」、「UX 稽核」或「倫理檢查」時。)
- The task involves analyzing screenshots, user flows, or wireframes.
  (當任務涉及分析螢幕截圖、使用者流程或線框圖時。)
- Key terms: "Dark Pattern", "Deceptive Design", "Risk Matrix", "Compliance".
  (關鍵字：「暗黑模式」、「欺騙性設計」、「風險矩陣」、「合規性」。)

## 2. Methodology (Layer 2) / 方法論 (第二層)

### Phase 1: Detection (階段一：偵測)
Scan the provided UI for specific manipulative classes:
(掃描提供的 UI 以尋找特定的操控類別：)
1.  **Metric Manipulation (指標操控)**: False Urgency (timers), Social Proof (fake reviews).
    (虛假急迫性（倒數計時器）、社交證明（假評論）。)
2.  **Navigation Constraints (導航限制)**: Roach Motel (hard to cancel), Data Hostage (no export).
    (捕鼠夾（難以取消）、資料挾持（無法匯出）。)
3.  **Emotional Steering (情緒引導)**: Confirmshaming (guilt-tripping copy), Sunk Cost (investment traps).
    (確認羞辱（帶有罪惡感的文案）、沈沒成本（投資陷阱）。)
4.  **Visual Interference (視覺干擾)**: Hidden costs, unequal button hierarchy.
    (隱藏成本、不對等的按鈕層級。)

### Phase 2: Assessment (The Risk Matrix) / 階段二：評估 (風險矩陣)
Evaluate findings based on User Harm vs. Business Impact.
(根據「使用者傷害」與「商業影響」來評估發現。)

*   **HIGH RISK (Red) / 高風險 (紅)**: Financial loss, blocking exit rights, legal violations (GDPR).
    (財務損失、阻礙退出權利、法律違規 (GDPR)。)
    *   *Action*: Immediate removal required. (*行動*：必須立即移除。)
*   **MEDIUM RISK (Orange) / 中風險 (橘)**: Emotional manipulation, cognitive overload, misleading promises.
    (情緒操縱、認知負荷過重、誤導性承諾。)
    *   *Action*: Redesign with neutral framing. (*行動*：以中性框架重新設計。)
*   **LOW RISK (Yellow) / 低風險 (黃)**: Annoyance, aggressive promotion, aesthetic clutter.
    (煩擾、激進推銷、視覺雜亂。)
    *   *Action*: Monitor and reduce friction. (*行動*：監控並減少摩擦。)

### Phase 3: Remediation (階段三：修復)
Propose "Ethical Alternatives" for each pattern.
(為每種模式提出「倫理替代方案」。)
- **Instead of Confirmshaming** -> Use Neutral Confirmation.
  (以「中性確認」取代「確認羞辱」。)
- **Instead of Roach Motel** -> Use "One-Click Cancel".
  (以「一鍵取消」取代「捕鼠夾」。)
- **Instead of Sunk Cost** -> Reveal pricing *before* heavy input.
  (以「投入前揭露價格」取代「沈沒成本」。)

## 3. Resources & Templates (Layer 3) / 資源與範本 (第三層)
*Load these files only when generating specific outputs.*
*(僅在產生特定產出時讀取這些檔案。)*

- **Report Template (報告範本)**: `auth_design_review.md`
    - Use for creating the detailed text-based analysis and Deep Dive sections.
      (用於建立詳細的文字分析與深度探討章節。)
- **Presentation Template (簡報範本)**: `design_review.html`
    - Use for creating interactive "Before vs. After" slide decks.
      (用於建立互動式的「改善前後對照」投影片。)
- **Glossary (詞彙表)**: `design_review.html` (See `#lexiconSidebar`)
    - Definitions for standardized terms like *Forced Precision* and *Narrow Framing*.
      (定義標準化術語，如 *Forced Precision* (強制精確) 與 *Narrow Framing* (框架狹隘)。)
