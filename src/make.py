#!/usr/bin/env python

import logging
import glob
import os
import os.path
import re

from jinja2 import Environment, FileSystemLoader
import mistune
from pygments import highlight
from pygments.lexers import get_lexer_by_name
from pygments.styles import get_style_by_name
from pygments.formatters import HtmlFormatter
import yaml


class CustomRenderer(mistune.Renderer):
    def inline_divs(self, styles=None):
        print styles
        if not styles:
            return "</div>"
        return "<div class='{}'>".format(" ".join(styles))


    def block_code(self, code, lang):
        columns = None

        if not lang:
            return "\n<pre><code>{}</code></pre>\n".format(
                mistune.escape(code)
            )

        lexer = get_lexer_by_name(lang, stripall=True)
        formatter = HtmlFormatter()

        return highlight(code, lexer, formatter)


class CustomInlineLexer(mistune.InlineLexer):
    def enable_divs(self):
        self.rules.divs = re.compile(r"%div(,[a-z0-9\,\-]+)?")
        self.default_rules.insert(0, "divs")

    def output_divs(self, match):
        styles = match.group(1)
        if not styles:
            return self.renderer.inline_divs()

        return self.renderer.inline_divs(
            [style for style in styles.split(",") if style]
        )



class MakeEnvironment(object):
    def __init__(self):
        self.template_env = Environment(loader=FileSystemLoader("templates"))
        renderer = CustomRenderer()
        inline = CustomInlineLexer(renderer=renderer)
        inline.enable_divs()

        self.markdown = mistune.Markdown(
            renderer=renderer,
            inline=inline,
        )

    def write_template(self, template_name, dest, ctxt=None):
        dirname = os.path.dirname(dest)
        if not os.path.exists(dirname):
            os.mkdir(dirname)
        logging.info("Writing out generated file (%s)", dest)
        if ctxt is None:
            ctxt = {}
        template = self.template_env.get_template(template_name)
        out = template.render(**ctxt)
        with open(dest, "w") as out_file:
            out_file.write(out.encode("utf-8"))

    def generate_post(self, src):
        with open(src) as post_file:
            text = post_file.read()
        return self.markdown.render(text)


def main():
    logging.basicConfig(level=logging.INFO)

    make_env = MakeEnvironment()

    with open("posts.yaml") as posts_file:
        posts = yaml.safe_load(posts_file.read())

    make_env.write_template("index.html", "../index.html")
    make_env.write_template("posts.html", "../posts/index.html", {
        "posts": posts,
    })
    make_env.write_template("resume.html", "../resume/index.html")


    for post in posts:
        post_html = make_env.generate_post(
            os.path.join("posts", "{}.md".format(post["name"])
        ))
        make_env.write_template(
            "post.html",
            "../posts/{}/index.html".format(post["name"]),
            {
                "title": post["title"],
                "date": post["date"],
                "post": post_html,
                "published": post.get("published", False),
            }
        )


if __name__ == "__main__":
    main()
