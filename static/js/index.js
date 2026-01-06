window.HELP_IMPROVE_VIDEOJS = false;

// More Works Dropdown Functionality
function toggleMoreWorks() {
  const dropdown = document.getElementById("moreWorksDropdown");
  const button = document.querySelector(".more-works-btn");

  if (dropdown.classList.contains("show")) {
    dropdown.classList.remove("show");
    button.classList.remove("active");
  } else {
    dropdown.classList.add("show");
    button.classList.add("active");
  }
}

// Close dropdown when clicking outside
document.addEventListener("click", function (event) {
  const container = document.querySelector(".more-works-container");
  const dropdown = document.getElementById("moreWorksDropdown");
  const button = document.querySelector(".more-works-btn");

  if (container && !container.contains(event.target)) {
    dropdown.classList.remove("show");
    button.classList.remove("active");
  }
});

// Close dropdown on escape key
document.addEventListener("keydown", function (event) {
  if (event.key === "Escape") {
    const dropdown = document.getElementById("moreWorksDropdown");
    const button = document.querySelector(".more-works-btn");
    dropdown.classList.remove("show");
    button.classList.remove("active");
  }
});

// Copy BibTeX to clipboard
function copyBibTeX() {
  const bibtexElement = document.getElementById("bibtex-code");
  const button = document.querySelector(".copy-bibtex-btn");
  const copyText = button.querySelector(".copy-text");

  if (bibtexElement) {
    navigator.clipboard
      .writeText(bibtexElement.textContent)
      .then(function () {
        // Success feedback
        button.classList.add("copied");
        copyText.textContent = "Cop";

        setTimeout(function () {
          button.classList.remove("copied");
          copyText.textContent = "Copy";
        }, 2000);
      })
      .catch(function (err) {
        console.error("Failed to copy: ", err);
        // Fallback for older browsers
        const textArea = document.createElement("textarea");
        textArea.value = bibtexElement.textContent;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);

        button.classList.add("copied");
        copyText.textContent = "Cop";
        setTimeout(function () {
          button.classList.remove("copied");
          copyText.textContent = "Copy";
        }, 2000);
      });
  }
}

// Scroll to top functionality
function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
}

// Show/hide scroll to top button
window.addEventListener("scroll", function () {
  const scrollButton = document.querySelector(".scroll-to-top");
  if (window.pageYOffset > 300) {
    scrollButton.classList.add("visible");
  } else {
    scrollButton.classList.remove("visible");
  }
});

// Video carousel autoplay when in view
function setupVideoCarouselAutoplay() {
  const carouselVideos = document.querySelectorAll(".results-carousel video");

  if (carouselVideos.length === 0) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const video = entry.target;
        if (entry.isIntersecting) {
          // Video is in view, play it
          video.play().catch((e) => {
            // Autoplay failed, probably due to browser policy
            console.log("Autoplay prevented:", e);
          });
        } else {
          // Video is out of view, pause it
          video.pause();
        }
      });
    },
    {
      threshold: 0.5, // Trigger when 50% of the video is visible
    }
  );

  carouselVideos.forEach((video) => {
    observer.observe(video);
  });
}

function escapeHtml(text) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
    // Removed: .replace(/'/g, "&#39;") - single quotes are safe in HTML content
}

