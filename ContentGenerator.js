const { readFileSync, writeFileSync } = require("node:fs");

class ContentGenerator {
  static file = "";

  static generateHtml(input) {
    const file = `${readFileSync(
      __dirname + "/html-templates/index.html",
      "UTF-8"
    )}`;

    ContentGenerator.file = file;

    const { status, message, output } = input;
    ContentGenerator.addStatus(status);
    ContentGenerator.addContent(output);
    ContentGenerator.addMessage(message);

    writeFileSync(
      __dirname + "/html-templates/output.html",
      ContentGenerator.file,
      "UTF-8"
    );
  }

  static addStatus(input) {
    const html = `${input}`;
    ContentGenerator.file = ContentGenerator.file.replace("<%=STATUS=%>", html);
  }

  static addContent(input) {
    const html = input
      .map((item) => {
        const {
          id,
          user,
          changes_count,
          closed_at,
          source,
          comment,
          hashtags,
          created_by,
        } = item;
        return `
          <div class="output">
            <p>${id}</p>
            <p>${user}</p>
            <p>${changes_count}</p>
            <p>${closed_at}</p>
            <p>${source}</p>
            <p>${comment}</p>
            <p>${hashtags}</p>
            <p>${created_by}</p>
          </div>
        `;
      })
      .join("");
    ContentGenerator.file = ContentGenerator.file.replace("<%=MAIN=%>", html);
  }

  static addMessage(input) {
    const html = `${input}`;
    ContentGenerator.file = ContentGenerator.file.replace(
      "<%=MESSAGE=%>",
      html
    );
  }
}

module.exports = ContentGenerator;
