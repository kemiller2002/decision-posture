(function () {
  function escapeHtml(value) {
    return value
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  function parseInline(text) {
    let html = escapeHtml(text);
    html = html.replace(/`([^`]+)`/g, "<code>$1</code>");
    html = html.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
    html = html.replace(/\*([^*]+)\*/g, "<em>$1</em>");
    return html;
  }

  function splitTableRow(line) {
    return line
      .trim()
      .replace(/^\|/, "")
      .replace(/\|$/, "")
      .split("|")
      .map((cell) => cell.trim());
  }

  function isTableSeparator(line) {
    return /^\|(?:\s*:?-{3,}:?\s*\|)+$/.test(line.trim());
  }

  function isSpecialLine(line) {
    const trimmed = line.trim();
    return (
      trimmed === "" ||
      /^#{1,6}\s+/.test(trimmed) ||
      /^```/.test(trimmed) ||
      /^---+$/.test(trimmed) ||
      /^>\s?/.test(trimmed) ||
      /^[-*]\s+/.test(trimmed) ||
      /^\d+\.\s+/.test(trimmed) ||
      trimmed.startsWith("|")
    );
  }

  function parseMarkdown(markdown) {
    const lines = markdown.replace(/\r\n/g, "\n").split("\n");
    const chunks = [];
    let i = 0;

    while (i < lines.length) {
      const line = lines[i];
      const trimmed = line.trim();

      if (!trimmed) {
        i += 1;
        continue;
      }

      if (/^```/.test(trimmed)) {
        const code = [];
        i += 1;
        while (i < lines.length && !/^```/.test(lines[i].trim())) {
          code.push(lines[i]);
          i += 1;
        }
        if (i < lines.length) i += 1;
        chunks.push("<pre><code>" + escapeHtml(code.join("\n")) + "</code></pre>");
        continue;
      }

      if (/^---+$/.test(trimmed)) {
        chunks.push("<hr>");
        i += 1;
        continue;
      }

      const heading = trimmed.match(/^(#{1,6})\s+(.+)$/);
      if (heading) {
        const level = heading[1].length;
        chunks.push("<h" + level + ">" + parseInline(heading[2]) + "</h" + level + ">");
        i += 1;
        continue;
      }

      if (/^>\s?/.test(trimmed)) {
        const quote = [];
        while (i < lines.length && /^>\s?/.test(lines[i].trim())) {
          quote.push(lines[i].trim().replace(/^>\s?/, ""));
          i += 1;
        }
        chunks.push("<blockquote><p>" + parseInline(quote.join(" ")) + "</p></blockquote>");
        continue;
      }

      if (trimmed.startsWith("|") && i + 1 < lines.length && isTableSeparator(lines[i + 1])) {
        const headers = splitTableRow(lines[i]);
        const rows = [];
        i += 2;
        while (i < lines.length && lines[i].trim().startsWith("|")) {
          rows.push(splitTableRow(lines[i]));
          i += 1;
        }

        const thead = "<thead><tr>" + headers.map((cell) => "<th>" + parseInline(cell) + "</th>").join("") + "</tr></thead>";
        const tbody = "<tbody>" + rows.map((row) => "<tr>" + row.map((cell) => "<td>" + parseInline(cell) + "</td>").join("") + "</tr>").join("") + "</tbody>";
        chunks.push("<table>" + thead + tbody + "</table>");
        continue;
      }

      if (/^[-*]\s+/.test(trimmed)) {
        const items = [];
        while (i < lines.length && /^[-*]\s+/.test(lines[i].trim())) {
          items.push(lines[i].trim().replace(/^[-*]\s+/, ""));
          i += 1;
        }
        chunks.push("<ul>" + items.map((item) => "<li>" + parseInline(item) + "</li>").join("") + "</ul>");
        continue;
      }

      if (/^\d+\.\s+/.test(trimmed)) {
        const items = [];
        while (i < lines.length && /^\d+\.\s+/.test(lines[i].trim())) {
          items.push(lines[i].trim().replace(/^\d+\.\s+/, ""));
          i += 1;
        }
        chunks.push("<ol>" + items.map((item) => "<li>" + parseInline(item) + "</li>").join("") + "</ol>");
        continue;
      }

      const paragraph = [];
      while (i < lines.length && !isSpecialLine(lines[i])) {
        paragraph.push(lines[i].trim());
        i += 1;
      }
      chunks.push("<p>" + parseInline(paragraph.join(" ")) + "</p>");
    }

    return chunks.join("\n");
  }

  async function initGuide() {
    const article = document.querySelector("[data-guide-source]");
    if (!article) return;

    const source = article.getAttribute("data-guide-source");
    const title = article.getAttribute("data-guide-title");

    if (title) {
      document.title = title + " — Clarity Framework";
    }

    try {
      const response = await fetch(source);
      if (!response.ok) {
        throw new Error("Failed to load guide");
      }

      const markdown = await response.text();
      article.innerHTML = parseMarkdown(markdown);
    } catch (error) {
      article.innerHTML = "<p>Unable to load the guide content.</p>";
    }
  }

  initGuide();
})();
