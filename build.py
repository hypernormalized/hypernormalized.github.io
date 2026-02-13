#!/usr/bin/env python3
"""Static site generator for hypernormalized.github.io"""

import os
import shutil
import datetime
import re
from pathlib import Path

import yaml
import markdown
from markdown.extensions.codehilite import CodeHiliteExtension
from markdown.extensions.fenced_code import FencedCodeExtension
from markdown.extensions.meta import MetaExtension
from jinja2 import Environment, FileSystemLoader
from xml.etree.ElementTree import Element, SubElement, tostring

# Paths
ROOT = Path(__file__).parent
CONTENT = ROOT / "content"
TEMPLATES = ROOT / "templates"
STATIC = ROOT / "static"
OUTPUT = ROOT / "_site"

SITE_URL = "https://hypernormalized.github.io"
SITE_TITLE = "hypernormalized"
SITE_DESCRIPTION = "Reduction, systems, and the tension between order and entropy."


def parse_frontmatter(filepath):
    """Parse YAML frontmatter and markdown body from a file."""
    text = filepath.read_text(encoding="utf-8")
    if text.startswith("---"):
        parts = text.split("---", 2)
        if len(parts) >= 3:
            meta = yaml.safe_load(parts[1]) or {}
            body = parts[2].strip()
            return meta, body
    return {}, text


def render_markdown(text):
    """Convert markdown to HTML with code highlighting."""
    md = markdown.Markdown(extensions=[
        CodeHiliteExtension(css_class="highlight", linenums=False),
        FencedCodeExtension(),
        "smarty",
    ])
    return md.convert(text)


def process_sketches(html, meta):
    """Wrap p5.js sketch divs with proper script loading."""
    # Support <!-- sketch: filename.js --> pattern in markdown
    def replace_sketch(match):
        script_name = match.group(1).strip()
        sketch_id = script_name.replace(".js", "").replace("/", "-")
        return (
            f'<div class="sketch-container" id="sketch-{sketch_id}">'
            f'<script src="/js/{script_name}"></script>'
            f'</div>'
        )
    html = re.sub(r'<!--\s*sketch:\s*(.+?)\s*-->', replace_sketch, html)
    return html


def load_content(content_dir, content_type):
    """Load all markdown files from a directory."""
    items = []
    dirpath = CONTENT / content_dir
    if not dirpath.exists():
        return items
    for filepath in sorted(dirpath.glob("*.md")):
        meta, body = parse_frontmatter(filepath)
        html = render_markdown(body)
        html = process_sketches(html, meta)
        slug = filepath.stem
        meta.setdefault("title", slug.replace("-", " ").title())
        meta.setdefault("date", datetime.date.today())
        if isinstance(meta["date"], str):
            meta["date"] = datetime.date.fromisoformat(meta["date"])
        meta["slug"] = slug
        meta["url"] = f"/{content_type}/{slug}/"
        meta["content"] = html
        meta["type"] = content_type
        items.append(meta)
    # Sort reverse chronological
    items.sort(key=lambda x: x["date"], reverse=True)
    return items


def generate_rss(posts, output_path):
    """Generate a simple RSS/Atom feed."""
    rss = Element("rss", version="2.0")
    channel = SubElement(rss, "channel")
    SubElement(channel, "title").text = SITE_TITLE
    SubElement(channel, "link").text = SITE_URL
    SubElement(channel, "description").text = SITE_DESCRIPTION
    SubElement(channel, "language").text = "en"

    for post in posts[:20]:
        item = SubElement(channel, "item")
        SubElement(item, "title").text = post["title"]
        SubElement(item, "link").text = SITE_URL + post["url"]
        SubElement(item, "description").text = post["content"]
        SubElement(item, "pubDate").text = post["date"].strftime(
            "%a, %d %b %Y 00:00:00 GMT"
        )
        SubElement(item, "guid").text = SITE_URL + post["url"]

    xml_bytes = tostring(rss, encoding="unicode", xml_declaration=False)
    output_path.write_text(
        '<?xml version="1.0" encoding="UTF-8"?>\n' + xml_bytes,
        encoding="utf-8",
    )


def build():
    """Build the site."""
    # Clean output
    if OUTPUT.exists():
        shutil.rmtree(OUTPUT)
    OUTPUT.mkdir(parents=True)

    # Copy static files
    if STATIC.exists():
        shutil.copytree(STATIC, OUTPUT, dirs_exist_ok=True)

    # Set up Jinja
    env = Environment(loader=FileSystemLoader(str(TEMPLATES)))
    env.globals["site_title"] = SITE_TITLE
    env.globals["site_url"] = SITE_URL
    env.globals["site_description"] = SITE_DESCRIPTION
    env.globals["now"] = datetime.datetime.now()

    # Load content
    posts = load_content("posts", "log")
    studies = load_content("studies", "studies")

    # Render index
    tmpl = env.get_template("index.html")
    (OUTPUT / "index.html").write_text(tmpl.render(posts=posts, studies=studies))

    # Render log index
    log_dir = OUTPUT / "log"
    log_dir.mkdir(parents=True, exist_ok=True)
    tmpl = env.get_template("log.html")
    (log_dir / "index.html").write_text(tmpl.render(posts=posts))

    # Render individual posts
    tmpl = env.get_template("post.html")
    for post in posts:
        post_dir = OUTPUT / "log" / post["slug"]
        post_dir.mkdir(parents=True, exist_ok=True)
        (post_dir / "index.html").write_text(tmpl.render(post=post))

    # Render studies index
    studies_dir = OUTPUT / "studies"
    studies_dir.mkdir(parents=True, exist_ok=True)
    tmpl = env.get_template("studies.html")
    (studies_dir / "index.html").write_text(tmpl.render(studies=studies))

    # Render individual studies
    tmpl = env.get_template("study.html")
    for study in studies:
        study_dir = OUTPUT / "studies" / study["slug"]
        study_dir.mkdir(parents=True, exist_ok=True)
        (study_dir / "index.html").write_text(tmpl.render(study=study))

    # RSS
    generate_rss(posts + studies, OUTPUT / "feed.xml")

    # .nojekyll
    (OUTPUT / ".nojekyll").touch()

    print(f"Built {len(posts)} posts, {len(studies)} studies → _site/")


if __name__ == "__main__":
    build()
