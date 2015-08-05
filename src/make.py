#!/usr/bin/env python

import logging
import glob

from jinja2 import Environment, FileSystemLoader
import mistune
from pygments import highlight
from pygments.lexers import get_lexer_by_name
from pygments.styles import get_style_by_name
from pygments.formatters import HtmlFormatter


class HighlightRenderer(mistune.Renderer):
    def block_code(self, code, lang):
        if not lang:
            return "\n<pre><code>%s</code></pre>\n" % mistune.escape(code)

        style = get_style_by_name("monokai")
        lexer = get_lexer_by_name(lang, stripall=True)
        formatter = HtmlFormatter(style=style)

        return highlight(code, lexer, formatter)


class MakeEnvironment(object):
    def __init__(self):
        self.template_env = Environment(loader=FileSystemLoader("templates"))
        self.markdown = mistune.Markdown(renderer=HighlightRenderer())

    def write_template(self, template_name, dest, ctxt=None):
        logging.info("Writing out generated file (%s)", dest)
        if ctxt is None:
            ctxt = {}
        template = self.template_env.get_template(template_name)
        out = template.render(**ctxt)
        with open(dest, "w") as out_file:
            out_file.write(out)

    def generate_post(self, src):
        with open(src) as post_file:
            text = post_file.read()
        return self.markdown.render(text)


def main():
    logging.basicConfig(level=logging.INFO)

    make_env = MakeEnvironment()

    make_env.write_template("index.html", "../index.html")
    make_env.write_template("posts.html", "../posts.html")
    make_env.write_template("resume.html", "../resume.html")

    for post in glob.glob("posts/*.md"):
        post_html = make_env.generate_post(post)
        post_name = post.rsplit("/")[-1][:-3]
        make_env.write_template(
            "post.html",
            "../posts/{}.html".format(post_name),
            {"post": post_html}
        )


if __name__ == "__main__":
    main()
