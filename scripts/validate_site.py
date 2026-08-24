from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlparse


ROOT = Path(__file__).resolve().parents[1] / "public"
SOURCE = Path(__file__).resolve().parents[1] / "content" / "guides"
GUIDES = (
    "configuration-ownership",
    "readable-gitops",
    "database-migrations",
    "safe-pipelines",
    "runtime-secrets",
    "actionable-observability",
    "dns-releases",
    "honest-infrastructure-modules",
    "evidence-led-upgrades",
    "useful-adrs",
)


class PageParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.links: list[str] = []
        self.meta: dict[str, str] = {}
        self.script_count = 0
        self.title_count = 0
        self.active_content: list[str] = []

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        values = dict(attrs)
        if tag == "script":
            self.script_count += 1
        if tag in {"iframe", "object", "embed"}:
            self.active_content.append(f"active element <{tag}>")
        for name, value in attrs:
            normalized_name = name.lower()
            normalized_value = (value or "").strip().lower()
            if normalized_name.startswith("on"):
                self.active_content.append(f"event handler {name}")
            if normalized_name in {"href", "src", "action", "formaction", "xlink:href"} and normalized_value.startswith(
                ("javascript:", "data:text/html")
            ):
                self.active_content.append(f"executable URL in {name}")
        if tag == "meta" and (values.get("http-equiv") or "").lower() == "refresh":
            self.active_content.append("meta refresh")
        if tag == "title":
            self.title_count += 1
        if tag in {"a", "link"} and values.get("href"):
            self.links.append(values["href"])
        if tag in {"img", "script"} and values.get("src"):
            self.links.append(values["src"])
        if tag == "meta":
            key = values.get("name") or values.get("property")
            if key and values.get("content"):
                self.meta[key] = values["content"]


def local_target(url: str) -> Path | None:
    parsed = urlparse(url)
    if parsed.scheme or parsed.netloc or not parsed.path.startswith("/"):
        return None
    relative = parsed.path.lstrip("/")
    target = ROOT / relative
    if parsed.path.endswith("/") or not target.suffix:
        target /= "index.html"
    return target


def validate_page(path: Path) -> PageParser:
    parser = PageParser()
    parser.feed(path.read_text(encoding="utf-8"))
    assert parser.title_count == 1, f"{path}: expected one title"
    assert parser.script_count == 0, f"{path}: static pages may not include scripts"
    assert not parser.active_content, f"{path}: active content found: {parser.active_content}"
    assert parser.meta.get("description"), f"{path}: missing description"
    assert parser.meta.get("og:title"), f"{path}: missing Open Graph title"
    assert parser.meta.get("og:description"), f"{path}: missing Open Graph description"
    assert parser.meta.get("twitter:title"), f"{path}: missing X title"
    assert parser.meta.get("twitter:description"), f"{path}: missing X description"
    for url in parser.links:
        target = local_target(url)
        assert target is None or target.exists(), f"{path}: broken local reference {url}"
    return parser


def main() -> None:
    guide_pages = [ROOT / "guides" / slug / "index.html" for slug in GUIDES]
    pages = [ROOT / "index.html", ROOT / "404.html", ROOT / "guides" / "index.html", *guide_pages]
    parsed: dict[Path, PageParser] = {}
    for page in pages:
        assert page.exists(), f"missing page: {page}"
        parsed[page] = validate_page(page)

    assert len(list((ROOT / "guides").glob("*/index.html"))) == 10
    assert len(list(SOURCE.glob("*.md"))) == 11, "expected 10 guides and one section index"
    assert (ROOT / "styles.css").exists(), "missing stylesheet"
    assert (ROOT / "og.png").exists(), "missing social image"
    assert (ROOT / "sitemap.xml").exists(), "missing sitemap"
    assert (ROOT / "index.xml").exists(), "missing site RSS feed"
    assert (ROOT / "guides" / "index.xml").exists(), "missing guide RSS feed"
    assert (ROOT / "robots.txt").exists(), "missing robots.txt"
    assert (ROOT / "_headers").exists(), "missing Cloudflare headers"

    home_meta = parsed[ROOT / "index.html"].meta
    assert home_meta.get("og:image") == "https://ectogon.org/og.png"
    assert home_meta.get("twitter:image") == "https://ectogon.org/og.png"
    for page in guide_pages:
        meta = parsed[page].meta
        assert meta.get("og:type") == "article", f"{page}: expected article metadata"
        assert "og:image" not in meta, f"{page}: must not inherit the site social image"
        assert "twitter:image" not in meta, f"{page}: must not inherit the site social image"

    print(f"Validated {len(pages)} generated HTML pages, feeds, metadata, and local references.")


if __name__ == "__main__":
    main()