function decodeHtml(text) {
  // Manual decode common HTML entities to ensure they're properly handled
  return text
    .replace(/&quot;/g, '"')
    .replace(/&#34;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&#60;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&#62;/g, '>')
    .replace(/&amp;/g, '&'); // Must be last because other entities contain &
}

function applyHighlights(text) {
  // NOTE: Do NOT decode HTML entities - source files already have correct characters
  // Define patterns
  const sectionPattern =
    /\*\*(Summary|Strengths|Weaknesses|Questions|Overall Score|Confidence|Rating|Decision|Metareview|Paper Decision|Soundness|Presentation|Contribution):\*\*/gi;
  const numberPattern = /\b\d+(?:\.\d+)?%?\b/g;
  // More selective keyword pattern
  const keywordPattern = /\b[A-Z][A-Za-z0-9]{2,}(?:[A-Z][a-z]+)*\b/g;

  // Common words to exclude from keyword highlighting
  const excludeWords = new Set(['The', 'This', 'That', 'These', 'Those', 'What', 'Where', 'When', 'Which', 'While', 'With', 'Would', 'Could', 'Should', 'First', 'Second', 'Third', 'However', 'Therefore', 'Moreover', 'Furthermore', 'Additionally', 'Figure', 'Table', 'Section', 'Paper', 'Authors', 'Review', 'Comment', 'Question', 'Answer']);

  // Step 1: Mark section headers with unique markers
  let result = text.replace(
    sectionPattern,
    "\x00SECTION_START\x00$1\x00SECTION_END\x00"
  );

  // Step 2: Mark numbers with unique markers (but not inside existing markers)
  let parts = [];
  let lastIndex = 0;
  let match;

  numberPattern.lastIndex = 0;
  while ((match = numberPattern.exec(result)) !== null) {
    const before = result.substring(lastIndex, match.index);
    // Check if we're inside a marker
    const openCount = (before.match(/\x00[A-Z_]+_START\x00/g) || []).length;
    const closeCount = (before.match(/\x00[A-Z_]+_END\x00/g) || []).length;

    if (openCount === closeCount) {
      parts.push(before);
      parts.push("\x00NUM_START\x00" + match[0] + "\x00NUM_END\x00");
    } else {
      parts.push(before + match[0]);
    }
    lastIndex = match.index + match[0].length;
  }
  parts.push(result.substring(lastIndex));
  result = parts.join('');

  // Step 3: Mark keywords (avoiding markers and common words)
  parts = [];
  lastIndex = 0;

  keywordPattern.lastIndex = 0;
  while ((match = keywordPattern.exec(result)) !== null) {
    const before = result.substring(lastIndex, match.index);

    // Skip if it's a common word
    if (excludeWords.has(match[0])) {
      parts.push(before + match[0]);
    } else {
      // Check if we're inside a marker
      const openCount = (before.match(/\x00[A-Z_]+_START\x00/g) || []).length;
      const closeCount = (before.match(/\x00[A-Z_]+_END\x00/g) || []).length;

      if (openCount === closeCount) {
        parts.push(before);
        parts.push("\x00KEY_START\x00" + match[0] + "\x00KEY_END\x00");
      } else {
        parts.push(before + match[0]);
      }
    }
    lastIndex = match.index + match[0].length;
  }
  parts.push(result.substring(lastIndex));
  result = parts.join('');

  // Step 4: Escape HTML
  result = escapeHtml(result);

  // Step 5: Replace all markers with actual HTML spans
  result = result.replace(
    /\x00SECTION_START\x00(.*?)\x00SECTION_END\x00/g,
    '<span class="highlight"><strong>$1:</strong></span>'
  );
  result = result.replace(
    /\x00NUM_START\x00(.*?)\x00NUM_END\x00/g,
    '<span class="number">$1</span>'
  );
  result = result.replace(
    /\x00KEY_START\x00(.*?)\x00KEY_END\x00/g,
    '<span class="keyword">$1</span>'
  );

  return result;
}

function setupReviewSyncScroll(container) {
  const columns = Array.from(container.querySelectorAll(".review-col__body"));
  if (columns.length < 2) return;

  let isSyncing = false;

  columns.forEach((col) => {
    col.addEventListener("scroll", () => {
      if (isSyncing) return;
      isSyncing = true;
      const ratio = col.scrollTop / (col.scrollHeight - col.clientHeight || 1);
      columns.forEach((other) => {
        if (other === col) return;
        other.scrollTop = ratio * (other.scrollHeight - other.clientHeight);
      });
      isSyncing = false;
    });
  });
}

function formatHumanReview(review) {
  const parts = [];
  const fields = [
    "Summary",
    "Strengths",
    "Weaknesses",
    "Questions",
    "Soundness",
    "Presentation",
    "Contribution",
    "Rating",
    "Confidence",
  ];

  fields.forEach((field) => {
    if (!review[field]) return;
    parts.push(`**${field}:**\n${review[field]}`);
  });

  return parts.join("\n\n");
}

function loadReviewColumn(el) {
  const url = el.getAttribute("data-load");
  if (!url) {
    el.innerHTML = '<div class="review-col__empty">❌ No URL</div>';
    return;
  }

  const isJson = url.endsWith(".json");
  const reviewIndex = Number(el.getAttribute("data-json-review-index") || 0);

  console.log("[Review Loader] Loading:", url);

  fetch(url)
    .then((response) => {
      console.log("[Review Loader] Fetch status:", url, response.status);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      return isJson ? response.json() : response.text();
    })
    .then((data) => {
      console.log("[Review Loader] Data received, type:", typeof data);
      let content = "";
      if (isJson) {
        console.log("[Review Loader] Processing JSON, reviews:", Array.isArray(data.reviews) ? data.reviews.length : "not array");
        const review = Array.isArray(data.reviews)
          ? data.reviews[reviewIndex]
          : null;
        if (!review) {
          content = "";
          console.log("[Review Loader] Review not found at index", reviewIndex);
        } else {
          content = formatHumanReview(review);
          console.log("[Review Loader] Formatted review, length:", content.length);
        }
      } else {
        content = String(data || "");
        console.log("[Review Loader] Text content length:", content.length);
      }

      const trimmed = content.trim();
      if (!trimmed) {
        el.innerHTML =
          '<div class="review-col__empty">⚠ No content found</div>';
        console.log("[Review Loader] Empty content for", url);
        return;
      }

      // Apply highlights directly without decoding (source files already have correct quotes)
      const highlighted = applyHighlights(trimmed);

      // Create a wrapper and set the HTML
      const wrapper = document.createElement('div');
      wrapper.className = 'review-content';
      wrapper.innerHTML = highlighted;

      // Clear and append
      el.innerHTML = '';
      el.appendChild(wrapper);

      console.log("[Review Loader] Content loaded successfully");
    })
    .catch((err) => {
      console.error("[Review Loader] Error:", url, err.message);
      el.innerHTML =
        '<div class="review-col__empty">❌ ' + err.message + "</div>";
    });
}

function initReviewCarousel() {
  const slides = document.querySelectorAll(".review-compare__slide");
  slides.forEach((slide) => {
    const bodies = slide.querySelectorAll(".review-col__body");
    bodies.forEach((body) => loadReviewColumn(body));
    setupReviewSyncScroll(slide);
  });
}

$(document).ready(function () {
  // Check for click events on the navbar burger icon

  var options = {
    slidesToScroll: 1,
    slidesToShow: 1,
    loop: true,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 5000,
  };

  // Initialize all div with carousel class
  var carousels = bulmaCarousel.attach(".carousel", options);

  initReviewCarousel();

  // Setup video autoplay for carousel
  setupVideoCarouselAutoplay();
});
