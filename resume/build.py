#!/usr/bin/env python3
"""
Render one targeted resume PDF per profile in profiles.yaml.

    python3 resume/build.py              # build every profile
    python3 resume/build.py slam cv      # build only named profiles
    python3 resume/build.py --keep-tex   # leave generated .tex for debugging

Content lives in content.yaml; profiles.yaml decides what each PDF shows.
Fields whose value begins with "TODO" are treated as not-yet-provided:
they are dropped from the output and reported at the end, so a draft never
ships a placeholder to an employer.
"""

from __future__ import annotations

import json
import re
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path

import yaml
from jinja2 import Environment, FileSystemLoader, StrictUndefined

HERE = Path(__file__).resolve().parent
REPO_ROOT = HERE.parent
OUT_DIR = HERE / "out"

# content.yaml keys consumed by Python or injected into \href targets
# rather than typeset, so escaping them would corrupt the value.
# (profiles.yaml is deliberately NOT escaped; see main().)
RAW_KEYS = {"link", "linkedin", "github", "website", "email", "id"}

# LaTeX metacharacters, escaped before unicode expansion so the backslashes
# introduced below are not themselves re-escaped.
_SPECIALS = [
    ("\\", r"\textbackslash{}"),
    ("&", r"\&"),
    ("%", r"\%"),
    ("$", r"\$"),
    ("#", r"\#"),
    ("_", r"\_"),
    ("{", r"\{"),
    ("}", r"\}"),
    ("~", r"\textasciitilde{}"),
    ("^", r"\textasciicircum{}"),
]

_UNICODE = {
    "—": r"\textemdash{}",
    "–": r"\textendash{}",
    "·": r"\textperiodcentered{}",
    "≈": r"$\approx$",
    "±": r"$\pm$",
    "×": r"$\times$",
    "≥": r"$\geq$",
    "≤": r"$\leq$",
    "°": r"$^\circ$",
    "→": r"$\rightarrow$",
    "←": r"$\leftarrow$",
    "↗": "",
    "▶": "",
    "…": r"\ldots{}",
    "’": "'",
    "‘": "'",
    "“": "``",
    "”": "''",
    "é": r"\'e",
    "è": r"\`e",
    "á": r"\'a",
    "à": r"\`a",
    "ü": r'\"u',
    "ö": r'\"o',
    "ñ": r"\~n",
    "\u00a0": " ",
    "\u2011": "-",
}


def tex_escape(text: str) -> str:
    for raw, rep in _SPECIALS:
        text = text.replace(raw, rep)
    for raw, rep in _UNICODE.items():
        text = text.replace(raw, rep)
    return text


class Loader:
    """Loads YAML, escaping for LaTeX and stripping TODO placeholders."""

    def __init__(self) -> None:
        self.todos: list[str] = []

    def _is_todo(self, value: object) -> bool:
        return isinstance(value, str) and value.strip().upper().startswith("TODO")

    def clean(self, node: object, path: str = "", escape: bool = True):
        if isinstance(node, dict):
            out = {}
            for key, val in node.items():
                child = f"{path}.{key}" if path else str(key)
                if self._is_todo(val):
                    self.todos.append(child)
                    continue
                cleaned = self.clean(val, child, escape and key not in RAW_KEYS)
                if cleaned is not None:
                    out[key] = cleaned
            return out

        if isinstance(node, list):
            out_list = []
            for i, val in enumerate(node):
                child = f"{path}[{i}]"
                if self._is_todo(val):
                    self.todos.append(child)
                    continue
                cleaned = self.clean(val, child, escape)
                if cleaned is not None:
                    out_list.append(cleaned)
            return out_list

        if isinstance(node, str):
            return tex_escape(node) if escape else node

        return node


def href(url: str, label: str | None = None) -> str:
    """Build a \\href to a bare URL, adding a scheme when absent."""
    label = label or url
    if url.startswith("mailto:") or ("@" in url and "/" not in url):
        target = url if url.startswith("mailto:") else f"mailto:{url}"
    elif url.startswith(("http://", "https://")):
        target = url
    else:
        target = f"https://{url}"
    return rf"\href{{{target}}}{{{tex_escape(label)}}}"


