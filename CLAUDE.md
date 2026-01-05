# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an **academic project page** for "LLMs as Reviewers: Benchmarking LLM Reviews vs Human Reviews" - a UROP 2025 research project from Vin University. The project benchmarks LLM-generated peer reviews against human reviews using multiple metrics: relevance, specificity, synthesizing ability, LLM-as-a-judge scoring, and LLM detection.

**Key components:**
- Static HTML/CSS/JS website using Bulma CSS framework
- Sample review data in `/static/sample/` directories (human reviews, SEA reviews, Reviewer2 reviews, SWIF2T reviews, Granite model reviews)
- Pipeline visualization and results presentation
- BibTeX citation functionality

## Repository Structure

```
/
├── index.html              # Main project page (863 lines, comprehensive content)
├── static/
│   ├── css/               # Bulma CSS framework + custom styles
│   │   └── index.css      # Custom styles for the project
│   ├── js/                # JavaScript for interactions
│   │   └── index.js       # Carousel, BibTeX copy, scroll-to-top functionality
│   ├── images/            # Project images and pipeline diagrams
│   │   ├── complete_pipeline.{png,pdf}  # Main pipeline diagram
│   │   └── favicon.ico    # Site favicon
│   ├── pdfs/              # PDF assets (papers, posters)
│   ├── videos/            # Video content
│   └── sample/            # Sample review data organized by paper ID
│       └── {paper-id}/    # Each folder contains:
│           ├── human.{txt,json}  # Human review (reference)
│           ├── SEA.txt           # SEA-E model review
│           ├── review2.txt       # Reviewer2-style review
│           └── granite.txt       # IBM Granite 4.0 3B review
└── README.md              # Template documentation (not project-specific)
```

## Website Architecture

This is a **static single-page application** built with:
- **Bulma CSS framework** for responsive layout and components
- **jQuery** for DOM manipulation
- **bulma-carousel** for image/video carousels
- **Font Awesome** for icons
- **Academicons** for academic platform icons (arXiv, etc.)

### Key Sections (in index.html)

1. **Meta tags** (lines 7-108): SEO, Open Graph, Twitter cards, structured data (Schema.org)
2. **Hero section** (lines 159-254): Title, authors, keywords, quick links
3. **Pipeline diagram** (lines 257-269): Visual overview of the review generation workflow
4. **Abstract** (lines 272-294): Project goals and methodology
5. **Datasets** (lines 297-342): NeurIPS 2023 and ICLR 2024 datasets
6. **Methods** (lines 345-425): Reviewer2, SEA family, SWIF2T systems
7. **Metrics** (lines 428-532): Five evaluation metrics explained
8. **Results** (lines 535-650): Preliminary benchmark results in tables
9. **Roadmap** (lines 653-687): Next steps and known limitations
10. **Resources** (lines 690-742): Code, datasets, contact info
11. **References** (lines 745-801): Citations for related work
12. **BibTeX** (lines 805-826): Copy-able citation

### Interactive Features (static/js/index.js)

- **Carousel**: Auto-plays through images/videos every 5 seconds
- **Scroll-to-top button**: Appears after scrolling 300px
- **BibTeX copy**: One-click citation copying with visual feedback
- **Video autoplay**: Videos play when 50% visible, pause when out of view
- **More Works dropdown**: For future related projects (template feature)

## Common Development Tasks

### Updating Content

**To modify project description or abstract:**
Edit `index.html` lines 277-290 (Abstract section)

**To add new results:**
Edit the results table at `index.html` lines 546-597

**To update preliminary numbers:**
Replace TODO placeholders in the results table (lines 565-593)

**To add new datasets:**
Add a new column in the Datasets section (`index.html` lines 297-342)

**To add references:**
Add list items in the References section (`index.html` lines 750-794)

**To update authors:**
Edit the author block at `index.html` lines 168-179

**To change GitHub/arXiv links:**
Replace placeholder URLs at lines 25, 27, 102, 209, 700, 715

### Updating Sample Reviews

**Sample review structure:**
- Located in `/static/sample/{paper-id}/`
- Each paper has: `human.txt`, `human.json`, `SEA.txt`, `review2.txt`, `granite.txt`
- JSON format contains structured review metadata

**To add a new sample paper:**
1. Create directory: `/static/sample/{new-paper-id}/`
2. Add review files following the naming convention above
3. Ensure human.json follows the conference-specific template structure

### Styling and Design

**Color scheme:**
- Primary: `#2563eb` (blue, defined in meta theme-color line 52)
- Pills/tags: Semi-transparent blue background `rgba(37,99,235,0.06)`

**Custom CSS classes** (defined in `<style>` block lines 110-132):
- `.pill`: Keyword tags with rounded borders
- `.mono`: Monospace font for code/filenames
- `.callout`: Blue left-border info boxes
- `.tiny`: Smaller text (0.92rem, 85% opacity)

**Responsive behavior:**
Bulma handles mobile responsiveness automatically. Key breakpoints follow Bulma defaults.

### Adding New Metrics

1. Add metric explanation box in Metrics section (follow pattern at lines 433-523)
2. Add corresponding column to results table (lines 546-597)
3. Update the rubric callout at lines 526-530

### Pipeline Diagram

- Current: `static/images/complete_pipeline.png` (with PDF version available)
- To replace: Update both PNG and PDF versions, keep filename or update reference at line 262

## Testing Locally

Since this is a static site:

```bash
# Option 1: Python
python3 -m http.server 8000

# Option 2: Node.js
npx http-server -p 8000

# Then visit: http://localhost:8000
```

## Publishing

This project is designed for **GitHub Pages** deployment:
- Add/commit changes
- Push to the repository
- GitHub Pages will automatically serve from the root directory
- `.nojekyll` file ensures GitHub doesn't process site through Jekyll

## Important Notes

1. **No build process**: This is pure HTML/CSS/JS - no bundling or compilation needed
2. **CDN dependencies**: jQuery, Bulma Carousel, Font Awesome loaded from CDNs
3. **Placeholder content**: Many TODO comments mark incomplete sections (GitHub URLs, arXiv links, final metrics)
4. **Favicon**: Current favicon is at `static/images/favicon.ico` - should be replaced with project-specific icon
5. **Social preview**: Create `static/images/social_preview.png` (1200x630px) for social media sharing
6. **Template origin**: Based on Academic Project Page Template (Nerfies-derived), credit maintained in footer

## Data Format Notes

**Review data structure** (from callout at lines 335-340):
- Each paper has: identifiers, metadata, list of reviews
- Reviews follow conference-specific templates: Summary / Strengths / Weaknesses / Questions for Authors
- Human reviews serve as the ground truth for comparison

**Evaluation systems:**
- **Reviewer2**: Prompt→Review pipeline with aspect prompts
- **SEA family**: SEA-S (standardization), SEA-E (evaluation), SEA-A (analysis)
- **SWIF2T**: Multi-agent system with Controller, Investigator, Planner, Reviewer

## Key Metrics Explained

1. **Relevance**: BLEU/ROUGE text similarity vs paper content
2. **Specificity (SPE)**: BERTScore-based depth measurement vs human reviews
3. **Synthesizing Ability**: External entity grounding via scholarly search
4. **LLM-as-a-Judge**: Rubric-based scoring (1-5 scale) following reviewer guidelines
5. **LLM Detection**: Human-likeness proxy using GPTZero/DetectGPT

## Current Status (as of index.html)

- Preliminary results available for Reviewer2, SEA-E, SWIF2T
- Many metrics still marked "TODO" in results table
- Roadmap targets: Dec 30 - Jan 10, 2025
- Technical report in progress (not yet published)