def bold_link(url: str | None, label: str) -> str:
    """Bold, optionally hyperlinked title.

    `label` arrives already LaTeX-escaped by Loader, so it must not be
    escaped again here.
    """
    bold = rf"\textbf{{{label}}}"
    if not url:
        return bold
    target = url if url.startswith(("http://", "https://")) else f"https://{url}"
    return rf"\href{{{target}}}{{{bold}}}"


def build_contact_line(basics: dict) -> str:
    parts = []
    if basics.get("location"):
        parts.append(basics["location"])
    if basics.get("email"):
        parts.append(href(basics["email"]))
    if basics.get("phone"):
        parts.append(tex_escape(basics["phone"]))
    for key in ("website", "linkedin", "github"):
        if basics.get(key):
            parts.append(href(basics[key]))
    return r" $\bullet$ ".join(parts)


def write_site_manifest(profiles: dict, default: str | None, targets: list[Path]) -> None:
    """Emit js/resumes.js so the site's picker always matches profiles.yaml."""
    entries = []
    for key, prof in profiles.items():
        entries.append(
            "  {\n"
            f"    id: {json.dumps(key)},\n"
            f"    label: {json.dumps(prof['label'])},\n"
            f"    blurb: {json.dumps(prof.get('blurb', ''))},\n"
            f"    file: {json.dumps(prof['filename'])},\n"
            f"    isDefault: {json.dumps(key == default)}\n"
            "  }"
        )
    source = (
        "// Generated by resume/build.py — do not edit by hand.\n"
        "// Source of truth: resume/profiles.yaml\n\n"
        "export const resumes = [\n" + ",\n".join(entries) + "\n];\n"
    )
    for target in targets:
        js_dir = target / "js"
        if js_dir.is_dir():
            (js_dir / "resumes.js").write_text(source, encoding="utf-8")
            print(f"  manifest -> {js_dir / 'resumes.js'}")


def page_count(pdf: Path) -> int | None:
    try:
        out = subprocess.run(
            ["pdfinfo", str(pdf)], capture_output=True, text=True, check=True
        ).stdout
        match = re.search(r"^Pages:\s+(\d+)", out, re.M)
        if match:
            return int(match.group(1))
    except (FileNotFoundError, subprocess.CalledProcessError):
        pass
    # Fallback: count page objects in the raw PDF.
    data = pdf.read_bytes()
    found = len(re.findall(rb"/Type\s*/Page[^s]", data))
    return found or None


def render_pdf(tex_source: str, out_pdf: Path, keep_tex: bool) -> tuple[bool, str]:
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    with tempfile.TemporaryDirectory() as tmp:
        tmp_path = Path(tmp)
        tex_file = tmp_path / "resume.tex"
        tex_file.write_text(tex_source, encoding="utf-8")

        log = ""
        # Two passes so hyperref and \hfill layouts settle.
        for _ in range(2):
            proc = subprocess.run(
                [
                    "pdflatex",
                    "-interaction=nonstopmode",
                    "-halt-on-error",
                    "-output-directory",
                    str(tmp_path),
                    str(tex_file),
                ],
                capture_output=True,
                text=True,
            )
            log = proc.stdout + proc.stderr

        produced = tmp_path / "resume.pdf"
        if keep_tex:
            shutil.copy(tex_file, OUT_DIR / f"{out_pdf.stem}.tex")
        if not produced.exists():
            return False, log
        shutil.copy(produced, out_pdf)
        return True, log


def main() -> int:
    args = [a for a in sys.argv[1:] if not a.startswith("-")]
    keep_tex = "--keep-tex" in sys.argv

    loader = Loader()
    raw_content = yaml.safe_load((HERE / "content.yaml").read_text(encoding="utf-8"))
    raw_profiles = yaml.safe_load((HERE / "profiles.yaml").read_text(encoding="utf-8"))

    content = loader.clean(raw_content)
    # Profiles stay raw: their filenames and project/skill ids are lookup
    # keys, and only headline/summary ever reach LaTeX (escaped below).
    profiles = raw_profiles.get("profiles", {})
    default_profile = raw_profiles.get("default")

    if args:
        unknown = [a for a in args if a not in profiles]
        if unknown:
            print(f"Unknown profile(s): {', '.join(unknown)}")
            print(f"Available: {', '.join(profiles)}")
            return 2
        selected = {k: v for k, v in profiles.items() if k in args}
    else:
        selected = profiles

    env = Environment(
        loader=FileSystemLoader(str(HERE)),
        variable_start_string="<<",
        variable_end_string=">>",
        block_start_string="<%",
        block_end_string="%>",
        comment_start_string="<#",
        comment_end_string="#>",
        trim_blocks=True,
        lstrip_blocks=True,
        undefined=StrictUndefined,
    )
    template = env.get_template("template.tex.j2")

    projects_by_id = {p["id"]: p for p in content.get("projects", [])}
    skill_groups = content.get("skills", {})
    contact_line = build_contact_line(content.get("basics", {}))

    failures = 0
    built: list[tuple[str, Path, int | None]] = []

    for name, profile in selected.items():
        wanted = profile.get("projects", [])
        missing = [pid for pid in wanted if pid not in projects_by_id]
        if missing:
            print(f"[{name}] unknown project id(s): {', '.join(missing)}")
            failures += 1
            continue

        chosen = [projects_by_id[pid] for pid in wanted]
        cap = profile.get("max_projects")
        if cap:
            chosen = chosen[:cap]

        # Trim bullets per profile so a dense domain still fits one page.
        bullet_cap = profile.get("max_bullets")
        if bullet_cap:
            chosen = [
                {**p, "bullets": p.get("bullets", [])[:bullet_cap]} for p in chosen
            ]

        groups = []
        for key in profile.get("skills", []):
            if key in skill_groups:
                groups.append(skill_groups[key])
            else:
                print(f"[{name}] warning: unknown skill group '{key}'")

        typeset_profile = dict(profile)
        for field in ("headline", "summary"):
            if profile.get(field):
                typeset_profile[field] = tex_escape(profile[field])

        tex_source = template.render(
            basics=content.get("basics", {}),
            education=content.get("education", []),
            experience=content.get("experience", []),
            awards=content.get("awards", []),
            projects=chosen,
            skills=groups,
            profile=typeset_profile,
            contact_line=contact_line,
            bold_link=bold_link,
        )

        out_pdf = OUT_DIR / profile["filename"]
        ok, log = render_pdf(tex_source, out_pdf, keep_tex)
        if not ok:
            print(f"[{name}] pdflatex FAILED")
            tail = [l for l in log.splitlines() if l.startswith("!") or "Error" in l]
            print("\n".join(tail[:15]) or log[-1500:])
            failures += 1
            continue

        pages = page_count(out_pdf)
        built.append((name, out_pdf, pages))
        print(f"[{name}] {out_pdf.name}  ({pages} page{'s' if pages != 1 else ''})")

    # Publish into every site copy: the deployed Pages repo and the
    # parallel working copy this project keeps identical to it.
    targets = [p for p in (REPO_ROOT, REPO_ROOT.parent) if (p / "index.html").is_file()]
    print()
    for target in targets:
        for _, pdf, _ in built:
            shutil.copy(pdf, target / pdf.name)

        # Keep the long-standing header link alive for anyone with the old URL.
        if default_profile and default_profile in profiles:
            src = OUT_DIR / profiles[default_profile]["filename"]
            if src.exists():
                shutil.copy(src, target / "Gautham_Ramkumar_Resume.pdf")
        print(f"  published {len(built)} PDF(s) -> {target}")

    write_site_manifest(profiles, default_profile, targets)

    if loader.todos:
        print("\n" + "=" * 60)
        print("UNVERIFIED FIELDS — omitted from the PDFs above:")
        for path in sorted(set(loader.todos)):
            print(f"  - {path}")
        print("Fill these in content.yaml, then rebuild.")
        print("=" * 60)

    if failures:
        print(f"\n{failures} profile(s) failed.")
        return 1

    over = [(n, p) for n, _, p in built if p and p > 1]
    if over:
        print("\nOver one page: " + ", ".join(f"{n} ({p}pp)" for n, p in over))
        print("Trim via max_projects or shorter bullets in content.yaml.")

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
